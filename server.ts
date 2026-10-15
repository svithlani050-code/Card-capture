import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

function parseBase64Image(dataUriOrBase64: string): { mimeType: string; data: string } {
  if (dataUriOrBase64.startsWith('data:')) {
    const matches = dataUriOrBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }
  return { mimeType: 'image/jpeg', data: dataUriOrBase64 };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Card extraction endpoint
app.post('/api/scan-card', async (req, res) => {
  try {
    const { frontImage, backImage, operatorNotes } = req.body;

    if (!frontImage) {
      return res.status(400).json({ error: 'Front card image is required (front side).' });
    }

    const ai = getGeminiClient();

    const parts: any[] = [];

    const frontParsed = parseBase64Image(frontImage);
    parts.push({
      inlineData: {
        mimeType: frontParsed.mimeType,
        data: frontParsed.data,
      },
    });

    if (backImage) {
      const backParsed = parseBase64Image(backImage);
      parts.push({
        inlineData: {
          mimeType: backParsed.mimeType,
          data: backParsed.data,
        },
      });
      parts.push({
        text: 'Note: Both Front (first image) and Back (second image) of the card are provided. Merge and extract details from both sides accurately.',
      });
    }

    const promptText = `
You are an expert multilingual document, business card, and ID card recognition system specialized in Indian and global cards.
Examine the card image(s) with high precision.

Supported languages include but are not limited to:
- English
- Hindi (हिंदी - Devanagari script)
- Gujarati (ગુજરાતી - Gujarati script)
- Marathi (मराठी - Devanagari script)
- Punjabi (ਪੰਜਾਬੀ - Gurmukhi script)
- Malayalam (മലയാളം - Malayalam script)
- Bengali (বাংলা - Bengali script)
- Tamil (தமிழ் - Tamil script)
- Telugu (తెలుగు - Telugu script)
- Kannada (ಕನ್ನಡ - Kannada script)
- Urdu (اردو - Nastaliq/Arabic script)
- Other regional/international languages.

Task:
1. Accurately transcribe and extract all card details across all visible scripts.
2. If text is written in an Indian script (like Hindi or Gujarati), provide both:
   - Primary readable name / designation / company
   - 'localizedName' containing the exact original native script spelling (e.g., 'રાજેશ ભાઈ પટેલ' or 'राजेश कुमार शर्मा').
3. Detect phone numbers accurately, recognizing STD codes, +91 country code, mobile prefixes, and WhatsApp indicators.
4. Extract email addresses, website links, social handles.
5. Parse the address into structured components (street, area/landmark, city, state, pincode) and full address string.
6. Identify identification/tax numbers if present (e.g. GSTIN, PAN, CIN, Aadhaar/VID, Driving Licence No, Employee Code, Voter ID).
7. Determine card category: 'Visiting / Business Card', 'Aadhaar / National ID', 'Driving License', 'Corporate / Employee ID', 'Membership Card', 'Visitor Pass', or 'Other'.
8. Provide the complete raw transcript of all recognized text lines in 'rawText'.
9. List all detected languages in 'detectedLanguages' (e.g. ["English", "Hindi", "Gujarati"]).
10. Calculate an overall extraction confidenceScore between 0.0 and 1.0.

${operatorNotes ? `Operator hint: ${operatorNotes}` : ''}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: 'You are an ultra-accurate OCR and entity extraction engine for business and identity cards, particularly across Indian and regional scripts. Return only strictly valid JSON matching the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cardType: { type: Type.STRING },
            fullName: { type: Type.STRING },
            localizedName: { type: Type.STRING },
            designation: { type: Type.STRING },
            company: { type: Type.STRING },
            department: { type: Type.STRING },
            phones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ['number'],
              },
            },
            emails: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            websites: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            address: {
              type: Type.OBJECT,
              properties: {
                full: { type: Type.STRING },
                street: { type: Type.STRING },
                area: { type: Type.STRING },
                city: { type: Type.STRING },
                state: { type: Type.STRING },
                pincode: { type: Type.STRING },
              },
            },
            idNumbers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                },
                required: ['label', 'value'],
              },
            },
            detectedLanguages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            rawText: { type: Type.STRING },
            notes: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
          },
          required: ['cardType', 'fullName', 'detectedLanguages', 'rawText'],
        },
      },
    });

    const textOutput = response.text || '{}';
    const parsedData = JSON.parse(textOutput);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Card scan error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to scan and parse card details.',
    });
  }
});

// Setup dev server with Vite or production static server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartCard Desk server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
