/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { useTheme } from './hooks/useTheme';

import { Home } from './pages/Home';
import { CompressImage } from './pages/CompressImage';
import { ResizeImage } from './pages/ResizeImage';
import { ConvertImage } from './pages/ConvertImage';
import { PassportPhotoCreator } from './pages/PassportPhotoCreator';
import { ImageToPdf } from './pages/ImageToPdf';
import { PdfMerge } from './pages/PdfMerge';
import { PdfToImages } from './pages/PdfToImages';
import { PdfCompress } from './pages/PdfCompress';
import { PdfSplit } from './pages/PdfSplit';
import { PdfRotateWatermark } from './pages/PdfRotateWatermark';
import { PdfStudio } from './pages/PdfStudio';
import { Tools } from './pages/Tools';
import { PresetPage } from './pages/PresetPage';
import { Guides } from './pages/Guides';
import { GuideDetail } from './pages/GuideDetail';
import { WebmasterGuide } from './pages/WebmasterGuide';
import { NotFound } from './pages/NotFound';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { HelpSupport } from './pages/HelpSupport';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-600 selection:text-white relative">
        {/* Subtle ambient lighting accent */}
        <div className="absolute inset-x-0 top-0 h-96 ambient-glow pointer-events-none" />

        <Header theme={theme} onThemeChange={setTheme} />
        
        {/* Main application container with flexible max-width wrapper and consistent responsive padding */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10 transition-all flex flex-col">
          <Routes>
            {/* Core Tools & Direct SEO Aliases */}
            <Route path="/" element={<Home />} />
            <Route path="/compress" element={<CompressImage />} />
            <Route path="/image-compressor" element={<CompressImage />} />
            <Route path="/resize" element={<ResizeImage />} />
            <Route path="/image-resizer" element={<ResizeImage />} />
            <Route path="/resize-image" element={<ResizeImage />} />
            <Route path="/convert" element={<ConvertImage />} />
            <Route path="/passport-photo-creator" element={<PassportPhotoCreator />} />
            <Route path="/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/photo-to-pdf" element={<ImageToPdf />} />
            <Route path="/jpg-to-pdf" element={<ImageToPdf />} />
            <Route path="/png-to-pdf" element={<ImageToPdf />} />
            <Route path="/merge-images-to-pdf" element={<ImageToPdf />} />
            <Route path="/convert-photo-to-pdf" element={<ImageToPdf />} />

            {/* Advanced PDF Studio Suite */}
            <Route path="/pdf-studio" element={<PdfStudio />} />
            <Route path="/pdf-tools" element={<PdfStudio />} />
            <Route path="/merge-pdf" element={<PdfMerge />} />
            <Route path="/pdf-merge" element={<PdfMerge />} />
            <Route path="/pdf-to-images" element={<PdfToImages />} />
            <Route path="/pdf-to-jpg" element={<PdfToImages />} />
            <Route path="/pdf-to-png" element={<PdfToImages />} />
            <Route path="/compress-pdf" element={<PdfCompress />} />
            <Route path="/pdf-compress" element={<PdfCompress />} />
            <Route path="/split-pdf" element={<PdfSplit />} />
            <Route path="/pdf-split" element={<PdfSplit />} />
            <Route path="/pdf-rotate-watermark" element={<PdfRotateWatermark />} />
            <Route path="/rotate-pdf" element={<PdfRotateWatermark />} />
            <Route path="/watermark-pdf" element={<PdfRotateWatermark />} />

            <Route path="/tools" element={<Tools />} />

            {/* Specialized Preset Routes & Intent Landing Pages */}
            <Route
              path="/compress-image-for-website"
              element={<PresetPage presetKey="compress-image-for-website" />}
            />
            <Route
              path="/compress-image-for-email"
              element={<PresetPage presetKey="compress-image-for-email" />}
            />
            <Route
              path="/compress-image-for-whatsapp"
              element={<PresetPage presetKey="compress-image-for-whatsapp" />}
            />
            <Route
              path="/compress-image-for-resume"
              element={<PresetPage presetKey="compress-image-for-resume" />}
            />
            <Route
              path="/compress-image-for-instagram"
              element={<PresetPage presetKey="compress-image-for-instagram" />}
            />
            <Route
              path="/social-media-image-resizer"
              element={<PresetPage presetKey="social-media-image-resizer" />}
            />
            <Route
              path="/compress-jpg"
              element={<PresetPage presetKey="compress-jpg" />}
            />
            <Route
              path="/compress-png"
              element={<PresetPage presetKey="compress-png" />}
            />
            <Route
              path="/compress-webp"
              element={<PresetPage presetKey="compress-webp" />}
            />
            <Route
              path="/compress-image-to-100kb"
              element={<PresetPage presetKey="compress-image-to-100kb" />}
            />
            <Route
              path="/compress-image-to-200kb"
              element={<PresetPage presetKey="compress-image-to-200kb" />}
            />
            <Route
              path="/reduce-image-size"
              element={<PresetPage presetKey="reduce-image-size" />}
            />
            <Route
              path="/resize-jpg"
              element={<PresetPage presetKey="resize-jpg" />}
            />
            <Route
              path="/resize-png"
              element={<PresetPage presetKey="resize-png" />}
            />
            <Route
              path="/resize-webp"
              element={<PresetPage presetKey="resize-webp" />}
            />
            <Route
              path="/jpg-to-webp"
              element={<PresetPage presetKey="jpg-to-webp" />}
            />
            <Route
              path="/png-to-webp"
              element={<PresetPage presetKey="png-to-webp" />}
            />

            {/* Guides & Educational Knowledge Base */}
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route path="/blog/:slug" element={<GuideDetail />} />
            <Route path="/webmaster" element={<WebmasterGuide />} />

            {/* Information & Support Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<HelpSupport />} />
            <Route path="/help-and-support" element={<HelpSupport />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Dedicated 404 Error Page */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        <OfflineIndicator />
      </div>
    </BrowserRouter>
  );
}
