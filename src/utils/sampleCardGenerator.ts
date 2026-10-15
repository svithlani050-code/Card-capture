export interface SampleCardDef {
  id: string;
  name: string;
  languageBadge: string;
  description: string;
  render: () => string; // returns data URL
}

function createCardCanvas(
  width = 1050,
  height = 600,
  draw: (ctx: CanvasRenderingContext2D) => void
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  draw(ctx);
  return canvas.toDataURL('image/png', 0.95);
}

export const SAMPLE_CARDS: SampleCardDef[] = [
  {
    id: 'hindi-corp',
    name: 'Hindi + English Corporate Card',
    languageBadge: 'हिंदी + English',
    description: 'Bharat Renewables - Rajesh Sharma (BKC, Mumbai)',
    render: () => {
      return createCardCanvas(1050, 600, (ctx) => {
        // Background
        const grad = ctx.createLinearGradient(0, 0, 1050, 600);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1050, 600);

        // Accent strip
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 0, 24, 600);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(24, 0, 8, 600);

        // Logo circle
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(100, 95, 36, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('BRE', 68, 106);

        // Company in Hindi
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 30px "Noto Sans Devanagari", sans-serif';
        ctx.fillText('भारत रिन्यूएबल्स एंटरप्राइजेज', 160, 85);

        // Company in English
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('BHARAT RENEWABLES ENTERPRISES', 160, 118);

        // Gold divider
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, 160);
        ctx.lineTo(990, 160);
        ctx.stroke();

        // Person Name in Hindi
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 44px "Noto Sans Devanagari", sans-serif';
        ctx.fillText('राजेश कुमार शर्मा', 60, 230);

        // Person Name in English
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Rajesh Kumar Sharma', 60, 268);

        // Designation
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 22px "Noto Sans Devanagari", sans-serif';
        ctx.fillText('मुख्य प्रबंध निदेशक (Managing Director)', 60, 310);

        // Contact info section
        const startY = 380;
        const spacing = 42;

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';

        ctx.fillText('📞 Mobile: +91 98201 44552  |  Office: 022-28409911', 60, startY);
        ctx.fillText('✉ Email: rajesh.sharma@bharatrenews.in', 60, startY + spacing);
        ctx.fillText('🌐 Web: www.bharatrenews.in', 60, startY + spacing * 2);
        ctx.fillText('📍 402, उद्योग भवन, BKC, बांद्रा (पूर्व), मुंबई - 400051', 60, startY + spacing * 3);

        // GSTIN & Badge
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('GSTIN: 27AABCB1234F1Z8', 60, startY + spacing * 4 + 10);

        // Clean border
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 1030, 580);
      });
    },
  },
  {
    id: 'gujarati-merchant',
    name: 'Gujarati Merchant & Industrialist Card',
    languageBadge: 'ગુજરાતી + English',
    description: 'Shree Khodiyar Textiles - Paresh Patel (Surat)',
    render: () => {
      return createCardCanvas(1050, 600, (ctx) => {
        // Warm ivory / deep crimson border theme
        ctx.fillStyle = '#fefce8';
        ctx.fillRect(0, 0, 1050, 600);

        // Rich border
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 14;
        ctx.strokeRect(20, 20, 1010, 560);

        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 3;
        ctx.strokeRect(34, 34, 982, 532);

        // Top auspicious symbol
        ctx.fillStyle = '#991b1b';
        ctx.font = 'bold 26px "Noto Sans Gujarati", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('॥ શ્રી ગણેશાય નમઃ ॥  ॥ શ્રી ખોડિયાર કૃપા ॥', 525, 75);

        // Company in Gujarati
        ctx.font = 'bold 44px "Noto Sans Gujarati", sans-serif';
        ctx.fillText('શ્રી ખોડિયાર ટેક્સટાઈલ્સ પ્રા. લી.', 525, 140);

        // Company in English
        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('SHREE KHODIYAR TEXTILES PVT. LTD.', 525, 178);

        // Divider
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(150, 205);
        ctx.lineTo(900, 205);
        ctx.stroke();

        ctx.textAlign = 'left';

        // Person in Gujarati
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 40px "Noto Sans Gujarati", sans-serif';
        ctx.fillText('પટેલ પરેશભાઈ કે.', 80, 275);

        // Person in English
        ctx.fillStyle = '#475569';
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('(Paresh K. Patel - Managing Partner)', 80, 315);

        // Contact details
        ctx.fillStyle = '#1e293b';
        ctx.font = '600 23px "Noto Sans Gujarati", "Plus Jakarta Sans", sans-serif';
        ctx.fillText('📱 મોબાઈલ: +91 98250 88712  /  +91 94268 11234', 80, 375);
        ctx.fillText('📞 ફોન: 0261-2478901, 2478902', 80, 415);
        ctx.fillText('✉ ઈ-મેલ: info@khodiyartextile.com', 80, 455);
        ctx.fillText('🏢 ૧૨૪, રીંગ રોડ ટેક્સટાઇલ માર્કેટ, સુરત - ૩૯૫૦૦૨', 80, 495);

        // GSTIN badge
        ctx.fillStyle = '#991b1b';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('GSTIN: 24AAACS7789M1ZR  |  PAN: AAACS7789M', 80, 535);
      });
    },
  },
  {
    id: 'marathi-tech',
    name: 'Marathi + English Automation Card',
    languageBadge: 'मराठी + English',
    description: 'Sahyadri Automation - Dr. Amol Joshi (MIDC, Pune)',
    render: () => {
      return createCardCanvas(1050, 600, (ctx) => {
        // Deep teal corporate background
        ctx.fillStyle = '#042f2e';
        ctx.fillRect(0, 0, 1050, 600);

        // Subtle geometric pattern
        ctx.fillStyle = '#115e59';
        ctx.beginPath();
        ctx.moveTo(700, 0);
        ctx.lineTo(1050, 0);
        ctx.lineTo(1050, 600);
        ctx.lineTo(850, 600);
        ctx.closePath();
        ctx.fill();

        // Company in Marathi
        ctx.fillStyle = '#5eead4';
        ctx.font = 'bold 38px "Noto Sans Devanagari", sans-serif';
        ctx.fillText('सह्याद्री ऑटोमेशन सिस्टीम्स', 60, 90);

        // Company in English
        ctx.fillStyle = '#ccfbf1';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('SAHYADRI AUTOMATION SYSTEMS PVT. LTD.', 60, 128);

        // Person in Marathi
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px "Noto Sans Devanagari", sans-serif';
        ctx.fillText('डॉ. अमोल विनायक जोशी', 60, 230);

        // English designation
        ctx.fillStyle = '#2dd4bf';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Chief Technology Officer (CTO)', 60, 275);

        // Marathi designation
        ctx.fillStyle = '#99f6e4';
        ctx.font = '22px "Noto Sans Devanagari", sans-serif';
        ctx.fillText('मुख्य तंत्रज्ञान अधिकारी', 60, 310);

        // Contact info
        const y = 370;
        ctx.fillStyle = '#f0fdfa';
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('📱 मोबा. : +91 94220 33419  |  कार्यालय: 020-25678900', 60, y);
        ctx.fillText('✉ Email : amol.joshi@sahyadriauto.co.in', 60, y + 42);
        ctx.fillText('🌐 Web   : www.sahyadriauto.co.in', 60, y + 84);
        ctx.fillText('📍 पत्ता : प्लॉट १८, एमआयडीसी भोसरी, पुणे - ४११०२६', 60, y + 126);

        // Card Border
        ctx.strokeStyle = '#0f766e';
        ctx.lineWidth = 4;
        ctx.strokeRect(12, 12, 1026, 576);
      });
    },
  },
  {
    id: 'bengali-id',
    name: 'Bengali + English Professional Card',
    languageBadge: 'বাংলা + English',
    description: 'Bengal Infotech - Subhendu Banerjee (Salt Lake, Kolkata)',
    render: () => {
      return createCardCanvas(1050, 600, (ctx) => {
        // Modern navy & cobalt theme
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 1050, 600);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, 1050, 140);

        // Company in Bengali
        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('বেঙ্গল ইনফোটেক সলিউশন্স', 60, 65);

        // Company in English
        ctx.fillStyle = '#e0e7ff';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('BENGAL INFOTECH SOLUTIONS', 60, 105);

        // Name in Bengali
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText('শুভেন্দু বন্দ্যোপাধ্যায়', 60, 215);

        // Name in English
        ctx.fillStyle = '#c7d2fe';
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Subhendu Bandyopadhyay', 60, 255);

        // Designation
        ctx.fillStyle = '#a5b4fc';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('প্রিন্সিপাল সফটওয়্যার আর্কিটেক্ট (Principal Software Architect)', 60, 298);

        // Contact info
        const y = 360;
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('📞 ফোন: +91 98301 55620  |  অফিস: 033-23574100', 60, y);
        ctx.fillText('✉ ইমেল: s.banerjee@bengalinfotech.org', 60, y + 42);
        ctx.fillText('🌐 ওয়েবসাইট: www.bengalinfotech.org', 60, y + 84);
        ctx.fillText('📍 ব্লক ইপি, সেক্টর ৫, সল্টলেক, কলকাতা - ৭০০০৯১', 60, y + 126);

        // Border
        ctx.strokeStyle = '#312e81';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 1030, 580);
      });
    },
  },
];
