import React from 'react';
import { VisitorRecord } from '../types/card';
import { Printer, X, Check, Building2, User, Phone, MapPin, Calendar, Clock, QrCode } from 'lucide-react';

interface VisitorBadgeModalProps {
  visitor: VisitorRecord;
  onClose: () => void;
  onDoneNext: () => void;
}

export const VisitorBadgeModal: React.FC<VisitorBadgeModalProps> = ({
  visitor,
  onClose,
  onDoneNext,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(visitor.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(visitor.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between no-print">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Official Visitor Pass
            </span>
            <h3 className="text-lg font-bold text-white">
              Visitor Gate Pass #{visitor.tokenNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Printable Pass Body */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 border-2 border-slate-300 shadow-sm print-card-wrapper space-y-4">
          {/* Header of Pass */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                VISITOR PASS / आगंतुक पास
              </h2>
              <p className="text-[11px] font-semibold text-slate-600">
                RECEPTION & SECURITY GATEWAY
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-900">
                #{visitor.tokenNumber}
              </span>
              <p className="text-[10px] text-slate-500 font-mono">TOKEN</p>
            </div>
          </div>

          {/* Time & Date */}
          <div className="flex items-center justify-between text-xs bg-slate-100 p-2 rounded-lg font-medium text-slate-700">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Visitor Core Info */}
          <div className="space-y-2 border-b border-dashed border-slate-300 pb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Visitor Name</p>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {visitor.fullName}
              </h3>
              {visitor.localizedName && (
                <p className="text-sm font-semibold text-indigo-700">
                  {visitor.localizedName}
                </p>
              )}
            </div>

            {visitor.company && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Company / Organization</p>
                <p className="text-sm font-semibold text-slate-800">
                  {visitor.company} {visitor.designation ? `(${visitor.designation})` : ''}
                </p>
              </div>
            )}

            {visitor.phones?.[0]?.number && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Contact Number</p>
                <p className="text-xs font-mono font-bold text-slate-800">
                  {visitor.phones[0].number}
                </p>
              </div>
            )}
          </div>

          {/* Host & Purpose */}
          <div className="grid grid-cols-2 gap-3 text-xs border-b border-dashed border-slate-300 pb-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Person to Meet</p>
              <p className="font-bold text-slate-900">{visitor.notes || visitor.hostPerson || 'Front Desk / Management'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Purpose</p>
              <p className="font-bold text-slate-900">{visitor.visitorPurpose || 'Business Meeting'}</p>
            </div>
          </div>

          {/* QR & Security Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-[9px] text-slate-500 max-w-[200px]">
                Valid for single day entry only. Please wear pass visibly and return to desk upon exit.
              </p>
              <p className="text-[9px] font-bold text-emerald-800">
                ✓ AI Card Scanned & Verified
              </p>
            </div>
            <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center p-1">
              <QrCode className="w-10 h-10 text-slate-800" />
              <span className="text-[8px] font-mono text-slate-600">PASS-{visitor.tokenNumber}</span>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print Badge / Slip (Ctrl+P)</span>
          </button>

          <button
            type="button"
            onClick={onDoneNext}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <Check className="w-4 h-4" />
            <span>Ready for Next Visitor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
