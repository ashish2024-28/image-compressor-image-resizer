import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { createWorker } from 'tesseract.js';
import { PageContainer } from '../components/layout/PageContainer';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import { SingleImagePreviewModal } from '../components/image/SingleImagePreviewModal';
import { formatFileSize } from '../utils/formatFileSize';
import {
  Scan,
  Upload,
  Copy,
  Download,
  Check,
  FileText,
  Sparkles,
  RefreshCw,
  Languages,
  Eye,
  Trash2,
  FileSearch,
  ShieldCheck,
  AlertCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

const OCR_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish (Español)' },
  { code: 'fra', name: 'French (Français)' },
  { code: 'deu', name: 'German (Deutsch)' },
  { code: 'ita', name: 'Italian (Italiano)' },
  { code: 'por', name: 'Portuguese (Português)' },
  { code: 'hin', name: 'Hindi (हिन्दी)' },
  { code: 'chi_sim', name: 'Chinese Simplified (简体中文)' },
  { code: 'jpn', name: 'Japanese (日本語)' },
  { code: 'rus', name: 'Russian (Русский)' },
  { code: 'ara', name: 'Arabic (العربية)' },
];

export const ScanOcr: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('eng');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);

  const [copied, setCopied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      setErrorMsg('Please select a valid image (JPG, PNG, WebP) or scanned PDF.');
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setErrorMsg(null);
    setExtractedText('');
    setConfidence(null);
    setProgressPercent(0);
    setProgressStatus('');
  };

  const runOcr = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressPercent(5);
    setProgressStatus('Initializing in-browser OCR engine...');

    let worker: any = null;
    try {
      worker = await createWorker(language, 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgressStatus('Recognizing text characters...');
            setProgressPercent(Math.round((m.progress || 0) * 100));
          } else if (m.status === 'loading tesseract core') {
            setProgressStatus('Loading neural engine...');
            setProgressPercent(20);
          } else if (m.status === 'initializing tesseract') {
            setProgressStatus('Setting language models...');
            setProgressPercent(35);
          } else if (m.status === 'loading language traineddata') {
            setProgressStatus(`Loading trained language vocabulary (${language})...`);
            setProgressPercent(50);
          }
        },
      });

      setProgressStatus('Processing scan...');
      const ret = await worker.recognize(selectedFile);
      const text = ret.data.text;
      const conf = ret.data.confidence;

      setExtractedText(text);
      setConfidence(conf);
      setProgressPercent(100);
      setProgressStatus('Extraction completed!');

      if (text.trim().length > 0) {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      setErrorMsg(err?.message || 'Failed to extract text from file. Please ensure image has legible contrast.');
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMsg('Failed to copy to clipboard.');
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'scanned-document';
    a.download = `${baseName}-extracted-ocr.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <PageContainer
      title="Scan & Extract Text (OCR) Online Free – In-Browser Tesseract OCR"
      description="Extract text from images, receipts, contracts, and scanned photos using browser-based Tesseract.js. 100% private OCR with zero cloud uploads."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'Scan & OCR', url: '/scan-ocr' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Scan className="w-3.5 h-3.5" />
            <span>Optical Character Recognition (OCR) &bull; Image to Text</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Extract Text from Images &amp; Scans (OCR)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Convert photos of receipts, textbooks, handwritten notes, and paper documents into editable digital text using in-browser Tesseract.js neural OCR. 100% local and private.
          </p>
        </div>

        {/* Upload Zone */}
        {!selectedFile && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer transition-all space-y-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Choose an Image or Scan to Extract Text
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Drop scanned papers, invoices, screenshots, or receipts (JPG, PNG, WebP)
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser Tesseract Neural Engine &bull; Zero Server Uploads</span>
            </div>
          </div>
        )}

        {/* File Config & OCR Workspace */}
        {selectedFile && (
          <div className="space-y-6">
            <div className="pro-card rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {selectedFile.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(selectedFile.size)} &bull; Ready for Character Recognition
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>View Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setExtractedText('');
                      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
                      setImagePreviewUrl(null);
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Language selection & Run button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Document Language:
                  </label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {OCR_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:self-end">
                  <button
                    type="button"
                    onClick={runOcr}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing OCR...</span>
                      </>
                    ) : (
                      <>
                        <Scan className="w-3.5 h-3.5" />
                        <span>Extract Text Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Progress bar */}
              {isProcessing && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <span>{progressStatus || 'Analyzing document...'}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-200"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error box */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Results Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column: Image Preview */}
              <div className="pro-card rounded-2xl p-4 space-y-3 flex flex-col">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Scanned Document Source</span>
                  <span className="text-slate-400 text-[11px]">Click image to inspect</span>
                </div>

                <div
                  onClick={() => setShowPreviewModal(true)}
                  className="flex-1 min-h-[260px] max-h-[420px] rounded-xl bg-slate-100 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-2 cursor-pointer hover:opacity-95 transition-opacity"
                >
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Scan preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-slate-400 text-xs">No image loaded</div>
                  )}
                </div>
              </div>

              {/* Right Column: Extracted Text */}
              <div className="pro-card rounded-2xl p-4 space-y-3 flex flex-col">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Extracted Text</span>
                    {confidence !== null && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {Math.round(confidence)}% Confidence
                      </span>
                    )}
                  </div>

                  {extractedText && (
                    <span className="text-[10px] text-slate-400">
                      {wordCount} Words &bull; {charCount} Characters
                    </span>
                  )}
                </div>

                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder={
                    isProcessing
                      ? 'Reading text characters...'
                      : 'Extracted text will appear here. You can also edit and format it directly.'
                  }
                  className="w-full flex-1 min-h-[260px] max-h-[420px] p-3 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                {/* Text Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    disabled={!extractedText.trim()}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-xs transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    disabled={!extractedText.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download as .TXT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Source Lightbox Preview Modal */}
        <SingleImagePreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          imageUrl={imagePreviewUrl}
          fileName={selectedFile?.name || 'document-scan'}
          title="Scanned Document Image Preview"
          fileSize={selectedFile?.size}
        />

        {/* OCR Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Neural WebAssembly OCR</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Powered by Tesseract.js running locally via WebAssembly, extracting text with zero lag and no server dependencies.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Multi-Language Recognition</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Supports English, Spanish, French, German, Hindi, Chinese, Japanese, and multiple script alphabets seamlessly.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Confidential &amp; Private</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Your sensitive business reports, tax filings, and personal invoices never leave your web browser.
            </p>
          </div>
        </div>

        {/* Companion Callout */}
        <AdvancePdfCallout
          variant="compact"
          title="Need Searchable PDF OCR or Multi-Page Book Batch Processing?"
          description="If you need to generate fully searchable PDF/A archives or extract hundreds of pages simultaneously, visit our companion PDF Tools Pro portal."
        />
      </div>
    </PageContainer>
  );
};
