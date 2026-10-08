import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import { PageContainer } from '../components/layout/PageContainer';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import { PdfPreviewModal } from '../components/pdf/PdfPreviewModal';
import { formatFileSize } from '../utils/formatFileSize';
import {
  Lock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  Upload,
  Download,
  Check,
  FileText,
  FileImage,
  Sparkles,
  HelpCircle,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

interface EncryptItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export const EncryptPdf: React.FC = () => {
  const [files, setFiles] = useState<EncryptItem[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null);
  const [unencryptedBlob, setUnencryptedBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = Array.from(e.target.files);
    
    const validItems: EncryptItem[] = [];
    for (const f of selected) {
      const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
      const isImg = f.type.startsWith('image/');
      if (isPdf || isImg) {
        let previewUrl: string | undefined;
        if (isImg) {
          previewUrl = URL.createObjectURL(f);
        }
        validItems.push({
          id: Math.random().toString(36).substring(7),
          file: f,
          name: f.name,
          size: f.size,
          type: isPdf ? 'pdf' : 'image',
          previewUrl,
        });
      }
    }

    if (validItems.length === 0) {
      setErrorMsg('Please select valid PDF or image files (JPG, PNG, WebP).');
      return;
    }

    setFiles(validItems);
    setErrorMsg(null);
    setCompleted(false);
    setEncryptedBlob(null);
    setUnencryptedBlob(null);
  };

  const calculateStrength = (pwd: string): { label: string; color: string; percent: number } => {
    if (!pwd) return { label: 'Empty', color: 'bg-slate-300 dark:bg-slate-700', percent: 0 };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;

    if (score < 40) return { label: 'Weak', color: 'bg-rose-500', percent: score };
    if (score < 75) return { label: 'Medium', color: 'bg-amber-500', percent: score };
    return { label: 'Strong', color: 'bg-emerald-500', percent: score };
  };

  const strength = calculateStrength(password);

  const buildCleanPdfBytes = async (): Promise<Uint8Array> => {
    if (files.length === 0) throw new Error('No files selected.');

    // If a single PDF is selected, return its raw bytes
    if (files.length === 1 && files[0].type === 'pdf') {
      const buf = await files[0].file.arrayBuffer();
      return new Uint8Array(buf);
    }

    // Otherwise, create a unified PDF from images and/or PDFs
    const outPdf = await PDFDocument.create();

    for (const item of files) {
      if (item.type === 'pdf') {
        const itemBuf = await item.file.arrayBuffer();
        const srcPdf = await PDFDocument.load(itemBuf, { ignoreEncryption: true });
        const copiedPages = await outPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => outPdf.addPage(page));
      } else {
        // Image item
        const imgBuf = await item.file.arrayBuffer();
        let embeddedImg;
        const normName = item.name.toLowerCase();

        if (item.file.type === 'image/jpeg' || normName.endsWith('.jpg') || normName.endsWith('.jpeg')) {
          embeddedImg = await outPdf.embedJpg(imgBuf);
        } else if (item.file.type === 'image/png' || normName.endsWith('.png')) {
          embeddedImg = await outPdf.embedPng(imgBuf);
        } else {
          // Convert WebP / other image to PNG via canvas
          const imgElem = new Image();
          const objUrl = URL.createObjectURL(item.file);
          await new Promise((res, rej) => {
            imgElem.onload = () => res(true);
            imgElem.onerror = () => rej(new Error('Failed to load image.'));
            imgElem.src = objUrl;
          });
          const cvs = document.createElement('canvas');
          cvs.width = imgElem.width;
          cvs.height = imgElem.height;
          const ctx = cvs.getContext('2d')!;
          ctx.drawImage(imgElem, 0, 0);
          URL.revokeObjectURL(objUrl);

          const pngBlob = await new Promise<Blob>((res) => cvs.toBlob((b) => res(b!), 'image/png'));
          const pngBuf = await pngBlob.arrayBuffer();
          embeddedImg = await outPdf.embedPng(pngBuf);
        }

        const imgWidth = embeddedImg.width;
        const imgHeight = embeddedImg.height;

        // Fit onto standard A4 or image-ratio page (595.28 x 841.89 points)
        const maxWidth = 595.28;
        const maxHeight = 841.89;
        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        const page = outPdf.addPage([maxWidth, maxHeight]);
        page.drawImage(embeddedImg, {
          x: (maxWidth - drawWidth) / 2,
          y: (maxHeight - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      }
    }

    return await outPdf.save();
  };

  const handleEncryptAndDownload = async () => {
    if (!password.trim()) {
      setErrorMsg('Please enter a password to protect your document.');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const cleanBytes = await buildCleanPdfBytes();
      setUnencryptedBlob(new Blob([cleanBytes as unknown as BlobPart], { type: 'application/pdf' }));

      // Encrypt PDF bytes using 128-bit encryption client-side
      const encryptedBytes = await encryptPDF(cleanBytes, password, ownerPassword.trim() || null);
      const blob = new Blob([encryptedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setEncryptedBlob(blob);

      // Trigger download
      const firstFileName = files[0].name.replace(/\.[^/.]+$/, '');
      const downloadName = `${firstFileName}-protected.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCompleted(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to encrypt document. Please check file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreview = async () => {
    if (files.length === 0) return;
    if (unencryptedBlob) {
      setShowPreview(true);
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const cleanBytes = await buildCleanPdfBytes();
      const b = new Blob([cleanBytes as unknown as BlobPart], { type: 'application/pdf' });
      setUnencryptedBlob(b);
      setShowPreview(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to generate document preview.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageContainer
      title="Encrypt PDF & Password Protect Images Online Free – 100% Client-Side Security"
      description="Add password protection to PDFs and sensitive photos directly in your web browser. 100% private, zero cloud uploads. Lock documents with secure encryption."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'Encrypt PDF', url: '/encrypt-pdf' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>Document Security &bull; Client-Side PDF Encryption</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Password Protect PDF &amp; Images
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Encrypt your sensitive contracts, IDs, medical records, and photos with a password before sharing. 100% in-browser processing—your documents and passwords never touch any server.
          </p>
        </div>

        {/* Upload Zone */}
        {files.length === 0 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer transition-all space-y-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Choose PDF or Image files to Protect
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Drop PDF documents, JPG, PNG, or WebP photos here to secure with password
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Encryption &bull; Zero Server Storage</span>
            </div>
          </div>
        )}

        {/* File Selected & Password Configuration */}
        {files.length > 0 && (
          <div className="pro-card rounded-2xl p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  {files[0].type === 'pdf' ? <FileText className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {files.length === 1 ? files[0].name : `${files.length} Files Selected for Encryption`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total: {formatFileSize(files.reduce((a, b) => a + b.size, 0))} &bull; Output: Protected PDF
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setEncryptedBlob(null);
                  setUnencryptedBlob(null);
                  setCompleted(false);
                }}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer text-left"
              >
                Change Files
              </button>
            </div>

            {/* Password Setup Card */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Set Document Open Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (e.g. MySecretPass123!)"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Password Strength:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password:
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Advanced Owner Password Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{showAdvanced ? 'Hide Advanced Security' : 'Show Advanced Security (Owner Password)'}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Owner / Master Password (Optional):
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Optional administrator password for permissions"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      If left blank, user password will manage document security.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isProcessing}
                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>Preview Document</span>
              </button>

              <button
                type="button"
                onClick={handleEncryptAndDownload}
                disabled={isProcessing || !password.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <span>Encrypting Document Client-Side...</span>
                ) : completed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Protected &amp; Saved! Click to Encrypt Again</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Encrypt &amp; Download Protected PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* PDF Preview Modal before download */}
        <PdfPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          pdfBlob={unencryptedBlob}
          fileName={files.length > 0 ? `${files[0].name.replace(/\.[^/.]+$/, '')}-preview.pdf` : 'document.pdf'}
          title="Document Content Preview (Pre-Encryption)"
          onDownload={handleEncryptAndDownload}
        />

        {/* How It Works & Privacy Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% In-Browser Security</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              No server ever sees your files or passwords. Encryption is calculated directly in your browser's local memory.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Industry Standard Protection</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Generates genuine PDF Standard Security compatible with Adobe Acrobat, Apple Preview, Google Chrome, and PDF readers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <FileImage className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Image to Locked PDF</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Easily turn sensitive photos (IDs, passports, tax slips) into password-protected PDFs so unauthorized parties cannot open them.
            </p>
          </div>
        </div>

        {/* Companion Callout */}
        <AdvancePdfCallout
          variant="compact"
          title="Need Enterprise Digital Signatures or Permission Restricting?"
          description="If you need advanced cryptographic certificates, redaction, or bulk batch protection, visit our companion PDF Tools Pro portal."
        />
      </div>
    </PageContainer>
  );
};
