import JSZip from 'jszip';

interface RenderedPdfPage {
  pageNum: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

let pdfjsLoadedPromise: Promise<any> | null = null;

/**
 * Loads PDF.js dynamically to avoid any bundler worker packaging pitfalls
 */
export async function getPdfJs(): Promise<any> {
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

  if (pdfjsLoadedPromise) {
    return pdfjsLoadedPromise;
  }

  pdfjsLoadedPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      } else {
        reject(new Error('PDF.js library failed to initialize'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
    document.head.appendChild(script);
  });

  return pdfjsLoadedPromise;
}

/**
 * Renders all pages of a PDF to high-resolution images
 */
export async function renderPdfToImages(
  file: File,
  options: {
    scale?: number;
    format?: 'jpeg' | 'png';
    quality?: number;
    onProgress?: (current: number, total: number) => void;
  } = {}
): Promise<RenderedPdfPage[]> {
  const { scale = 2.0, format = 'jpeg', quality = 0.85, onProgress } = options;

  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;

  const pages: RenderedPdfPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Fill white background for transparent PDF elements
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, quality);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), mimeType, quality);
    });

    pages.push({
      pageNum: i,
      dataUrl,
      blob,
      width: viewport.width,
      height: viewport.height,
    });

    if (onProgress) {
      onProgress(i, numPages);
    }
  }

  return pages;
}

/**
 * Creates a ZIP file containing all extracted PDF page images
 */
export async function createPdfImagesZip(
  pages: RenderedPdfPage[],
  baseFilename: string,
  format: 'jpeg' | 'png' = 'jpeg'
): Promise<Blob> {
  const zip = new JSZip();
  const ext = format === 'png' ? 'png' : 'jpg';
  const cleanName = baseFilename.replace(/\.pdf$/i, '');

  pages.forEach((page) => {
    zip.file(`${cleanName}-page-${page.pageNum}.${ext}`, page.blob);
  });

  return await zip.generateAsync({ type: 'blob' });
}
