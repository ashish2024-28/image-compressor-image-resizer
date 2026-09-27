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
import { Tools } from './pages/Tools';
import { PresetPage } from './pages/PresetPage';
import { Guides } from './pages/Guides';
import { GuideDetail } from './pages/GuideDetail';
import { WebmasterGuide } from './pages/WebmasterGuide';
import { NotFound } from './pages/NotFound';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
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
            <Route path="/" element={<Home />} />
            <Route path="/compress" element={<CompressImage />} />
            <Route path="/resize" element={<ResizeImage />} />
            <Route path="/convert" element={<ConvertImage />} />
            <Route path="/passport-photo-creator" element={<PassportPhotoCreator />} />
            <Route path="/tools" element={<Tools />} />

            {/* Specialized Preset Routes */}
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

            {/* Guides & Educational Knowledge Base */}
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route path="/webmaster" element={<WebmasterGuide />} />

            {/* Information Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
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
