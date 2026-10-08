import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PDFDocument } from 'pdf-lib';
import { PageContainer } from '../components/layout/PageContainer';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import { PdfPreviewModal } from '../components/pdf/PdfPreviewModal';
import { extractPdfPages, parsePageRangeString } from '../utils/pdfUtils';
import { formatFileSize } from '../utils/formatFileSize';
import {
  Scissors,
  Upload,
  Download,
  Check,
  HelpCircle,
  Sparkles,
  Layers,
  Eye,
} from 'lucide-react';

export const PdfSplit: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState('1');
  const [selectedPages, setSelectedPages] = useState<number[]>([0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [extractedBlob, setExtractedBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }

    setSelectedFile(file);
    setErrorMsg(null);
    setCompleted(false);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setTotalPages(count);
      setRangeInput(`1-${Math.min(count, 3)}`);
      setSelectedPages(parsePageRangeString(`1-${Math.min(count, 3)}`, count));
    } catch (err: any) {
      setErrorMsg('Failed to read PDF pages.');
    }
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    if (totalPages > 0) {
      const parsed = parsePageRangeString(val, totalPages);
      setSelectedPages(parsed);
    }
  };

  const togglePageSelection = (pageIndex: number) => {
    const set = new Set(selectedPages);
    if (set.has(pageIndex)) {
      set.delete(pageIndex);
    } else {
      set.add(pageIndex);
    }
    const updated = Array.from(set).sort((a, b) => a - b);
    setSelectedPages(updated);
    setRangeInput(updated.map((i) => i + 1).join(', '));
  };

  const handleExtract = async () => {
    if (!selectedFile || selectedPages.length === 0) {
      setErrorMsg('Please select at least 1 page to extract.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const extractedBytes = await extractPdfPages(selectedFile, selectedPages);
      const blob = new Blob([extractedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setExtractedBlob(blob);
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted-${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCompleted(true);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedFile || selectedPages.length === 0) return;
    if (extractedBlob) {
      setShowPreview(true);
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const extractedBytes = await extractPdfPages(selectedFile, selectedPages);
      const blob = new Blob([extractedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setExtractedBlob(blob);
      setShowPreview(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageContainer
      title="Split PDF Online Free – Extract Pages from PDF | PDF Ke Page Alag Kaise Kare"
      description="Split and extract specific pages from any PDF document online for free. Choose exact page ranges (e.g. 1, 3-5, 8). 100% private in-browser, no upload."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'Split PDF', url: '/split-pdf' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Scissors className="w-3.5 h-3.5" />
            <span>PDF Splitter &bull; PDF Se Pages Alag Kare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Split &amp; Extract PDF Pages Online
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Extract selected pages or separate sheets into a new compact PDF document. Fast client-side extraction with zero cloud storage.
          </p>
        </div>

        {/* Dropzone */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] p-8 text-center hover:border-purple-500 transition-colors shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-split-input"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                + Choose PDF Document
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any PDF document to inspect pages and extract.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Selected File & Extraction Grid */}
        {selectedFile && totalPages > 0 && (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {totalPages} Total Pages &bull; {formatFileSize(selectedFile.size)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isProcessing || selectedPages.length === 0}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-500" />
                  <span>Preview PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={isProcessing || selectedPages.length === 0}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  {isProcessing ? (
                    <span>Extracting...</span>
                  ) : completed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Extracted &amp; Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Extract {selectedPages.length} Pages</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Page Range input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Page Range (e.g. 1, 3-5, 8):
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => handleRangeInputChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="1, 3-5, 8"
              />
            </div>

            {/* Page Grid selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Click pages to toggle selection:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => {
                  const isSelected = selectedPages.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => togglePageSelection(i)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-[10px] uppercase text-slate-400">Page</span>
                      <span>{i + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        <PdfPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          pdfBlob={extractedBlob}
          fileName={selectedFile ? `extracted-${selectedFile.name}` : 'extracted-pages.pdf'}
          title="Extracted PDF Document Preview"
          onDownload={handleExtract}
        />

        {/* Advance PDF Operations Companion Callout */}
        <AdvancePdfCallout
          variant="compact"
          title="Need Advanced PDF Page Splitting or Deletion?"
          description="Looking to delete specific pages, split into equal chunks, or separate PDF by bookmarks? Visit our dedicated companion PDF Tools Pro platform."
        />

        {/* FAQs */}
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            <span>PDF Ke Pages Alag Kaise Kare? (FAQ)</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Kisi bade PDF me se sirf 1 ya 2 zaroori page kaise nikale?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                PDF file select kare. Page grid me se jin pages ko aap alag karna chahte hain unpar click kare ya Page Range me "1, 3-5" likhe. Phir "Extract Pages" par click karke turant naya chhota PDF download kare.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
