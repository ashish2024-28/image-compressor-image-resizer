import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { 
  Headphones, 
  Copy, 
  Check, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Paperclip, 
  Trash2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  Send, 
  HelpCircle, 
  Info, 
  ShieldAlert, 
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';
import { getLiveSystemDiagnostics, SystemDiagnostics } from '../utils/deviceDiagnostics';
import { formatFileSize } from '../utils/formatFileSize';

// Configuration constants for the multi-app inbox
const TARGET_SUPPORT_EMAIL = 'derp.digital.erp@gmail.com';
const APPLICATION_NAME = 'Image Compressor & Resizer';
const APPLICATION_ID = 'app:image-compressor-resizer';

export type SupportCategory = 
  | 'Bug / Defect Report'
  | 'Feature Request'
  | 'Image Quality / Processing Issue'
  | 'Technical / Device Issue'
  | 'General Feedback & Rating';

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export const HelpSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'report' | 'faq'>('report');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedTool, setSelectedTool] = useState('Full Suite / General');
  const [category, setCategory] = useState<SupportCategory>('Bug / Defect Report');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  
  // Real live diagnostics state
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({});

  // Modals state
  const [showPreSendModal, setShowPreSendModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [copiedFullBody, setCopiedFullBody] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDiagnostics(getLiveSystemDiagnostics());
    
    // Update live viewport on window resize
    const handleResize = () => {
      setDiagnostics(getLiveSystemDiagnostics());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopyRecipient = async () => {
    try {
      await navigator.clipboard.writeText(TARGET_SUPPORT_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Quick suggestion pills based on category
  const quickSuggestions: Record<SupportCategory, string[]> = {
    'Bug / Defect Report': [
      'Compression limit or error',
      'PNG to WebP transparency error',
      'Passport photo dimensions issue',
      'Batch ZIP download failure',
      'Memory limit on high-res upload',
    ],
    'Feature Request': [
      'Request AVIF compression export',
      'Request PDF image extraction tool',
      'Add custom watermark option',
      'Add EXIF metadata viewer & editor',
    ],
    'Image Quality / Processing Issue': [
      'Artifacts after 80% compression',
      'Color shift in converted JPEG',
      'File size didn’t reduce sufficiently',
      'Blurry text after resizing down',
    ],
    'Technical / Device Issue': [
      'Canvas 2D rendering frozen',
      'Offline caching not working',
      'Mobile browser crashed on 20MB file',
      'Safari photo orientation rotated',
    ],
    'General Feedback & Rating': [
      'Love the client-side privacy aspect!',
      'Great UI speed and clean workflow',
      'Suggestion for keyboard shortcuts',
    ],
  };

  const handleApplySuggestion = (text: string) => {
    setSubject(text);
    if (errors.subject) {
      setErrors((prev) => ({ ...prev, subject: undefined }));
    }
  };

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    const newItems: AttachedFile[] = filesArray.map((file) => {
      const isImg = file.type.startsWith('image/');
      return {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      };
    });

    setAttachments((prev) => [...prev, ...newItems]);
    // Reset file input so same file can be picked again if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { subject?: string; description?: string } = {};
    if (!subject.trim()) {
      newErrors.subject = 'Subject / Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Detailed Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenPreSendModal = () => {
    if (validateForm()) {
      setShowPreSendModal(true);
    }
  };

  // Build the standardized email subject & body
  const compileReportEmail = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://image-compressor-image-resizer.vercel.app';
    const timeStr = new Date().toLocaleString();

    // Auto-tagged Subject Line
    const emailSubject = `[App: ${APPLICATION_NAME} · ${selectedTool}] [${category}] ${subject.trim()}`;

    // Attachment list formatted for text body
    let attachmentsText = 'None attached';
    if (attachments.length > 0) {
      attachmentsText = attachments
        .map((a, idx) => `  ${idx + 1}. ${a.name} (${formatFileSize(a.size)}, ${a.type || 'file'})`)
        .join('\n');
      attachmentsText += '\n  [Note: Please verify these files are attached to your email message if needed]';
    }

    // Diagnostics section
    let diagnosticsText = 'Diagnostics disabled by user.';
    if (includeDiagnostics && diagnostics) {
      diagnosticsText = [
        `Browser: ${diagnostics.browser}`,
        `OS: ${diagnostics.os}`,
        `Screen: ${diagnostics.screenResolution} (Viewport: ${diagnostics.viewport} @ ${diagnostics.dpr}x DPR)`,
        `CPU Cores: ${diagnostics.cpuCores}`,
        `Device Memory: ${diagnostics.deviceMemory}`,
        `Canvas 2D Context: ${diagnostics.canvas2d}`,
        `OffscreenCanvas: ${diagnostics.offscreenCanvas}`,
        `WebCodecs API: ${diagnostics.webCodecs}`,
        `Web Audio API: ${diagnostics.webAudio}`,
        `Touch Support: ${diagnostics.touchSupport}`,
        `Network Status: ${diagnostics.networkStatus}`,
        `PWA Standalone: ${diagnostics.pwaStandalone}`,
        `User Agent: ${diagnostics.userAgent}`,
      ].join('\n');
    }

    // Standardized Multi-App Body
    const emailBody = [
      '====================================================',
      `APPLICATION: ${APPLICATION_NAME}`,
      `FEATURE / TOOL: ${selectedTool}`,
      `APP IDENTIFIER: ${APPLICATION_ID}`,
      `HOST DOMAIN: ${origin}`,
      `TARGET SUPPORT DESK: ${TARGET_SUPPORT_EMAIL}`,
      '====================================================',
      '',
      `[APPLICATION NAME]: ${APPLICATION_NAME}`,
      `[REPORT TYPE]: ${category}`,
      `[SUBJECT]: ${subject.trim()}`,
      `[USER EMAIL FOR REPLY]: ${userEmail.trim() || 'Not specified'}`,
      `[DATE & TIME]: ${timeStr}`,
      '',
      '----------------------------------------------------',
      'DETAILED DESCRIPTION & SUGGESTIONS:',
      '----------------------------------------------------',
      description.trim(),
      '',
      '----------------------------------------------------',
      `ATTACHED MEDIA & FILES (${attachments.length} item(s)):`,
      '----------------------------------------------------',
      attachmentsText,
      '',
      '----------------------------------------------------',
      'SYSTEM & APP DIAGNOSTICS:',
      '----------------------------------------------------',
      diagnosticsText,
      '====================================================',
    ].join('\n');

    return { emailSubject, emailBody };
  };

  const handleExecuteSend = () => {
    setShowPreSendModal(false);
    const { emailSubject, emailBody } = compileReportEmail();

    // Trigger mailto:
    const mailtoUrl = `mailto:${encodeURIComponent(TARGET_SUPPORT_EMAIL)}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoUrl;

    // Show completion assistance modal
    setShowCompletionModal(true);
  };

  const handleCopyFullReport = async () => {
    const { emailSubject, emailBody } = compileReportEmail();
    const fullText = `Subject: ${emailSubject}\n\n${emailBody}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedFullBody(true);
      setTimeout(() => setCopiedFullBody(false), 3000);
    } catch {
      // Fallback
    }
  };

  const getGmailWebUrl = () => {
    const { emailSubject, emailBody } = compileReportEmail();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      TARGET_SUPPORT_EMAIL
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const getOutlookWebUrl = () => {
    const { emailSubject, emailBody } = compileReportEmail();
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(
      TARGET_SUPPORT_EMAIL
    )}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <PageContainer
      title="Help & Support – Report Issues & Suggestions"
      description="Report errors, request features, or send diagnostics directly to our shared engineering inbox for Image Compressor & Resizer."
      breadcrumbs={[{ name: 'Support', url: '/support' }]}
    >
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tools</span>
          </Link>
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400 dark:text-slate-500">
            Support Desk
          </span>
        </div>

        {/* Header Hero Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#131b2e] to-[#0c1222] p-5 sm:p-6 text-white shadow-xl space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                Help &amp; Support / Report &amp; Suggest
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Report errors, request features &amp; message{' '}
                <span className="text-amber-300 font-mono text-base sm:text-lg underline underline-offset-2">
                  {TARGET_SUPPORT_EMAIL}
                </span>
              </h1>
            </div>
          </div>

          {/* Segmented Dual-Tab Controls */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-700/60'
              }`}
            >
              <span>✏️</span>
              <span>Report &amp; Suggest</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-700/60'
              }`}
            >
              <span>❓</span>
              <span>FAQ &amp; Troubleshooting</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Report & Suggest Portal */}
        {activeTab === 'report' && (
          <div className="space-y-5">
            {/* Recipient Card */}
            <div className="rounded-xl border border-slate-700/60 bg-[#0e1628] p-4 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Reports &amp; Feedback Recipient
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-sky-400 font-semibold">
                    {TARGET_SUPPORT_EMAIL}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyRecipient}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-800/80 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Application Identifier Card (Locked Read-Only) */}
            <div className="rounded-xl border border-blue-500/30 bg-[#0c1527] p-4 text-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">Application Identifier</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Auto-Tagged in Subject
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  ID: {APPLICATION_ID}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Distinguishes this issue in your shared multi-app inbox ({TARGET_SUPPORT_EMAIL})
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Read-Only App Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Application / Workspace Name
                    </label>
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Read-Only</span>
                    </span>
                  </div>
                  <div className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/90 text-slate-300 cursor-not-allowed select-none flex items-center justify-between">
                    <span>{APPLICATION_NAME}</span>
                    <Lock className="w-3 h-3 text-slate-500" />
                  </div>
                </div>

                {/* Sub-Tool Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Tool or Section (Auto-Appends)
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTool}
                      onChange={(e) => setSelectedTool(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                    >
                      <option value="Full Suite / General">Full Suite / General</option>
                      <option value="Image Compressor (/compress)">Image Compressor (/compress)</option>
                      <option value="Image Resizer (/resize)">Image Resizer (/resize)</option>
                      <option value="Format Converter (/convert)">Format Converter (/convert)</option>
                      <option value="Passport Photo Creator (/passport-photo-creator)">
                        Passport Photo Creator (/passport-photo)
                      </option>
                      <option value="Batch ZIP Download">Batch ZIP Download</option>
                      <option value="Preset Workflows (/compress-image-for-website, etc.)">
                        Preset Workflows &amp; Guides
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400">
                What would you like to report or request?
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Bug / Defect Report',
                    'Feature Request',
                    'Image Quality / Processing Issue',
                    'Technical / Device Issue',
                    'General Feedback & Rating',
                  ] as SupportCategory[]
                ).map((cat) => {
                  const isSelected = category === cat;
                  let icon = '🐞';
                  if (cat === 'Feature Request') icon = '💡';
                  if (cat === 'Image Quality / Processing Issue') icon = '📄';
                  if (cat === 'Technical / Device Issue') icon = '⚙️';
                  if (cat === 'General Feedback & Rating') icon = '💬';

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold ring-2 ring-amber-400/50 shadow-md'
                          : 'bg-[#111827] text-slate-300 border border-slate-700/80 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <span>{icon}</span>
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject / Title Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Subject / Issue / Feature Title <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] font-bold text-amber-400">REQUIRED</span>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                }}
                placeholder="e.g. Compression limit error or Request WebP batch preset..."
                className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-[#111827] text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.subject
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:ring-amber-500'
                }`}
              />
              {errors.subject && (
                <p className="text-[11px] text-rose-400 font-medium">{errors.subject}</p>
              )}

              {/* Quick suggestion pills */}
              <div className="pt-1 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 shrink-0 font-medium">Quick suggestions:</span>
                {quickSuggestions[category].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="shrink-0 px-2.5 py-1 rounded border border-blue-900/60 bg-blue-950/40 text-blue-300 hover:border-blue-500 hover:bg-blue-900/50 transition-colors cursor-pointer text-[11px]"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Detailed Description &amp; Suggestions <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] font-bold text-amber-400">REQUIRED</span>
              </div>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
                }}
                placeholder="Provide details on what happened, steps to reproduce, or feature ideas..."
                className={`w-full text-xs px-3.5 py-2.5 rounded-lg border bg-[#111827] text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:ring-amber-500'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-400 font-medium">{errors.description}</p>
              )}
            </div>

            {/* User Email (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                Your Email (For Response)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your.email@example.com (optional, for reply)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 bg-[#111827] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Media & File Attachments */}
            <div className="rounded-xl border border-slate-800 bg-[#0e1626] p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Attach Media (Screenshots &amp; Files)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {attachments.length} file(s) attached
                    </div>
                  </div>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,text/*,.log,.pdf"
                    onChange={handlePickFiles}
                    className="hidden"
                    id="support-file-picker"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <span>+ Pick Files</span>
                  </button>
                </div>
              </div>

              {/* Render Attached Files List */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {attachments.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#080d1a] border border-slate-700/80 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt=""
                            className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{formatFileSize(item.size)}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(item.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-amber-300/80 flex items-start gap-1.5">
                <span className="shrink-0 font-bold">💡</span>
                <span>
                  File names and sizes will be formatted into your email body. You can also drag the
                  actual files directly into your email client before hitting send.
                </span>
              </p>
            </div>

            {/* 100% Genuine System & App Diagnostics */}
            <div className="rounded-xl border border-slate-800 bg-[#0e1626] p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Include System &amp; App Diagnostics</div>
                    <div className="text-[11px] text-slate-400">
                      {diagnostics
                        ? `${diagnostics.browser} · ${diagnostics.os} · Cores: ${diagnostics.cpuCores}`
                        : 'Querying real hardware APIs...'}
                    </div>
                  </div>
                </div>

                {/* iOS-Style Emerald Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDiagnostics}
                    onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* View/Hide Diagnostic Drawer Link */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowLogDrawer(!showLogDrawer)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{showLogDrawer ? 'Hide System Diagnostic Log' : 'View System Diagnostic Log'}</span>
                  {showLogDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Terminal Log Box */}
              {showLogDrawer && diagnostics && (
                <div className="rounded-xl bg-[#060911] border border-slate-800 p-4 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto shadow-inner">
                  <div className="flex justify-between border-b border-slate-800 pb-1 mb-2 text-slate-500 text-[10px] uppercase font-bold">
                    <span>Hardware / API Property</span>
                    <span>Live Value</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">Browser:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.browser}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">OS:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.os}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">Screen Resolution:</span>
                    <span className="text-emerald-400 text-right">
                      {diagnostics.screenResolution} (Viewport: {diagnostics.viewport})
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">CPU Cores:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.cpuCores}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">Device Memory:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.deviceMemory}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">Canvas 2D:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.canvas2d}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">OffscreenCanvas:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.offscreenCanvas}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">WebCodecs:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.webCodecs}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">Web Audio API:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.webAudio}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">Touch Points:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.touchSupport}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">Network Status:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.networkStatus}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white font-medium">PWA Standalone:</span>
                    <span className="text-emerald-400 text-right">{diagnostics.pwaStandalone}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 break-all">
                    <span className="text-white">User Agent:</span> {diagnostics.userAgent}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenPreSendModal}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 fill-slate-950" />
                <span>Send Report / Feature Request via Email</span>
              </button>
            </div>

            {/* Footer Trust Note */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Files are processed locally in your browser. Zero cloud uploads. Your files never leave your device.</span>
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: FAQ & Troubleshooting Accordion */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0e1626] text-white">
              <h2 className="text-base font-bold flex items-center gap-2 text-amber-400">
                <HelpCircle className="w-5 h-5" />
                <span>Frequently Asked Questions &amp; Troubleshooting</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Common solutions for image processing, dimension questions, and browser constraints.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Why does image compression run completely offline without uploading?',
                  a: 'Image Compressor & Resizer is engineered with HTML5 Canvas and modern WebAssembly image decoders that execute directly in your device’s browser memory. Your confidential photos, documents, and credentials never travel over the network.',
                },
                {
                  q: 'My large 25MB high-resolution photo didn’t download or crashed the tab. Why?',
                  a: 'Mobile browsers (particularly iOS Safari) enforce strict 256MB–384MB canvas buffer limits. When processing very high-resolution images (>6000x4000), enable "Do Not Enlarge" or downscale dimensions slightly (e.g., to 2400px) before compressing to avoid browser memory pressure.',
                },
                {
                  q: 'How do I compress an image to an exact target file size (e.g. 100KB)?',
                  a: 'Use our dedicated preset tools like "/compress-image-to-100kb" or adjust the Quality Slider down to 60%–75%. The live counter in the Image Card shows the predicted output size before you download.',
                },
                {
                  q: 'Will converting PNG to WebP preserve transparent backgrounds?',
                  a: 'Yes! WebP fully supports 8-bit alpha channel transparency just like PNG, but typically results in 30% to 50% smaller file sizes.',
                },
                {
                  q: 'How do I report a bug or request a custom feature for my team?',
                  a: 'Switch to the "Report & Suggest" tab above, fill in the details with system diagnostics enabled, and send it directly to our shared inbox at derp.digital.erp@gmail.com.',
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-slate-800 bg-[#0e1626] p-4 text-white open:border-slate-700 transition-all"
                >
                  <summary className="font-semibold text-xs sm:text-sm text-slate-200 cursor-pointer list-none flex items-center justify-between gap-3">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* MODAL 1: Pre-Send Quality & Verification Alert */}
        {showPreSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-2xl bg-[#0c1322] border border-amber-500/40 p-5 sm:p-6 text-white shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pre-Send Quality Verification</h3>
                  <p className="text-xs text-slate-400">Confirm report accuracy before email dispatch</p>
                </div>
              </div>

              {/* Diagnostics Verification Banner */}
              {includeDiagnostics ? (
                <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3.5 flex items-start gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">✓ Real device diagnostics attached:</span>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5">
                      {diagnostics?.browser} · {diagnostics?.os} · Cores: {diagnostics?.cpuCores} · RAM: {diagnostics?.deviceMemory}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-amber-950/60 border border-amber-500/40 p-3.5 flex items-start justify-between gap-3 text-xs text-amber-300">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Please Make Sure Diagnostics is ON!</span>
                      <p className="text-[11px] text-amber-300/80 mt-0.5">
                        Our engineers need device &amp; memory specs to reproduce and resolve rendering bugs quickly.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeDiagnostics(true)}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Turn ON</span>
                  </button>
                </div>
              )}

              {/* Problem Accuracy Notice */}
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-white">Problem Accuracy Requirement:</p>
                <p className="text-[11px] text-slate-400">
                  Please make sure you describe the original error, actual problem, or genuine feature request.
                  Avoid submitting inaccurate, test, or wrong information so our team can help you without delay.
                </p>
              </div>

              {/* Summary checklist */}
              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div>• App: <span className="text-white">{APPLICATION_NAME} ({APPLICATION_ID})</span></div>
                <div>• Tool: <span className="text-white">{selectedTool}</span></div>
                <div>• Category: <span className="text-amber-300">{category}</span></div>
                <div>• Target: <span className="text-sky-300">{TARGET_SUPPORT_EMAIL}</span></div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleExecuteSend}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm &amp; Open Email Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreSendModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  ← Back to Edit Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: Post-Launch Assistance & Webmail Fallbacks */}
        {showCompletionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-2xl bg-[#0c1322] border border-slate-700 p-5 sm:p-6 text-white shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Email Client Launched!</h3>
                  <p className="text-xs text-slate-400">
                    If your default email app did not open automatically, choose an option below:
                  </p>
                </div>
              </div>

              {/* Quick Action 1: Copy Full Content */}
              <div className="rounded-xl bg-[#080d1a] border border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">1. Copy Formatted Email Content</span>
                  <button
                    type="button"
                    onClick={handleCopyFullReport}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedFullBody ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Full Message</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Copies the tagged subject, diagnostic log, and problem description directly to your clipboard.
                </p>
              </div>

              {/* Quick Action 2: Webmail Launchers */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200">2. Open Directly in Webmail</span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getGmailWebUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>🚀 Open in Gmail Web</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <a
                    href={getOutlookWebUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>✉️ Open in Outlook Web</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompletionModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Done &amp; Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
