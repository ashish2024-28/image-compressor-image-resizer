import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatFileSize } from '../../utils/formatFileSize';
import { FileText, Download, ExternalLink, Eye, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';

export interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
  fileName?: string;
  title?: string;
  onDownload?: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfBlob,
  fileName = 'document.pdf',
  title = 'PDF Document Preview',
  onDownload,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (pdfBlob && isOpen) {
      const url = URL.createObjectURL(pdfBlob);
      setBlobUrl(url);
      setLoadError(false);
      return () => {
        URL.revokeObjectURL(url);
        setBlobUrl(null);
      };
    } else {
      setBlobUrl(null);
    }
  }, [pdfBlob, isOpen]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenExternal = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="6xl"
      title={
        <div className="flex items-center gap-2.5 min-w-0 pr-4">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {title}
              </span>
              {pdfBlob && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  {formatFileSize(pdfBlob.size)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {fileName} &bull; Verified in-browser rendering
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-[75vh] sm:h-[80vh]">
        {/* Top Control Bar inside Preview */}
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Eye className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Verify pages and visual quality before saving to your device</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenExternal}
              disabled={!blobUrl}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open full page in browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </button>

            <Button
              variant="success"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* PDF Viewer Frame */}
        <div className="flex-1 mt-3 rounded-xl bg-slate-100 dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 overflow-hidden relative">
          {blobUrl ? (
            <object
              data={`${blobUrl}#toolbar=1&navpanes=1&statusbar=1`}
              type="application/pdf"
              className="w-full h-full"
              onError={() => setLoadError(true)}
            >
              <iframe
                src={`${blobUrl}#toolbar=1`}
                className="w-full h-full border-0"
                title="PDF Document Preview"
                onError={() => setLoadError(true)}
              />
            </object>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
              <FileText className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm font-semibold">Generating PDF preview...</p>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 bg-white/95 dark:bg-[#0c1222]/95 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  PDF Plugin Restricted by Browser
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                  Your browser does not permit inline PDF rendering, but your document is ready and verified!
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={handleOpenExternal}>
                  Open in New Tab
                </Button>
                <Button variant="primary" size="sm" onClick={handleDownload}>
                  Download Document
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="truncate">
            File format: <strong className="text-slate-700 dark:text-slate-300">Adobe PDF Document</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Close
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download PDF ({fileName})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
