import { VisitorRecord } from '../types/card';

const STORAGE_KEY = 'smartcard_desk_visitors_v1';

const INITIAL_DEMO_VISITORS: VisitorRecord[] = [
  {
    id: 'vis-seed-1',
    tokenNumber: 101,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    frontImage: '',
    cardType: 'Visiting / Business Card',
    fullName: 'Rajesh Kumar Sharma',
    localizedName: 'राजेश कुमार शर्मा',
    designation: 'Managing Director (मुख्य प्रबंध निदेशक)',
    company: 'Bharat Renewables Enterprises',
    department: 'Executive Management',
    phones: [
      { id: 'p1', number: '+91 98201 44552', type: 'Mobile' },
      { id: 'p2', number: '022-28409911', type: 'Office' },
    ],
    emails: ['rajesh.sharma@bharatrenews.in'],
    websites: ['www.bharatrenews.in'],
    address: {
      full: '402, Udyog Bhavan, BKC, Bandra (East), Mumbai - 400051',
      street: '402, Udyog Bhavan',
      area: 'BKC, Bandra (East)',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
    },
    idNumbers: [{ id: 'id1', label: 'GSTIN', value: '27AABCB1234F1Z8' }],
    detectedLanguages: ['English', 'Hindi (हिंदी)'],
    rawText: 'भारत रिन्यूएबल्स एंटरप्राइजेज\nराजेश कुमार शर्मा\nManaging Director\n+91 98201 44552',
    notes: 'Shyam Vithlani / Director Office',
    confidenceScore: 0.98,
    operatorVerified: true,
    visitorPurpose: 'Business Meeting',
    hostPerson: 'Shyam Vithlani / Director Office',
  },
  {
    id: 'vis-seed-2',
    tokenNumber: 102,
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    frontImage: '',
    cardType: 'Visiting / Business Card',
    fullName: 'Paresh K. Patel',
    localizedName: 'પટેલ પરેશભાઈ કે.',
    designation: 'Managing Partner (ભાગીદાર)',
    company: 'Shree Khodiyar Textiles Pvt. Ltd.',
    department: 'Commercial / Wholesale',
    phones: [
      { id: 'p3', number: '+91 98250 88712', type: 'Mobile' },
      { id: 'p4', number: '0261-2478901', type: 'Office' },
    ],
    emails: ['contact@khodiyartextile.com'],
    websites: ['www.khodiyartextile.com'],
    address: {
      full: '124, Ring Road Textile Market, Surat - 395002, Gujarat',
      street: '124, Ring Road Textile Market',
      area: 'Ring Road',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395002',
    },
    idNumbers: [{ id: 'id2', label: 'GSTIN', value: '24AAACS7789M1ZR' }],
    detectedLanguages: ['Gujarati (ગુજરાતી)', 'English'],
    rawText: 'શ્રી ખોડિયાર ટેક્સટાઈલ્સ પ્રા. લી.\nપટેલ પરેશભાઈ કે.\n+91 98250 88712\nસુરત - ૩૯૫૦૦૨',
    notes: 'Accounts & Vendor Procurement',
    confidenceScore: 0.96,
    operatorVerified: true,
    visitorPurpose: 'Vendor / Supply',
    hostPerson: 'Procurement Dept',
  },
];

export function getStoredVisitors(): VisitorRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial demo visitors so visitor log is populated and CSV export can be tested immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_VISITORS));
      return INITIAL_DEMO_VISITORS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 0) {
      return [];
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read stored visitors', e);
    return INITIAL_DEMO_VISITORS;
  }
}

export function saveVisitorRecord(visitor: VisitorRecord): VisitorRecord[] {
  try {
    const existing = getStoredVisitors();
    const updated = [visitor, ...existing.filter((v) => v.id !== visitor.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('LocalStorage limit possibly reached, trimming image data from oldest entries', e);
    // If quota exceeded, strip heavy images from older entries
    try {
      const existing = getStoredVisitors();
      const slimmed = existing.map((item, idx) => {
        if (idx > 5) {
          return { ...item, frontImage: '', backImage: '' };
        }
        return item;
      });
      const updated = [visitor, ...slimmed.filter((v) => v.id !== visitor.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (inner) {
      console.error('Failed to save to localStorage', inner);
      return [];
    }
  }
}

export function deleteVisitorRecord(id: string): VisitorRecord[] {
  try {
    const existing = getStoredVisitors();
    const updated = existing.filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete record', e);
    return [];
  }
}

export function getNextTokenNumber(): number {
  const visitors = getStoredVisitors();
  if (visitors.length === 0) return 101;
  const maxToken = Math.max(...visitors.map((v) => v.tokenNumber || 100));
  return maxToken + 1;
}
