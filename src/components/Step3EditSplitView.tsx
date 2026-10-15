import React, { useState, useRef } from 'react';
import {
  ExtractedCardData,
  PhoneEntry,
  IdNumberEntry,
} from '../types/card';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Copy,
  Check,
  Plus,
  Trash2,
  Building,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileCheck,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
} from 'lucide-react';
import { UILang } from './Header';

interface Step3EditSplitViewProps {
  frontImage: string;
  backImage: string | null;
  cardData: ExtractedCardData;
  onChange: (updated: ExtractedCardData) => void;
  onSaveAndNext: (printBadge?: boolean) => void;
  onRetake: () => void;
  uiLang: UILang;
}

export const Step3EditSplitView: React.FC<Step3EditSplitViewProps> = ({
  frontImage,
  backImage,
  cardData,
  onChange,
  onSaveAndNext,
  onRetake,
  uiLang,
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number; bgX: number; bgY: number }>({
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
  });

  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // Translations
  const textMap = {
    en: {
      splitTitle: 'Step 3: Card Preview & Editable Fields',
      splitDesc: 'Original card preview with real-time editable fields. Correct any typo, spelling, or digits directly.',
      saveNext: 'Save & Capture Next (Ctrl+Enter)',
      savePrint: 'Save & Print Visitor Badge',
      retake: 'Discard & Re-scan',
      front: 'Front Side',
      back: 'Back Side',
      detectedLangs: 'Detected Languages',
      fullName: 'Full Name',
      localizedName: 'Name in Native Script (Hindi / Gujarati / etc.)',
      designation: 'Designation / Job Title',
      company: 'Company / Organization',
      department: 'Department / Division',
      phones: 'Phone & Mobile Numbers',
      addPhone: 'Add Phone',
      emails: 'Email Addresses',
      addEmail: 'Add Email',
      websites: 'Websites / Links',
      addWebsite: 'Add Website',
      addressSection: 'Address & Location',
      street: 'Street / Building / Suite',
      area: 'Area / Landmark',
      city: 'City',
      state: 'State',
      pincode: 'PIN Code',
      fullAddress: 'Full Formatted Address',
      idNumbers: 'Tax & Identification Numbers',
      addIdNumber: 'Add ID / Number',
      cardType: 'Card Category',
      rawText: 'Raw OCR Recognized Text',
      copyAll: 'Copy',
      copied: 'Copied!',
      operatorCheck: 'Verified by Desk Operator',
      hostPerson: 'Host Person / Person to Meet',
      purpose: 'Visit Purpose',
    },
    hi: {
      splitTitle: 'स्टेप 3 — फोटो और विवरण एक ही स्क्रीन पर',
      splitDesc: 'कार्ड का फोटो देखकर कोई भी स्पेलिंग, अक्षर या नंबर ठीक करें।',
      saveNext: 'सेव करें और अगला कार्ड लें (Ctrl+Enter)',
      savePrint: 'सेव करें और पास प्रिंट करें',
      retake: 'वापस जाएं / नया कार्ड लें',
      front: 'सामने का भाग (Front)',
      back: 'पिछला भाग (Back)',
      detectedLangs: 'पहचानी गई भाषाएं',
      fullName: 'पूरा नाम (Full Name)',
      localizedName: 'मूल लिपि में नाम (हिंदी / गुजराती आदि)',
      designation: 'पद (Designation)',
      company: 'कंपनी / संस्था',
      department: 'विभाग',
      phones: 'फ़ोन / मोबाइल नंबर',
      addPhone: 'नंबर जोड़ें',
      emails: 'ईमेल',
      addEmail: 'ईमेल जोड़ें',
      websites: 'वेबसाइट',
      addWebsite: 'वेबसाइट जोड़ें',
      addressSection: 'पता (Address)',
      street: 'सड़क / भवन संख्या',
      area: 'क्षेत्र / लैंडमार्क',
      city: 'शहर',
      state: 'राज्य',
      pincode: 'पिन कोड',
      fullAddress: 'पूरा पता',
      idNumbers: 'पहचान व कर संख्या (GSTIN / PAN आदि)',
      addIdNumber: 'नंबर जोड़ें',
      cardType: 'कार्ड का प्रकार',
      rawText: 'ओसीआर द्वारा पढ़ा गया मूल टेक्स्ट',
      copyAll: 'कॉपी',
      copied: 'कॉपी हो गया!',
      operatorCheck: 'ऑपरेटर द्वारा सत्यापित किया गया',
      hostPerson: 'किससे मिलना है (Host Person)',
      purpose: 'आने का उद्देश्य (Purpose)',
    },
    gu: {
      splitTitle: 'પગલું 3 — ફોટો અને વિગતો એક જ સ્ક્રીન પર',
      splitDesc: 'કાર્ડ જોઈને કોઈ પણ જોડણી, અક્ષર કે નંબર સુધારો.',
      saveNext: 'સેવ કરો અને આગલું કાર્ડ લો (Ctrl+Enter)',
      savePrint: 'સેવ કરો અને વિઝિટર પાસ પ્રિન્ટ કરો',
      retake: 'પાછા જાઓ / નવું કાર્ડ',
      front: 'આગળનો ભાગ (Front)',
      back: 'પાછળનો ભાગ (Back)',
      detectedLangs: 'ઓળખાયેલી ભાષાઓ',
      fullName: 'પૂરું નામ (Full Name)',
      localizedName: 'મૂળ લિપિમાં નામ (ગુજરાતી / હિન્દી)',
      designation: 'હોદ્દો (Designation)',
      company: 'કંપની / પેઢીનું નામ',
      department: 'વિભાગ',
      phones: 'ફોન / મોબાઈલ નંબર',
      addPhone: 'નંબર ઉમેરો',
      emails: 'ઈ-મેલ',
      addEmail: 'ઈ-મેલ ઉમેરો',
      websites: 'વેબસાઇટ',
      addWebsite: 'વેબસાઇટ ઉમેરો',
      addressSection: 'સરનામું (Address)',
      street: 'શેરી / મકાન',
      area: 'વિસ્તાર / લેન્ડમાર્ક',
      city: 'શહેર',
      state: 'રાજ્ય',
      pincode: 'પિન કોડ',
      fullAddress: 'સંપૂર્ણ સરનામું',
      idNumbers: 'ટેક્સ અને આઈડી નંબર (GSTIN / PAN)',
      addIdNumber: 'નંબર ઉમેરો',
      cardType: 'કાર્ડનો પ્રકાર',
      rawText: 'મૂળ લખાણ (Raw Text)',
      copyAll: 'કૉપી',
      copied: 'કૉપી થયું!',
      operatorCheck: 'ઓપરેટર દ્વારા ચકાસાયેલ',
      hostPerson: 'કોને મળવું છે (Host)',
      purpose: 'મુલાકાતનો હેતુ',
    },
    mr: {
      splitTitle: 'पायरी 3 — फोटो आणि तपशील एकाच स्क्रीनवर',
      splitDesc: 'मूळ कार्ड पाहून कोणतेही स्पेलिंग किंवा नंबर दुरुस्त करा.',
      saveNext: 'जतन करा आणि पुढचे कार्ड (Ctrl+Enter)',
      savePrint: 'जतन करा आणि पास प्रिंट करा',
      retake: 'पुन्हा स्कॅन करा',
      front: 'पुढील बाजू (Front)',
      back: 'मागील बाजू (Back)',
      detectedLangs: 'ओळखलेल्या भाषा',
      fullName: 'पूर्ण नाव',
      localizedName: 'स्थानिक लिपीतील नाव (मराठी/हिंदी)',
      designation: 'पद / हुद्दा',
      company: 'कंपनी / संस्था',
      department: 'विभाग',
      phones: 'फोन / मोबाईल क्रमांक',
      addPhone: 'नंबर जोडा',
      emails: 'ईमेल',
      addEmail: 'ईमेल जोडा',
      websites: 'वेबसाईट',
      addWebsite: 'वेबसाईट जोडा',
      addressSection: 'पत्ता (Address)',
      street: 'रस्ता / इमारत',
      area: 'परिसर / लँडमार्क',
      city: 'शहर',
      state: 'राज्य',
      pincode: 'पिन कोड',
      fullAddress: 'पूर्ण पत्ता',
      idNumbers: 'ओळख व कर क्रमांक (GSTIN / PAN)',
      addIdNumber: 'क्रमांक जोडा',
      cardType: 'कार्ड प्रकार',
      rawText: 'ओसीआर मजकूर',
      copyAll: 'कॉपी',
      copied: 'कॉपी झाले!',
      operatorCheck: 'ऑपरेटरद्वारे सत्यापित',
      hostPerson: 'कोणाला भेटायचे आहे',
      purpose: 'भेटीचा उद्देश',
    },
  }[uiLang];

  const currentDisplayImage = activeSide === 'front' ? frontImage : backImage || frontImage;

  // Copy helper
  const handleCopy = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to Save and proceed
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSaveAndNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSaveAndNext]);

  // Magnifier mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const { left, top, width, height } = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x < 0 || x > width || y < 0 || y > height) {
      setIsMagnifierActive(false);
      return;
    }

    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setMagnifierPos({ x, y, bgX, bgY });
  };

  // Field updaters
  const updateField = (field: keyof ExtractedCardData, value: any) => {
    onChange({ ...cardData, [field]: value });
  };

  const updateAddress = (field: keyof ExtractedCardData['address'], val: string) => {
    const newAddress = { ...cardData.address, [field]: val };
    // rebuild full address string if needed
    onChange({ ...cardData, address: newAddress });
  };

  // Phone list handlers
  const updatePhone = (index: number, key: keyof PhoneEntry, val: string) => {
    const list = [...cardData.phones];
    list[index] = { ...list[index], [key]: val };
    updateField('phones', list);
  };

  const addPhone = () => {
    const list = [
      ...cardData.phones,
      { id: `phone-${Date.now()}`, number: '', type: 'Mobile' },
    ];
    updateField('phones', list);
  };

  const removePhone = (index: number) => {
    const list = cardData.phones.filter((_, idx) => idx !== index);
    updateField('phones', list);
  };

  // Email handlers
  const updateEmail = (index: number, val: string) => {
    const list = [...cardData.emails];
    list[index] = val;
    updateField('emails', list);
  };

  const addEmail = () => {
    updateField('emails', [...cardData.emails, '']);
  };

  const removeEmail = (index: number) => {
    updateField('emails', cardData.emails.filter((_, idx) => idx !== index));
  };

  // ID numbers handlers
  const updateIdNumber = (index: number, key: keyof IdNumberEntry, val: string) => {
    const list = [...cardData.idNumbers];
    list[index] = { ...list[index], [key]: val };
    updateField('idNumbers', list);
  };

  const addIdNumber = () => {
    updateField('idNumbers', [
      ...cardData.idNumbers,
      { id: `id-${Date.now()}`, label: 'GSTIN', value: '' },
    ]);
  };

  const removeIdNumber = (index: number) => {
    updateField('idNumbers', cardData.idNumbers.filter((_, idx) => idx !== index));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              3
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {textMap.splitTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {textMap.splitDesc}
          </p>
        </div>

        {/* Confidence & Languages Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {cardData.confidenceScore !== undefined && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {Math.round(cardData.confidenceScore * 100)}% Confidence
            </span>
          )}

          {cardData.detectedLanguages?.length > 0 && (
            <div className="flex items-center gap-1">
              {cardData.detectedLanguages.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Original Card Inspection (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
            {/* Card Viewer Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveSide('front')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeSide === 'front'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {textMap.front}
                </button>
                {backImage && (
                  <button
                    type="button"
                    onClick={() => setActiveSide('back')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeSide === 'back'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {textMap.back}
                  </button>
                )}
              </div>

              {/* Zoom & Rotate Tools */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  title="Zoom In"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  title="Reset View"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  title="Rotate 90°"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Card Canvas Container */}
            <div
              ref={cardContainerRef}
              onMouseEnter={() => setIsMagnifierActive(true)}
              onMouseLeave={() => setIsMagnifierActive(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-[1.58/1] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center cursor-crosshair select-none"
            >
              <img
                src={currentDisplayImage}
                alt="Card Preview"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-w-full max-h-full object-contain pointer-events-none"
              />

              {/* Magnifier Hover Loupe */}
              {isMagnifierActive && (
                <div
                  style={{
                    left: `${magnifierPos.x - 65}px`,
                    top: `${magnifierPos.y - 65}px`,
                    backgroundImage: `url(${currentDisplayImage})`,
                    backgroundPosition: `${magnifierPos.bgX}% ${magnifierPos.bgY}%`,
                    backgroundSize: '350%',
                  }}
                  className="absolute w-32 h-32 rounded-2xl border-2 border-indigo-400 shadow-2xl pointer-events-none z-30 ring-4 ring-black/40 bg-no-repeat"
                />
              )}

              {/* Hover guide chip */}
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <span className="text-[10px] bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700 backdrop-blur flex items-center gap-1">
                  <Search className="w-2.5 h-2.5 text-indigo-400" />
                  Hover to magnify small text
                </span>
              </div>
            </div>

            {/* Raw OCR Text Expandable Drawer */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowRawText((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1.5 px-2 rounded-lg bg-slate-950/60 border border-slate-800/80"
              >
                <span className="font-semibold">{textMap.rawText}</span>
                {showRawText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showRawText && (
                <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-2 whitespace-pre-wrap">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">OCR Output</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cardData.rawText, 'raw-text')}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-sans flex items-center gap-1"
                    >
                      {copiedField === 'raw-text' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'raw-text' ? 'Copied' : 'Copy All'}
                    </button>
                  </div>
                  {cardData.rawText || 'No raw text recognized.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Operator Manual Correction Form (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
            {/* Card Type & Verification Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {textMap.cardType}
                </label>
                <select
                  value={cardData.cardType}
                  onChange={(e) => updateField('cardType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Visiting / Business Card">Visiting / Business Card</option>
                  <option value="Aadhaar / National ID">Aadhaar / National ID</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Corporate / Employee ID">Corporate / Employee ID</option>
                  <option value="Membership Card">Membership Card</option>
                  <option value="Visitor Pass">Visitor Pass</option>
                  <option value="Other">Other Document</option>
                </select>
              </div>

              <div className="flex items-center sm:justify-end pt-5">
                <label className="flex items-center space-x-2 cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    {textMap.operatorCheck}
                  </span>
                </label>
              </div>
            </div>

            {/* Person & Company Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-400" />
                      {textMap.fullName} *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(cardData.fullName, 'fullName')}
                      className="text-[10px] text-slate-400 hover:text-slate-200"
                    >
                      {copiedField === 'fullName' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cardData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Localized / Native Script Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      {textMap.localizedName}
                    </label>
                    {cardData.localizedName && (
                      <button
                        type="button"
                        onClick={() => handleCopy(cardData.localizedName || '', 'locName')}
                        className="text-[10px] text-slate-400 hover:text-slate-200"
                      >
                        {copiedField === 'locName' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={cardData.localizedName || ''}
                    onChange={(e) => updateField('localizedName', e.target.value)}
                    placeholder="उदा. राजेश कुमार शर्मा / પરેશ પટેલ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-indigo-200 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Designation & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      {textMap.designation}
                    </label>
                    {cardData.designation && (
                      <button
                        type="button"
                        onClick={() => handleCopy(cardData.designation || '', 'desig')}
                        className="text-[10px] text-slate-400 hover:text-slate-200"
                      >
                        {copiedField === 'desig' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={cardData.designation || ''}
                    onChange={(e) => updateField('designation', e.target.value)}
                    placeholder="e.g. Managing Director / Partner"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Building className="w-3 h-3 text-indigo-400" />
                      {textMap.company}
                    </label>
                    {cardData.company && (
                      <button
                        type="button"
                        onClick={() => handleCopy(cardData.company || '', 'comp')}
                        className="text-[10px] text-slate-400 hover:text-slate-200"
                      >
                        {copiedField === 'comp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={cardData.company || ''}
                    onChange={(e) => updateField('company', e.target.value)}
                    placeholder="e.g. Bharat Renewables Enterprises"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details (Phones, Emails, Websites) */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              {/* Phone Numbers List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {textMap.phones}
                  </label>
                  <button
                    type="button"
                    onClick={addPhone}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    {textMap.addPhone}
                  </button>
                </div>

                <div className="space-y-2">
                  {cardData.phones.length === 0 ? (
                    <button
                      type="button"
                      onClick={addPhone}
                      className="w-full py-2 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 hover:text-slate-400"
                    >
                      + Add Phone Number
                    </button>
                  ) : (
                    cardData.phones.map((phone, idx) => (
                      <div key={phone.id || idx} className="flex items-center gap-2">
                        <select
                          value={phone.type}
                          onChange={(e) => updatePhone(idx, 'type', e.target.value)}
                          className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300 font-medium focus:outline-none"
                        >
                          <option value="Mobile">Mobile</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Office">Office</option>
                          <option value="Personal">Personal</option>
                        </select>
                        <input
                          type="text"
                          value={phone.number}
                          onChange={(e) => updatePhone(idx, 'number', e.target.value)}
                          placeholder="+91 98201 44552"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono font-medium focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(phone.number, `phone-${idx}`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                        >
                          {copiedField === `phone-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhone(idx)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Email & Website in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Emails */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      {textMap.emails}
                    </label>
                    <button
                      type="button"
                      onClick={addEmail}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {cardData.emails.length === 0 ? (
                      <input
                        type="email"
                        placeholder="e.g. contact@company.in"
                        onChange={(e) => {
                          if (e.target.value) updateField('emails', [e.target.value]);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                      />
                    ) : (
                      cardData.emails.map((email, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateEmail(idx, e.target.value)}
                            placeholder="user@example.com"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => removeEmail(idx)}
                            className="p-1.5 text-red-400 hover:bg-slate-800 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Websites */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      {textMap.websites}
                    </label>
                    <button
                      type="button"
                      onClick={() => updateField('websites', [...cardData.websites, ''])}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {cardData.websites.length === 0 ? (
                      <input
                        type="text"
                        placeholder="e.g. www.bharatrenews.in"
                        onChange={(e) => {
                          if (e.target.value) updateField('websites', [e.target.value]);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                      />
                    ) : (
                      cardData.websites.map((web, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={web}
                            onChange={(e) => {
                              const list = [...cardData.websites];
                              list[idx] = e.target.value;
                              updateField('websites', list);
                            }}
                            placeholder="www.example.com"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateField('websites', cardData.websites.filter((_, i) => i !== idx));
                            }}
                            className="p-1.5 text-red-400 hover:bg-slate-800 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Breakdown */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {textMap.addressSection}
                </label>
                {cardData.address?.full && (
                  <button
                    type="button"
                    onClick={() => handleCopy(cardData.address?.full || '', 'address')}
                    className="text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>

              <input
                type="text"
                value={cardData.address?.full || ''}
                onChange={(e) => updateAddress('full', e.target.value)}
                placeholder="Full Address string (e.g., 402, Udyog Bhavan, BKC, Mumbai - 400051)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none focus:border-indigo-500"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400">{textMap.city}</label>
                  <input
                    type="text"
                    value={cardData.address?.city || ''}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">{textMap.state}</label>
                  <input
                    type="text"
                    value={cardData.address?.state || ''}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">{textMap.pincode}</label>
                  <input
                    type="text"
                    value={cardData.address?.pincode || ''}
                    onChange={(e) => updateAddress('pincode', e.target.value)}
                    placeholder="e.g. 400051"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">{textMap.area}</label>
                  <input
                    type="text"
                    value={cardData.address?.area || ''}
                    onChange={(e) => updateAddress('area', e.target.value)}
                    placeholder="e.g. BKC / Ring Road"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Identification & Tax Numbers (GSTIN, PAN, etc.) */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  {textMap.idNumbers}
                </label>
                <button
                  type="button"
                  onClick={addIdNumber}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {textMap.addIdNumber}
                </button>
              </div>

              {cardData.idNumbers.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No GSTIN/PAN or ID numbers detected on this card.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cardData.idNumbers.map((id, idx) => (
                    <div key={id.id || idx} className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        value={id.label}
                        onChange={(e) => updateIdNumber(idx, 'label', e.target.value)}
                        placeholder="GSTIN"
                        className="w-20 bg-transparent text-[11px] text-slate-400 font-bold uppercase focus:outline-none"
                      />
                      <input
                        type="text"
                        value={id.value}
                        onChange={(e) => updateIdNumber(idx, 'value', e.target.value)}
                        placeholder="27AABCB1234F1Z8"
                        className="flex-1 bg-transparent text-xs text-slate-200 font-mono font-medium focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeIdNumber(idx)}
                        className="text-red-400 p-1 hover:bg-slate-800 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reception / Desk Visitor Details (For Visitor Slip & Security Pass) */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80 bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/20">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Reception / Security Pass Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                    {textMap.hostPerson}
                  </label>
                  <input
                    type="text"
                    value={cardData.notes || 'Management / Front Desk'}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="e.g. Shyam Vithlani / Director"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                    {textMap.purpose}
                  </label>
                  <select
                    defaultValue="Business Meeting"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium"
                  >
                    <option value="Business Meeting">Business Meeting / मुलाक़ात</option>
                    <option value="Interview">Candidate Interview / इंटरव्यू</option>
                    <option value="Vendor / Supply">Vendor / Material Supply</option>
                    <option value="Client Visit">Client / Partner Visit</option>
                    <option value="Courier / Delivery">Courier / Delivery</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Floating Fixed Dock Bar (Save & Capture Next) */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Shortcut:</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono">
              Ctrl + Enter
            </kbd>
            <span>saves and readies desk for next visitor.</span>
          </div>

          <div className="flex items-center justify-end space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onRetake}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
            >
              {textMap.retake}
            </button>

            <button
              type="button"
              onClick={() => onSaveAndNext(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>{textMap.savePrint}</span>
            </button>

            {/* The Big Primary Step 4 Action */}
            <button
              type="button"
              onClick={() => onSaveAndNext(false)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>{textMap.saveNext}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
