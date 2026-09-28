import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { PageContainer } from '../components/layout/PageContainer';
import { AdBanner, MultiplexAd } from '../components/ads';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import { mergePdfFiles } from '../utils/pdfUtils';
import { formatFileSize } from '../utils/formatFileSize';
import {
  FileText,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Check,
  Layers,
  HelpCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [outputFileName, setOutputFileName] = useState('merged-document.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const added = Array.from(e.target.files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    const items: PdfFileItem[] = added.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...items]);
    setCompleted(false);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setCompleted(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMsg('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const rawFiles = files.map((f) => f.file);
      const mergedBytes = await mergePdfFiles(rawFiles);
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = outputFileName.endsWith('.pdf') ? outputFileName : `${outputFileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCompleted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to merge PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalInputSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <PageContainer
      title="Merge PDF Online Free – Combine Multiple PDF Files | Do PDF Ko Ek Sath Kaise Jode"
      description="Merge multiple PDF files into one single document online for free. Do ya jyada PDF ko ek sath jode. 100% private, no server upload, no watermarks, unlimited pages."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'Merge PDF', url: '/merge-pdf' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>PDF Joiner &bull; Do PDF Ko Ek Sath Jode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Merge Multiple PDF Files Online
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Combine separate PDF contracts, marksheets, receipts, and invoices into one unified PDF document. Fast, in-browser processing with zero server uploads.
          </p>
        </div>

        <AdBanner slotLabel="Header Banner" />

        {/* Dropzone */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] p-8 text-center hover:border-indigo-500 transition-colors shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf,.pdf"
            onChange={handleFilesAdded}
            className="hidden"
            id="pdf-merge-upload"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                + Select PDF Files to Merge
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select 2 or more PDF documents. Client-side local processing guarantees 100% privacy.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Selected Files List & Controls */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{files.length} PDF files selected &bull; Total Size: {formatFileSize(totalInputSize)}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={outputFileName}
                  onChange={(e) => setOutputFileName(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-48"
                  placeholder="merged-document.pdf"
                />
                <button
                  type="button"
                  onClick={handleMerge}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  {isProcessing ? (
                    <span>Merging PDFs...</span>
                  ) : completed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Merged &amp; Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Merge &amp; Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reorderable List */}
            <div className="space-y-2">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      ({formatFileSize(item.size)})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === files.length - 1}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advance PDF Operations Companion Callout */}
        <AdvancePdfCallout
          variant="compact"
          title="Need Advance PDF Merging or Page Operations?"
          description="Need to reorder complex page ranges, merge encrypted/password-protected PDFs, or apply OCR? Visit our companion PDF Tools Pro platform."
        />

        <MultiplexAd slotLabel="Sponsored & Recommended" />

        {/* FAQs */}
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <span>Do PDF Ko Ek Sath Kaise Jode? (FAQ)</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Do ya jyada PDF files ko ek single PDF me merge kaise kare?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                "+ Select PDF Files" par click kare aur apni 2 ya zyada files select kare. Arrow buttons se sequence set kare aur "Merge &amp; Download" dabaye. Sabhi files ek sath jud kar single PDF file ban jayengi.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Kya mere confidential documents safe hain?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Haan! Humare tool me PDF merging client-side JavaScript (pdf-lib) ke through browser RAM me hoti hai. File kisi server par upload nahi hoti, isliye 100% confidential aur safe hai.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
