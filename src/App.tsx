/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, UILang } from './components/Header';
import { Step1Capture } from './components/Step1Capture';
import { ScanningOverlay } from './components/ScanningOverlay';
import { Step3EditSplitView } from './components/Step3EditSplitView';
import { VisitorLogView } from './components/VisitorLogView';
import { VisitorBadgeModal } from './components/VisitorBadgeModal';
import { ExtractedCardData, VisitorRecord, ScanCardApiResponse } from './types/card';
import { getStoredVisitors, saveVisitorRecord, deleteVisitorRecord, getNextTokenNumber } from './utils/storage';
import { playSuccessChime } from './utils/soundEffects';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'scan' | 'log'>('scan');
  const [uiLang, setUiLang] = useState<UILang>('en');

  // Step state: 1 = Capture, 2 = Scanning with Gemini AI, 3 = Side-by-side Inspection & Edit
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Images
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  // Extracted Data
  const [cardData, setCardData] = useState<ExtractedCardData | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Stored Visitors
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [badgeVisitor, setBadgeVisitor] = useState<VisitorRecord | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setVisitors(getStoredVisitors());
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Step 2 Trigger: Call Gemini AI
  const handleStartScanning = async () => {
    if (!frontImage) return;

    setStep(2);
    setIsScanning(true);
    setScanError(null);

    try {
      const response = await fetch('/api/scan-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontImage,
          backImage: backImage || undefined,
        }),
      });

      const result: ScanCardApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to scan card.');
      }

      const raw = result.data;

      // Transform raw response to robust ExtractedCardData
      const parsedData: ExtractedCardData = {
        cardType: raw.cardType || 'Visiting / Business Card',
        fullName: raw.fullName || 'Visitor',
        localizedName: raw.localizedName || '',
        designation: raw.designation || '',
        company: raw.company || '',
        department: raw.department || '',
        phones: (raw.phones && raw.phones.length > 0
          ? raw.phones.map((p, idx) => ({
              id: `phone-${idx}`,
              number: p.number || '',
              type: p.type || 'Mobile',
            }))
          : [{ id: 'phone-0', number: '', type: 'Mobile' }]),
        emails: raw.emails || [],
        websites: raw.websites || [],
        address: {
          full: raw.address?.full || '',
          street: raw.address?.street || '',
          area: raw.address?.area || '',
          city: raw.address?.city || '',
          state: raw.address?.state || '',
          pincode: raw.address?.pincode || '',
        },
        idNumbers: (raw.idNumbers || []).map((id, idx) => ({
          id: `id-${idx}`,
          label: id.label || 'ID',
          value: id.value || '',
        })),
        detectedLanguages: raw.detectedLanguages || ['English'],
        rawText: raw.rawText || '',
        notes: raw.notes || '',
        confidenceScore: raw.confidenceScore ?? 0.95,
      };

      setCardData(parsedData);
      setIsScanning(false);
      setStep(3); // Proceed to Step 3: Side-by-side verification
    } catch (err: any) {
      console.error('Scan failed:', err);
      setIsScanning(false);
      setScanError(err.message || 'Error occurred while analyzing card.');

      // Graceful fallback: Open Step 3 with manual blank fields so operator is never blocked
      const fallbackData: ExtractedCardData = {
        cardType: 'Visiting / Business Card',
        fullName: '',
        localizedName: '',
        designation: '',
        company: '',
        department: '',
        phones: [{ id: 'phone-0', number: '', type: 'Mobile' }],
        emails: [],
        websites: [],
        address: {
          full: '',
          street: '',
          area: '',
          city: '',
          state: '',
          pincode: '',
        },
        idNumbers: [],
        detectedLanguages: ['Manual Entry'],
        rawText: 'OCR could not process. Please type details manually from the preview on the left.',
        notes: '',
        confidenceScore: 0.5,
      };

      setCardData(fallbackData);
      setStep(3);
      showToast(
        'AI recognition server note: Entering manual verification mode.',
        'error'
      );
    }
  };

  // Step 4: Save & Capture Next
  const handleSaveAndNext = (printBadge = false) => {
    if (!cardData || !frontImage) return;

    const tokenNumber = getNextTokenNumber();

    const newRecord: VisitorRecord = {
      ...cardData,
      id: `vis-${Date.now()}`,
      tokenNumber,
      createdAt: new Date().toISOString(),
      frontImage,
      backImage: backImage || undefined,
      operatorVerified: true,
      visitorPurpose: 'Business Meeting',
      hostPerson: cardData.notes || 'Front Desk / Management',
      badgePrinted: printBadge,
    };

    const updatedVisitors = saveVisitorRecord(newRecord);
    setVisitors(updatedVisitors);

    playSuccessChime();

    if (printBadge) {
      setBadgeVisitor(newRecord);
    }

    // Step 4 Reset for Next Visitor
    setFrontImage(null);
    setBackImage(null);
    setCardData(null);
    setStep(1);

    showToast(`Visitor #${tokenNumber} (${newRecord.fullName || 'New'}) saved! Desk ready for next card.`);
  };

  // Retake or Discard
  const handleRetake = () => {
    setCardData(null);
    setStep(1);
  };

  // Delete visitor from history
  const handleDeleteVisitor = (id: string) => {
    const updated = deleteVisitorRecord(id);
    setVisitors(updated);
    showToast('Record deleted.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* App Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        visitorCount={visitors.length}
        uiLang={uiLang}
        onLangChange={setUiLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'log' ? (
          <VisitorLogView
            visitors={visitors}
            onDeleteVisitor={handleDeleteVisitor}
            onPrintBadge={(v) => setBadgeVisitor(v)}
            onBackToScan={() => setCurrentTab('scan')}
            uiLang={uiLang}
          />
        ) : (
          <div className="space-y-6">
            {/* Step 1: Capture Photo (Front required, Back optional) */}
            {step === 1 && (
              <Step1Capture
                frontImage={frontImage}
                backImage={backImage}
                onFrontChange={setFrontImage}
                onBackChange={setBackImage}
                onStartScanning={handleStartScanning}
                uiLang={uiLang}
              />
            )}

            {/* Step 2: Scanning Overlay with Multilingual indicators */}
            {step === 2 && frontImage && (
              <ScanningOverlay
                cardImage={frontImage}
                onCancel={() => {
                  setIsScanning(false);
                  setStep(1);
                }}
                uiLang={uiLang}
              />
            )}

            {/* Step 3: Photo aur Extracted Details ek hi screen par (Side-by-side / Split View) */}
            {step === 3 && cardData && frontImage && (
              <Step3EditSplitView
                frontImage={frontImage}
                backImage={backImage}
                cardData={cardData}
                onChange={setCardData}
                onSaveAndNext={handleSaveAndNext}
                onRetake={handleRetake}
                uiLang={uiLang}
              />
            )}
          </div>
        )}
      </main>

      {/* Visitor Badge / Slip Modal */}
      {badgeVisitor && (
        <VisitorBadgeModal
          visitor={badgeVisitor}
          onClose={() => setBadgeVisitor(null)}
          onDoneNext={() => {
            setBadgeVisitor(null);
            setCurrentTab('scan');
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center space-x-2.5 text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-amber-500/50 text-amber-300'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
