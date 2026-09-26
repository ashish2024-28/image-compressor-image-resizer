# ASHISH SYSTEMSX

> **Explore. Build. Experiment.**  
> *Engineering through exploration.*

---

## 🧭 Brand Philosophy & Meaning

**ASHISH SYSTEMSX** represents a personal engineering space where Ashish explores, builds, and experiments with software systems. Rather than viewing projects merely as commercial endeavors from day one, ASHISH SYSTEMSX treats software as an open-ended engineering laboratory—pushing the boundaries of deterministic client-side architectures, distributed utilities, automated operations, and modern web applications.

```
       ASHISH                  SYSTEMS                     X
┌──────────────────┐    ┌────────────────────┐    ┌─────────────────┐
│ Personal         │    │ Engineering,       │    │ eXplore         │
│ Identity &       │ ── │ Software, and the  │ ── │ Experimentation │
│ Craftsmanship    │    │ Systems We Build   │    │ & Discovery     │
└──────────────────┘    └────────────────────┘    └─────────────────┘
```

- **Ashish**: The personal identity, creative vision, and hands-on craftsmanship behind every architecture.
- **Systems**: The engineering discipline—architecting robust, scalable, resilient software systems, data pipelines, and responsive user experiences.
- **X (eXplore)**: Experimentation, learning, and discovering new technologies. Embracing rapid prototyping, pushing edge technologies, and tackling complex problems through rigorous inquiry.

> *“A personal engineering space where Ashish explores, builds, and experiments with software systems.”*

---

## 🚀 The Systems & Experiments Portfolio

ASHISH SYSTEMSX encompasses a diverse spectrum of software experiments and production systems:

| System / Experiment | Domain | Core Focus & Innovation | Status |
| :--- | :--- | :--- | :--- |
| **Image Optimizer (PWA)** | File Tools & Graphics | 100% Client-side zero-server image compression, format conversion (WebP, AVIF, JPEG, PNG), biometric passport creator, and offline PWA service worker. | **Active / Production** |
| **DERP** | Enterprise Architecture | Enterprise resource planning, workflow automation, distributed data sync, and internal operations experimentation. | **Active / In Development** |
| **E-Commerce Systems** | Commerce & Transactions | Next-generation catalog engines, frictionless checkout funnels, edge caching, and scalable merchant tools. | **Active / In Development** |
| **File & Data Utilities** | Systems Engineering | Offline-first browser file parsing, streaming data transformers, cryptographic hashing, and local format processors. | **Ongoing Exploration** |
| **Autonomous Systems Lab** | AI & Distributed Systems | Experimental systems exploring intelligent agent orchestration, real-time protocols, and serverless compute. | **Exploratory** |

---

## ⚡ Featured Project: Image Optimizer (PWA)

**Image Optimizer** is an offline-capable, privacy-preserving Progressive Web App built under the ASHISH SYSTEMSX umbrella. It enables users to compress, resize, convert, and crop images directly in the web browser without transmitting a single byte to remote servers.

### Key Capabilities

1. **100% In-Browser Privacy & Zero Server Uploads**
   - Utilizes HTML5 Canvas, `createImageBitmap`, and Web Streams to compress and re-encode images directly in volatile client RAM.
   - Ideal for confidential business documents, biometric identity photos, and private imagery.

2. **Progressive Web App (PWA) Offline Operation**
   - Pre-caches application bundles and web fonts via Workbox Service Worker (`vite-plugin-pwa`).
   - Runs seamlessly without an active internet connection after initial installation.

3. **Multi-Format Modern Transcoding**
   - Lossy and lossless conversion across **WebP**, **AVIF**, **JPEG**, and **PNG**.
   - Side-by-side split-screen comparison slider with real-time visual fidelity and file size metrics.

4. **Biometric Passport & Visa Photo Creator**
   - Standardized international specifications (US 2x2 inch, Schengen 35x45 mm, India/UK 35x45 mm, Canada 50x70 mm).
   - Biometric head-height reference overlays and printable multi-photo tile sheets (4x6", A4).

5. **Target File Size Iteration Algorithm**
   - Binary search compression loop that automatically iterates quality levels to guarantee output files satisfy strict upload constraints (e.g., strictly under 200 KB or 500 KB).

6. **Batch Processing & ZIP Archival**
   - Drag-and-drop multiple images simultaneously, apply batch transformation presets, and download all compressed outputs bundled into a `.zip` archive via JSZip.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Modern CSS-first approach)
- **Icons**: Lucide React
- **PWA / Service Worker**: `vite-plugin-pwa` + Workbox
- **Archiving**: `jszip` + `file-saver`
- **Routing**: `react-router-dom` v6
- **Architecture**: Modular functional components, client-side memory safety, zero-pill typography, and adaptive dark/light theming.

---

## 🏁 Quick Start & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- `bun` or `npm` package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/ashish-systemsx/image-optimizer.git

# Navigate into the project directory
cd image-optimizer

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the Vite development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to test the application and PWA service worker.

### Building for Production

```bash
# Typecheck and compile production bundles
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Production Deployment & Google AdSense

This project is 100% production-ready for deployment on **Vercel** with full **Google AdSense** monetisation integration, responsive ad slots, and compliant privacy policies.

- 📖 **Complete Step-by-Step Guide**: See [DEPLOYMENT_AND_ADSENSE_GUIDE.md](./DEPLOYMENT_AND_ADSENSE_GUIDE.md) for terminal commands, GitHub push instructions, Vercel configuration, and the AdSense approval roadmap.
- 🏷️ **ads.txt**: Pre-configured in [public/ads.txt](./public/ads.txt).
- ⚙️ **SPA Rewrites**: Pre-configured in [vercel.json](./vercel.json) to eliminate 404 errors on direct URL refreshes.
- 🛡️ **Cookie & Privacy Policy**: Fully compliant with Google AdSense, GDPR, and CCPA requirements in `/privacy`.

---

## 📐 System Architecture Principles

1. **Deterministic Execution**: Avoid unpredictable server roundtrips; utilize the user's local CPU and GPU for instant pixel transformations.
2. **Privacy as a Default**: No telemetry on user files, no hidden analytics on images, and zero remote data retention.
3. **Resilience & Offline First**: Apps should remain functional in remote or disconnected environments via Progressive Web App standards.
4. **Transparent Engineering**: No misleading marketing claims—clearly illustrate lossy compression trade-offs and byte-level efficiency.

---

## 📄 License & Brand Notice

© 2026 **ASHISH SYSTEMSX** (`Explore. Build. Experiment.`).  
Engineered by Ashish as an experimental software systems space.
