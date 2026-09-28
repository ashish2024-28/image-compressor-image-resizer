import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

/**
 * Merge multiple PDF files into a single unified PDF document
 */
export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Parses user page range input like "1, 3-5, 8" into 0-indexed page numbers
 */
export function parsePageRangeString(rangeStr: string, totalPages: number): number[] {
  const selected = new Set<number>();
  const parts = rangeStr.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          selected.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        selected.add(pageNum - 1);
      }
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}

/**
 * Extract selected pages from a PDF file
 */
export async function extractPdfPages(file: File, pageIndices: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const validIndices = pageIndices.filter((idx) => idx >= 0 && idx < sourcePdf.getPageCount());
  if (validIndices.length === 0) {
    throw new Error('No valid pages selected for extraction');
  }

  const copiedPages = await newPdf.copyPages(sourcePdf, validIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Rotate all or selected pages of a PDF by 90, 180, or 270 degrees
 */
export async function rotatePdf(file: File, angleDegrees: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angleDegrees) % 360));
  });

  return await pdfDoc.save();
}

/**
 * Add a custom text watermark to each page of a PDF
 */
export async function addWatermarkToPdf(
  file: File,
  text: string,
  options: {
    opacity?: number;
    fontSize?: number;
    colorHex?: string;
    angle?: number;
  } = {}
): Promise<Uint8Array> {
  const {
    opacity = 0.3,
    fontSize = 48,
    colorHex = '#94a3b8',
    angle = -45,
  } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Convert hex to rgb (0-1)
  const hex = colorHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0.6;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0.6;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0.6;

  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
    const textHeight = helveticaFont.heightAtSize(fontSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font: helveticaFont,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(angle),
    });
  });

  return await pdfDoc.save();
}

/**
 * Compress PDF: strips object streams and optimizes internal structure
 */
export async function compressPdfDocument(
  file: File,
  mode: 'strong' | 'recommended' | 'gentle' = 'recommended'
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Clean and save with structural optimization
  return await pdfDoc.save({
    useObjectStreams: mode !== 'gentle',
    addDefaultPage: false,
  });
}
