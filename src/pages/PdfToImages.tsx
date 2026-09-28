import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PageContainer } from '../components/layout/PageContainer';
import { AdBanner, MultiplexAd } from '../components/ads';
import { renderPdfToImages, createPdfImagesZip } from '../utils/pdfRenderUtils';
import { formatFileSize } from '../utils/formatFileSize';
import {
  FileImage,
  Upload,
  Download,
  Check,
  FileArchive,
  HelpCircle,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ExtractedPage {
  pageNum: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export const PdfToImages: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [isZipping, setIsZipping] = useState(false);
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
    setPages([]);
    setErrorMsg(null);
    setIsProcessing(true);
    setProgressText('Reading PDF file...');

    try {
      const extracted = await renderPdfToImages(file, {
        format,
        scale: 1.8,
        onProgress: (cur, total) => {
          setProgressText(`Rendering page ${cur} of ${total}...`);
        },
      });

      setPages(extracted);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to extract images from PDF.');
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const handleDownloadSingle = (page: ExtractedPage) => {
    const ext = format === 'png' ? 'png' : 'jpg';
    const a = document.createElement('a');
    a.href = page.dataUrl;
    a.download = `${selectedFile?.name.replace(/\.pdf$/i, '') || 'page'}-page-${page.pageNum}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = async () => {
    if (pages.length === 0 || !selectedFile) return;
    setIsZipping(true);

    try {
      const zipBlob = await createPdfImagesZip(pages, selectedFile.name, format);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFile.name.replace(/\.pdf$/i, '')}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMsg('Failed to create ZIP package.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <PageContainer
      title="PDF to Images Converter – Extract PDF to JPG / PNG Online Free | PDF Se Photo Kaise Banaye"
      description="Convert PDF pages into high-resolution JPG or PNG pictures. PDF se photo nikale: Extract every page and download individually or in a ZIP archive. 100% private in-browser."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'PDF to Images', url: '/pdf-to-images' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FileImage className="w-3.5 h-3.5" />
            <span>PDF to JPG Converter &bull; PDF Se Photo Kaise Banaye</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Extract PDF Pages as JPG &amp; PNG Images
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Convert entire PDF documents or specific pages into crystal-clear images. Zero server uploads, maximum fidelity.
          </p>
        </div>

        <AdBanner slotLabel="Header Banner" />

        {/* Dropzone */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] p-8 text-center hover:border-amber-500 transition-colors shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-to-image-input"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                + Choose PDF Document
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any PDF file to extract all pages as high-resolution images.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {isProcessing && (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-center space-y-2">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{progressText}</p>
          </div>
        )}

        {/* Extracted Pages Grid */}
        {pages.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {pages.length} Page(s) Extracted
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="jpeg">JPG Format</option>
                  <option value="png">PNG Format</option>
                </select>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <FileArchive className="w-3.5 h-3.5" />
                  <span>{isZipping ? 'Zipping...' : 'Download All as ZIP'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((p) => (
                <div
                  key={p.pageNum}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Page {p.pageNum}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.width} &times; {p.height}
                    </span>
                  </div>

                  <div className="h-44 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNum}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(p)}
                    className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-500/10 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3 h-3 text-amber-500" />
                    <span>Download Page {p.pageNum}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <MultiplexAd slotLabel="Sponsored & Recommended" />

        {/* FAQs */}
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>PDF Se Photo Kaise Nikale? (FAQ)</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                PDF document se photos kaise nikale?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Apna PDF select kare. Hamara tool automatically har page ko high-resolution JPG ya PNG image me convert kar dega. Phir aap kisi bhi page ko alag se ya sabhi pages ko 1 ZIP file me download kar sakte hain.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
