import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PageContainer } from '../components/layout/PageContainer';
import { AdBanner, MultiplexAd } from '../components/ads';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import { compressPdfDocument } from '../utils/pdfUtils';
import { formatFileSize } from '../utils/formatFileSize';
import {
  FileText,
  Upload,
  Download,
  Check,
  Zap,
  Sliders,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export const PdfCompress: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'strong' | 'recommended' | 'gentle'>('recommended');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
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
    setCompressedBlob(null);
    setCompressedSize(null);
    setErrorMsg(null);
    await runCompression(file, compressionLevel);
  };

  const runCompression = async (file: File, level: 'strong' | 'recommended' | 'gentle') => {
    setIsCompressing(true);
    setErrorMsg(null);

    try {
      const resultBytes = await compressPdfDocument(file, level);
      const blob = new Blob([resultBytes as unknown as BlobPart], { type: 'application/pdf' });
      setCompressedBlob(blob);
      setCompressedSize(blob.size);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to compress PDF.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !selectedFile) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const originalSize = selectedFile?.size || 0;
  const savedBytes = compressedSize && originalSize > compressedSize ? originalSize - compressedSize : 0;
  const reductionPercent = compressedSize && originalSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <PageContainer
      title="Compress PDF Online Free – Reduce PDF Size to 100KB / 200KB | PDF Ka Size Kaise Kam Kare"
      description="Compress PDF online for government exam forms (SSC, UPSC, State PSC) and portals. Reduce PDF size below 100KB or 200KB. 100% private, client-side in-browser tool."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'Compress PDF', url: '/compress-pdf' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>PDF Size Reducer &bull; PDF Ka Size Kaise Kam Kare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compress PDF Online Without Losing Quality
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Reduce PDF file weight for government exam portals, college applications, and email attachments. 100% in-browser processing with zero server uploads.
          </p>
        </div>

        <AdBanner slotLabel="Header Banner" />

        {/* Dropzone */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] p-8 text-center hover:border-emerald-500 transition-colors shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-compress-input"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                + Select PDF to Compress
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any PDF file. Strip redundant metadata and streams locally.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Selected File & Compression Options */}
        {selectedFile && (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Original: {formatFileSize(originalSize)}
                </span>
              </div>

              {/* Compression Preset Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                {(['strong', 'recommended', 'gentle'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setCompressionLevel(lvl);
                      runCompression(selectedFile, lvl);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      compressionLevel === lvl
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Results comparison card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Compressed Result:
                  </span>
                  {compressedSize ? (
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatFileSize(compressedSize)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Processing...</span>
                  )}
                </div>
                {reductionPercent > 0 && (
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Saved {reductionPercent}% ({formatFileSize(savedBytes)})
                  </span>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!compressedBlob || isCompressing}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  {isCompressing ? (
                    <span>Compressing...</span>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Compressed PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advance PDF Operations Companion Callout */}
        <AdvancePdfCallout
          variant="compact"
          title="Need Extreme or Server-Grade PDF Compression?"
          description="If you have large scanned textbooks, embedded vector graphics, or want OCR + extreme raster optimization, try our full PDF Tools Pro platform."
        />

        <MultiplexAd slotLabel="Sponsored & Recommended" />

        {/* FAQs */}
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            <span>PDF Ka Size Kaise Kam Kare 100KB / 200KB? (FAQ)</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Sarkari form ke liye PDF 100KB ya 200KB ke andar kaise laayein?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Apna PDF upload kare aur "Strong" compression preset select kare. Hamara algorithm unused fonts, redundant metadata aur streams ko compress karke file size ko sarkari exam portals (SSC, UPSC, Railway, State PSC) ki limit ke anuroop bana deta hai.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
