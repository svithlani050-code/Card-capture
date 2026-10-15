export interface PhoneEntry {
  id: string;
  number: string;
  type: string; // 'Mobile' | 'WhatsApp' | 'Office' | 'Personal' | 'Other'
}

export interface IdNumberEntry {
  id: string;
  label: string; // e.g. 'GSTIN', 'PAN', 'CIN', 'Emp ID'
  value: string;
}

export interface AddressDetails {
  full: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ExtractedCardData {
  cardType: string;
  fullName: string;
  localizedName?: string;
  designation?: string;
  company?: string;
  department?: string;
  phones: PhoneEntry[];
  emails: string[];
  websites: string[];
  address: AddressDetails;
  idNumbers: IdNumberEntry[];
  detectedLanguages: string[];
  rawText: string;
  notes?: string;
  confidenceScore?: number;
}

export interface VisitorRecord extends ExtractedCardData {
  id: string;
  tokenNumber: number;
  createdAt: string;
  frontImage: string;
  backImage?: string;
  operatorVerified: boolean;
  visitorPurpose: string;
  hostPerson: string;
  badgePrinted?: boolean;
}

export interface ScanCardApiResponse {
  success: boolean;
  data: {
    cardType: string;
    fullName: string;
    localizedName?: string;
    designation?: string;
    company?: string;
    department?: string;
    phones?: Array<{ number: string; type?: string }>;
    emails?: string[];
    websites?: string[];
    address?: {
      full?: string;
      street?: string;
      area?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
    idNumbers?: Array<{ label: string; value: string }>;
    detectedLanguages?: string[];
    rawText: string;
    notes?: string;
    confidenceScore?: number;
  };
  error?: string;
}
