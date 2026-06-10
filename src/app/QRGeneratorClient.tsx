"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Download, Trash2, QrCode, Copy, Check, Globe, Type, Mail,
  Phone, Wifi, CreditCard, Palette, ImageIcon, ShieldCheck,
  Zap, LockOpen, ChevronDown, BarChart2, Eye, MousePointerClick,
  ScanLine, Menu, X, Star, ArrowRight, Layers, RefreshCw,
  Settings, Users, Bell, LogOut, PieChart, TrendingUp,
  Calendar, Hash, ExternalLink, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import Link from "next/link";
import Navbar from "./components/navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type QRType = "url" | "text" | "email" | "phone" | "wifi" | "vcard";
type ErrorLevel = "L" | "M" | "Q" | "H";

interface QRTypeConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  inputLabel: string;
  buildValue: (v: string) => string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const QR_TYPES: Record<QRType, QRTypeConfig> = {
  url:   { label: "URL",    icon: <Globe size={14} />,       placeholder: "https://example.com",   inputLabel: "Website URL",         buildValue: (v) => v },
  text:  { label: "Text",   icon: <Type size={14} />,        placeholder: "Enter your text here…", inputLabel: "Plain text",           buildValue: (v) => v },
  email: { label: "Email",  icon: <Mail size={14} />,        placeholder: "hello@example.com",     inputLabel: "Email address",        buildValue: (v) => `mailto:${v}` },
  phone: { label: "Phone",  icon: <Phone size={14} />,       placeholder: "+91 98765 43210",        inputLabel: "Phone number",         buildValue: (v) => `tel:${v}` },
  wifi:  { label: "Wi-Fi",  icon: <Wifi size={14} />,        placeholder: "Network name",          inputLabel: "Wi-Fi network name",   buildValue: (v) => `WIFI:S:${v};T:WPA;P:;;` },
  vcard: { label: "vCard",  icon: <CreditCard size={14} />,  placeholder: "Full name",             inputLabel: "Contact name",         buildValue: (v) => `BEGIN:VCARD\nVERSION:3.0\nFN:${v}\nEND:VCARD` },
};

const ERROR_LEVELS: { value: ErrorLevel; label: string }[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "High (25%)" },
  { value: "H", label: "Max (30%)" },
];

const FEATURES = [
  { icon: <Palette size={18} />,     name: "Custom colors",      desc: "Match your brand with full foreground and background color control." },
  { icon: <ImageIcon size={18} />,   name: "4K export",          desc: "Download crisp PNG files at 4× pixel density — perfect for print and digital." },
  { icon: <ShieldCheck size={18} />, name: "Error correction",   desc: "Set correction up to 30% so your QR still scans even if partially damaged." },
  { icon: <Globe size={18} />,       name: "6 QR types",         desc: "URLs, plain text, email, phone numbers, Wi-Fi networks, and vCards." },
  { icon: <Zap size={18} />,         name: "Instant preview",    desc: "See your QR code update live as you generate — no page reload needed." },
  { icon: <LockOpen size={18} />,    name: "No account needed",  desc: "Generate and download without signing up. Completely free, no limits." },
  { icon: <BarChart2 size={18} />,   name: "Scan analytics",     desc: "Track how many times your QR codes are scanned with the dashboard." },
  { icon: <Layers size={18} />,      name: "Bulk generate",      desc: "Create multiple QR codes at once from a CSV — save hours of manual work." },
  { icon: <RefreshCw size={18} />,   name: "Dynamic QR",         desc: "Change the destination URL anytime without reprinting the QR code." },
];

const PRICING = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Perfect for personal projects and quick one-off QR codes.",
    features: ["10 QR codes/month", "PNG download", "URL & text types", "Basic customisation"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "per month",
    desc: "For creators and small businesses who need more power.",
    features: ["Unlimited QR codes", "All 6 QR types", "4K PNG + SVG export", "Custom colors & logo", "Scan analytics", "Dynamic QR codes"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "₹1,499",
    period: "per month",
    desc: "For agencies and teams managing QR codes at scale.",
    features: ["Everything in Pro", "5 team members", "Bulk CSV generation", "Priority support", "API access", "White-label export"],
    cta: "Contact sales",
    highlight: false,
  },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Marketing Lead, Zomato", body: "QRGen cut our campaign setup time in half. Dynamic QR codes are a game changer — we update destinations without reprinting.", stars: 5 },
  { name: "Rohit Nair",   role: "Founder, Buildspace IN", body: "The cleanest QR generator I've used. The bulk CSV feature saved us literal days when we launched our product catalog.", stars: 5 },
  { name: "Anya Singh",   role: "Event Manager, Insider", body: "We create hundreds of event QR codes every month. The scan analytics dashboard tells us exactly which ones perform.", stars: 5 },
];

const MOCK_QRS = [
  { name: "Product launch page",  scans: 3241, type: "URL",   created: "Jun 2",  active: true },
  { name: "Instagram profile",    scans: 1872, type: "URL",   created: "Jun 4",  active: true },
  { name: "Office Wi-Fi",         scans: 654,  type: "Wi-Fi", created: "May 28", active: true },
  { name: "vCard — Rahul Mehta",  scans: 421,  type: "vCard", created: "May 21", active: false },
  { name: "Menu PDF",             scans: 289,  type: "URL",   created: "May 15", active: true },
];

const STATS = [
  { num: "10M+", label: "QR codes created" },
  { num: "150+", label: "Countries" },
  { num: "Free", label: "No sign-up" },
  { num: "4K",   label: "Export quality" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUrl(v: string) {
  try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; }
  catch { return false; }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QRPlaceholder() {
  return (
    <svg width="148" height="148" viewBox="0 0 148 148" fill="none" className="opacity-20 text-gray-500 dark:text-gray-400">
      <rect x="8"  y="8"  width="52" height="52" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="20" y="20" width="28" height="28" rx="2" fill="currentColor" />
      <rect x="88" y="8"  width="52" height="52" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="100" y="20" width="28" height="28" rx="2" fill="currentColor" />
      <rect x="8"  y="88" width="52" height="52" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="20" y="100" width="28" height="28" rx="2" fill="currentColor" />
      {[[88,88],[100,88],[112,88],[124,88],[88,100],[100,100],[112,112],[88,112],[124,112],[88,124],[100,124],[124,124]].map(([x,y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="currentColor" />
      ))}
    </svg>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</span>
<label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 cursor-pointer hover:border-zinc-900 dark:hover:border-white transition">        <div className="w-5 h-5 rounded-md border border-gray-200 dark:border-zinc-600 flex-shrink-0" style={{ background: value }} />
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 flex-1">{value.toUpperCase()}</span>
        <Palette size={12} className="text-gray-400" />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="sr-only" />
      </label>
    </div>
  );
}

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

// ─── Builder Section ──────────────────────────────────────────────────────────

function BuilderSection() {
  const [activeType, setActiveType] = useState<QRType>("url");
  const [inputValue, setInputValue]  = useState("");
  const [qrValue, setQrValue]        = useState("");
  const [fgColor, setFgColor]        = useState("#000000");
  const [bgColor, setBgColor]        = useState("#ffffff");
  const [errorLevel, setErrorLevel]  = useState<ErrorLevel>("Q");
  const [copied, setCopied]          = useState(false);
  const [showErrDrop, setShowErrDrop] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const cfg      = QR_TYPES[activeType];
  const isUrl    = activeType === "url";
  const urlInvalid = isUrl && inputValue.length > 0 && !isValidUrl(inputValue);
  const hasQR    = qrValue.length > 0;

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest("[data-errdrop]")) setShowErrDrop(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleGenerate = useCallback(() => {
    const val = inputValue.trim();
    if (!val) { toast.error("Please enter a value first"); return; }
    if (isUrl && !isValidUrl(val)) { toast.error("Please enter a valid URL (https://...)"); return; }
    setQrValue(cfg.buildValue(val));
    toast.success("QR code generated!");
  }, [inputValue, isUrl, cfg]);

  const handleDownload = async () => {
    if (!hasQR || !qrRef.current) { toast.error("Generate a QR code first"); return; }
    try {
      const dataUrl = await toPng(qrRef.current, { cacheBust: true, pixelRatio: 4 });
      const a = document.createElement("a"); a.download = "qrcode.png"; a.href = dataUrl; a.click();
      toast.success("Downloaded!");
    } catch { toast.error("Download failed"); }
  };

  const handleCopy = async () => {
    if (!inputValue) { toast.error("Generate a QR code first"); return; }
    try {
      await navigator.clipboard.writeText(inputValue);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch { toast.error("Copy failed"); }
  };

  return (
    <section id="generator" className="px-4 sm:px-6 py-12 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-visible">

        {/* Tabs */}
        <div className="px-5 pt-4 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto scrollbar-none">
          <div className="flex gap-1 min-w-max">
            {(Object.entries(QR_TYPES) as [QRType, QRTypeConfig][]).map(([type, c]) => (
           <button
  key={type}
  onClick={() => {
    setActiveType(type);
    setInputValue("");
    setQrValue("");
  }}
  className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium rounded-t-xl border-x border-t transition-all whitespace-nowrap
    ${
      activeType === type
        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700 relative z-10 -mb-px border-b-white dark:border-b-zinc-900"
        : "bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-zinc-700/50 hover:text-gray-700 dark:hover:text-gray-300"
    }`}
>
  {c.icon}
  {c.label}
</button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px]">
          {/* Left */}
          <div className="p-5 sm:p-7 lg:border-r border-gray-100 dark:border-zinc-800 border-b lg:border-b-0">
            <div className="mb-5">
              <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">{cfg.inputLabel}</label>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGenerate()} placeholder={cfg.placeholder}
className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-gray-300 dark:placeholder-zinc-500 text-[14px] outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition"/>
              <div className="flex justify-between mt-1.5">
                {urlInvalid ? <p className="text-[12px] text-red-500">Please enter a valid URL starting with https://</p> : <span />}
                <p className="text-[11px] text-gray-300 dark:text-zinc-600 ml-auto">{inputValue.length} chars</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <ColorRow label="QR color" value={fgColor} onChange={setFgColor} />
              <ColorRow label="Background" value={bgColor} onChange={setBgColor} />
            </div>
            <div className="mb-6">
              <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Error correction</label>
              <div className="relative" data-errdrop>
                <button onClick={() => setShowErrDrop((v) => !v)}
className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[13px] text-gray-700 dark:text-gray-300 hover:border-zinc-900 dark:hover:border-white transition">                  {ERROR_LEVELS.find((e) => e.value === errorLevel)?.label}
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${showErrDrop ? "rotate-180" : ""}`} />
                </button>
                {showErrDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden z-20 shadow-md">
                    {ERROR_LEVELS.map((lvl) => (
                      <button key={lvl.value} onClick={() => { setErrorLevel(lvl.value); setShowErrDrop(false); }}
className={`w-full text-left px-4 py-2.5 text-[13px] transition ${
  errorLevel === lvl.value
    ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium"
    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
}`}>                        {lvl.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
<button
  onClick={handleGenerate}
  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-[13px] font-medium transition"
>                <QrCode size={15} />Generate
              </button>
              <button onClick={handleDownload} disabled={!hasQR} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[13px] font-medium hover:opacity-85 disabled:opacity-35 disabled:cursor-not-allowed transition">
                <Download size={15} />Download
              </button>
              <button onClick={() => { setInputValue(""); setQrValue(""); setCopied(false); toast.success("Cleared"); }} disabled={!inputValue}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:cursor-not-allowed transition">
                <Trash2 size={15} />Clear
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="p-6 flex flex-col items-center bg-gray-50/60 dark:bg-zinc-800/30">
            <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">Preview</p>
            <div ref={qrRef} className="w-[176px] h-[176px] rounded-2xl border border-gray-200 dark:border-zinc-700 flex items-center justify-center mb-4 transition-colors"
              style={{ background: hasQR ? bgColor : undefined }}>
              {hasQR ? <QRCodeSVG value={qrValue} size={148} bgColor={bgColor} fgColor={fgColor} level={errorLevel} /> : <QRPlaceholder />}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center break-all max-w-[180px] mb-5 leading-relaxed min-h-[2.5rem]">
              {hasQR ? (inputValue.length > 42 ? inputValue.slice(0, 40) + "…" : inputValue) : "Your QR code will appear here"}
            </p>
            <button onClick={handleCopy} disabled={!hasQR}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-[13px] text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-35 disabled:cursor-not-allowed transition">
              {copied ? <><Check size={14} className="text-green-500" />Copied!</> : <><Copy size={14} />Copy URL</>}
            </button>
            <div className="mt-auto pt-6 w-full border-t border-gray-100 dark:border-zinc-700/60">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">Scan with any camera app.<br />Works on iOS & Android.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 mt-3 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        {STATS.map((s, i) => (
          <div key={s.num} className={`py-5 text-center ${i < 3 ? "border-r border-gray-100 dark:border-zinc-800" : ""} ${i === 2 ? "border-r-0 sm:border-r" : ""} ${i >= 2 ? "border-t sm:border-t-0 border-gray-100 dark:border-zinc-800" : ""}`}>
            <p className="text-[22px] font-semibold text-black dark:text-white">{s.num}</p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────



// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage(){
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">

      {/* ── Navbar ── */}
    <Navbar />

      {/* ── Hero ── */}
      <section className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-5 pt-16 pb-14 text-center">
<span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-full mb-5">          <Zap size={11} />Free · No sign-up needed
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-5">
          Generate <span className="text-zinc-900 dark:text-white">QR codes</span><br className="hidden sm:block" /> instantly
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-[15px] leading-relaxed mb-8">
          URLs, text, email, phone, Wi-Fi & vCard — customise colors and download in 4K. No account needed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
<a
  href="#generator"
  className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-[14px] font-medium transition"
>            <QrCode size={16} />Create QR code free
          </a>
          <Link   href="/dashboard"
 className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl text-[14px] font-medium transition">
            <BarChart2 size={16} />View dashboard
          </Link>
        </div>
      </section>

      {/* ── Builder ── */}
      <BuilderSection />

      {/* ── How it works ── */}
      <section className="px-4 sm:px-6 py-16 max-w-4xl mx-auto">
<p className="text-[11px] font-medium uppercase tracking-widest text-zinc-900 dark:text-white text-center mb-3">
  How it works
</p>        <h2 className="text-2xl sm:text-3xl font-bold text-center text-black dark:text-white mb-12">Three steps to your QR code</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "01", icon: <Type size={22} />,     title: "Enter your content",  desc: "Type your URL, paste text, or fill in contact details — pick from 6 QR types." },
            { step: "02", icon: <Palette size={22} />,  title: "Customise the look",  desc: "Choose your foreground and background colors and set error correction level." },
            { step: "03", icon: <Download size={22} />, title: "Download and share",  desc: "Hit generate, then download a crisp 4K PNG ready for print or digital use." },
          ].map((s) => (
            <div key={s.step} className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
              <div className="absolute -top-3 left-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-0.5 text-[11px] font-mono font-semibold text-zinc-900 dark:text-white">{s.step}</div>
<div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white mb-4 mt-2">
  {s.icon}
</div>              <p className="text-[14px] font-semibold text-black dark:text-white mb-2">{s.title}</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 sm:px-6 py-16 bg-white dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
<p className="text-[11px] font-medium uppercase tracking-widest text-zinc-900 dark:text-white text-center mb-3">
Features</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-black dark:text-white mb-12">Everything you need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div key={f.name} className="border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-blue-900 transition group">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white dark:text-blue-400 mb-4 group-hover:bg-blue-100 transition">{f.icon}</div>
                <p className="text-[13px] font-semibold text-black dark:text-white mb-1.5">{f.name}</p>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      {/* <section id="pricing" className="px-4 sm:px-6 py-16 max-w-4xl mx-auto">
<p className="text-[11px] font-medium uppercase tracking-widest text-zinc-900 dark:text-white text-center mb-3">
Pricing</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-black dark:text-white mb-3">Simple, transparent pricing</h2>
        <p className="text-[14px] text-gray-400 text-center mb-12">Start free. Upgrade when you need more.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRICING.map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl p-6 border transition ${plan.highlight ? "border-zinc-900 dark:border-white dark:border-blue-600 bg-zinc-900 dark:bg-white" : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-zinc-900 dark:text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 shadow-sm whitespace-nowrap">
                  Most popular
                </div>
              )}
              <p className={`text-[13px] font-semibold mb-1 ${plan.highlight ? "text-zinc-300 dark:text-zinc-700" : "text-black dark:text-white"}`}>{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-black dark:text-white"}`}>{plan.price}</span>
                <span className={`text-[12px] ${plan.highlight ? "text-zinc-400 dark:text-zinc-600" : "text-gray-400"}`}>/{plan.period}</span>
              </div>
              <p className={`text-[12px] mb-5 leading-relaxed ${plan.highlight ? "text-zinc-300 dark:text-zinc-700" : "text-gray-500 dark:text-gray-400"}`}>{plan.desc}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-[12px] ${plan.highlight ? "text-blue-50" : "text-gray-600 dark:text-gray-400"}`}>
                    <Check size={13} className={plan.highlight ? "text-zinc-400 dark:text-zinc-600" : "text-green-500"} />{f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl text-[13px] font-medium transition ${plan.highlight ? "bg-white text-zinc-900 dark:text-white hover:bg-zinc-100 dark:bg-zinc-800" : "bg-black dark:bg-white text-white dark:text-black hover:opacity-85"}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── Testimonials ── */}
      {/* <section id="testimonials" className="px-4 sm:px-6 py-16 bg-white dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
  <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-900 dark:text-white text-center mb-3">
Reviews</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-black dark:text-white mb-12">Loved by thousands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="border border-gray-100 dark:border-zinc-800 rounded-2xl p-5">
                <StarRow n={t.stars} />
                <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed mb-4">"{t.body}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white text-[12px] font-semibold">{t.name[0]}</div>
                  <div>
                    <p className="text-[12px] font-semibold text-black dark:text-white">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA banner ── */}
{/* ── CTA Banner ── */}
<section className="px-4 sm:px-6 py-16 max-w-5xl mx-auto text-center">
  <div className="bg-zinc-900 dark:bg-white rounded-3xl px-6 sm:px-10 py-14 shadow-xl border border-zinc-800 dark:border-zinc-200">
    
    <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-zinc-900 mb-4">
      Start generating QR codes for free
    </h2>

    <p className="text-zinc-300 dark:text-zinc-600 text-[15px] leading-relaxed mb-8 max-w-xl mx-auto">
      Create beautiful QR codes instantly. No credit card required, no sign-up needed.
      Generate, customize, and download in seconds.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      
      <a
        href="#generator"
        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-[14px] font-medium transition-all duration-200 shadow-sm"
      >
        <QrCode size={16} />
        Create QR Code
      </a>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-6 py-3 border border-zinc-600 dark:border-zinc-300 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[14px] font-medium transition-all duration-200"
      >
        <BarChart2 size={16} />
        View Dashboard
      </Link>

    </div>
  </div>
</section>

      {/* ── Footer ── */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-zinc-900 dark:bg-white   round rounded-lg flex items-center justify-center">
                  <QrCode size={14} className="text-white dark:text-zinc-900" />
                </div>
                <span className="font-semibold text-black dark:text-white">            QRUtl
</span>
              </div>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 leading-relaxed">Free QR code generator for URLs, text, email, phone, Wi-Fi, and vCard.</p>
            </div>
            {[
              { title: "Product",  links: ["Generator", "Dashboard", "Pricing", "API"] },
              { title: "Company",  links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support",  links: ["Help centre", "Contact", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[12px] font-semibold text-black dark:text-white mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-[12px] text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-gray-400">© {new Date().getFullYear()} Utl. All rights reserved.</p>
            <p className="text-[12px] text-gray-400">Made with ♥ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function QRGenerator() {
  return <HomePage />;
}