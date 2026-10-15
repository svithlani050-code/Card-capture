import React, { useState } from 'react';
import { VisitorRecord } from '../types/card';
import {
  Search,
  Download,
  Share2,
  Trash2,
  Eye,
  Printer,
  FileSpreadsheet,
  Building,
  User,
  Phone,
  Calendar,
  Sparkles,
  ArrowLeft,
  X,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { exportVisitorsToCSV, exportVisitorToVCard } from '../utils/exportUtils';
import { UILang } from './Header';

interface VisitorLogViewProps {
  visitors: VisitorRecord[];
  onDeleteVisitor: (id: string) => void;
  onPrintBadge: (visitor: VisitorRecord) => void;
  onBackToScan: () => void;
  uiLang: UILang;
}

export const VisitorLogView: React.FC<VisitorLogViewProps> = ({
  visitors,
  onDeleteVisitor,
  onPrintBadge,
  onBackToScan,
  uiLang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardImage, setSelectedCardImage] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filtered = visitors.filter((v) => {
    const term = searchTerm.toLowerCase();
    const matchName = v.fullName?.toLowerCase().includes(term);
    const matchLoc = v.localizedName?.toLowerCase().includes(term);
    const matchComp = v.company?.toLowerCase().includes(term);
    const matchPhone = v.phones?.some((p) => p.number.includes(term));
    const matchCity = v.address?.city?.toLowerCase().includes(term);
    return matchName || matchLoc || matchComp || matchPhone || matchCity;
  });

  const handleDownloadCSV = (recordsToDownload: VisitorRecord[], label = 'all') => {
    const count = recordsToDownload.length;
    exportVisitorsToCSV(recordsToDownload);
    setDownloadNotice(
      count > 0
        ? `Downloaded CSV with ${count} visitor record${count === 1 ? '' : 's'}!`
        : 'Downloaded empty CSV template with headers!'
    );
    setTimeout(() => {
      setDownloadNotice(null);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToScan}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Scanner</span>
            </button>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Visitor Registry & Card Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total {visitors.length} visitors scanned and archived. Export records as CSV anytime.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary CSV Download Button */}
          <button
            type="button"
            id="download-all-csv-button"
            data-testid="download-csv-btn"
            onClick={() => handleDownloadCSV(visitors, 'all')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-95"
            title="Download CSV spreadsheet of all current visitor records"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download CSV</span>
            <span className="bg-emerald-700/80 text-emerald-100 px-1.5 py-0.5 rounded text-[11px] font-mono">
              {visitors.length}
            </span>
          </button>

          {/* Secondary Filtered CSV Download Button (if search is active) */}
          {searchTerm && filtered.length > 0 && filtered.length !== visitors.length && (
            <button
              type="button"
              onClick={() => handleDownloadCSV(filtered, 'filtered')}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              title="Download CSV of current filtered search results"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtered ({filtered.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBackToScan}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Scan New Card</span>
          </button>
        </div>
      </div>

      {/* CSV Download Success Feedback Notice */}
      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button
            onClick={() => setDownloadNotice(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Filter & Subtoolbar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, Hindi/Gujarati script, company, phone, city..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-200">{filtered.length}</strong> of{' '}
            <strong className="text-slate-200">{visitors.length}</strong> visitor records
          </span>

          <button
            type="button"
            onClick={() => handleDownloadCSV(visitors, 'all')}
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold text-xs"
          >
            <Download className="w-3 h-3" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Visitors Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No visitors found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm
                ? 'No visitor matches the search criteria. Try a different name or keyword.'
                : 'No visitor cards scanned yet. Scan a card or download a CSV template.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleDownloadCSV([], 'template')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Blank CSV Template</span>
            </button>
            <button
              type="button"
              onClick={onBackToScan}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Scan Card</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((visitor) => (
            <div
              key={visitor.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all space-y-4 relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Token #{visitor.tokenNumber}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(visitor.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {visitor.frontImage && (
                  <button
                    type="button"
                    onClick={() => setSelectedCardImage(visitor.frontImage)}
                    title="View card photo"
                    className="w-14 h-9 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 hover:scale-105 transition-transform"
                  >
                    <img
                      src={visitor.frontImage}
                      alt="Card thumb"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}
              </div>

              {/* Visitor Details */}
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white leading-tight">
                  {visitor.fullName}
                </h4>
                {visitor.localizedName && (
                  <p className="text-xs font-semibold text-indigo-300">
                    {visitor.localizedName}
                  </p>
                )}
                {visitor.designation && (
                  <p className="text-xs text-slate-400">
                    {visitor.designation}
                  </p>
                )}
                {visitor.company && (
                  <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 pt-0.5">
                    <Building className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">{visitor.company}</span>
                  </p>
                )}
              </div>

              {/* Contact info pills */}
              <div className="text-xs space-y-1 text-slate-300">
                {visitor.phones?.[0]?.number && (
                  <p className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{visitor.phones[0].number}</span>
                  </p>
                )}
                {visitor.address?.city && (
                  <p className="text-[11px] text-slate-400">
                    📍 {visitor.address.city}
                    {visitor.address.state ? `, ${visitor.address.state}` : ''}
                  </p>
                )}
              </div>

              {/* Detected Languages */}
              {visitor.detectedLanguages?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {visitor.detectedLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Card Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => onPrintBadge(visitor)}
                    title="Print Badge"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 flex items-center gap-1 text-[11px]"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Badge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportVisitorToVCard(visitor)}
                    title="Export Contact (vCard)"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>.vcf</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteVisitor(visitor.id)}
                  title="Delete record"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Fullscreen Modal */}
      {selectedCardImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl p-4 border border-slate-800">
            <button
              onClick={() => setSelectedCardImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[1.6/1] w-full rounded-xl overflow-hidden mt-6">
              <img
                src={selectedCardImage}
                alt="Original card"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
