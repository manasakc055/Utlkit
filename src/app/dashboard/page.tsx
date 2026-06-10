// src/App.tsx
"use client";
import "../globals.css";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { GraduationCap, Menu, Moon, Percent, QrCode, Sun, X } from "lucide-react";
import { ReactElement } from 'react';

import { Code2, Settings, Search, Lock } from "lucide-react";
import JsonFormatter from "../Developer-tools/JsonFormatter";
import CGPAConverter from "../Calics/CGPA-to-Percentage";
import PercentageToCGPA from "../Calics/Percentage-to-CGPA";
import QRGenerator from "../Developer-tools/QRGenerator";
/* =========================
   Tool Type
========================= */
type Tool = {
  id: string;
  title: string;
  description: string;
  icon: any;
};

/* =========================
   Tools Data (Scalable & Fixed Text)
========================= */
const tools: Tool[] = [
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Beautify, parse, minify, and analyze structured JSON data.",
    icon: Code2,
  },
  {
    id: "CGPA-Converter",
    title: "CGPA Converter",
    description: "Convert your cumulative grade point average across different scales.",
    icon: GraduationCap,
  },
  {
    id: "Percentage-Converter",
    title: "Percentage to CGPA",
    description: "Easily calculate and translate percentage scores into CGPA metrics.",
    icon: Percent,
  },
   {
    id: "Qr-Generator",
    title: "Qr Generator",
    description: "Easily calculate and translate percentage scores into CGPA metrics.",
    icon: QrCode,
  },
  {
    id: "base64",
    title: "Base64 Encoder",
    description: "Encode and decode Base64 instantly with real-time feedback.",
    icon: Lock,
  },
];

/* =========================
   Tool Card Component (Perfect Internal Alignment)
========================= */
const ToolCard = ({
  tool,
  setActiveTool,
}: {
  tool: Tool;
  setActiveTool: (id: string) => void;
}) => {
  const Icon = tool.icon;

  return (
    <div
      onClick={() => setActiveTool(tool.id)}
      className="
border border-gray-300 dark:border-gray-800
bg-white dark:bg-zinc-900
p-6 rounded-2xl cursor-pointer
flex flex-col items-center text-center justify-start h-full
hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-gray-800
hover:shadow-lg hover:shadow-gray-500/10
active:scale-95
transition-all duration-300 group
"
    >
      <Icon
        size={32}
        className="text-zinc-900 mb-4 text-black dark:text-white group-hover:scale-110 transition-transform duration-300"
      />

      <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
      <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed">{tool.description}</p>
    </div>
  );
};

/* =========================
   App Component
========================= */
function App() {
  const [activeTool, setActiveTool] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  /* =========================
     Dynamic Tool Rendering
  ========================= */
const toolComponents: Record<string, ReactElement> = {    "json-formatter": <JsonFormatter />,
    "CGPA-Converter": <CGPAConverter />,
    "Percentage-Converter": <PercentageToCGPA />,
    "Qr-Generator": <QRGenerator />
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white flex">
         {/* ================= OVERLAY (MOBILE) ================= */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================= Sidebar ================= */}
<aside
  className={`
    fixed md:static z-50
    w-64 h-full md:h-auto
    border-r border-gray-300 dark:border-gray-800
    bg-white dark:bg-zinc-900 p-5 flex flex-col gap-2 shrink-0
    transition-transform duration-300

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>     

 {/* Close button (mobile) */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <span className="font-semibold">Menu</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

     <button
            onClick={() => setActiveTool("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-xl transition font-medium flex items-center gap-3 
              ${activeTool === "dashboard"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
          >
            <Settings size={18} />
            Dashboard
          </button>

          {/* Dynamic Tool Buttons */}
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition font-medium flex items-center gap-3
                   ${activeTool === tool.id
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
              >
                <Icon size={18} />
                {tool.title}
              </button>
            );
          })}
        </aside>

        {/* ================= Main Content Container ================= */}
{/* ================= MAIN ================= */}
        <main className="flex-1 flex flex-col">

          {/* ================= MOBILE TOP BAR ================= */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-800">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>

            <span className=" font-semibold">Tools</span>

                 <button
    onClick={toggleTheme}
    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
  >
    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
  </button>
          </div>
          {/* ================= DESKTOP TOP BAR ================= */}
          {activeTool !== "dashboard" && (
<div className="hidden md:flex border-b border-gray-300 dark:border-gray-800 px-8 py-4 bg-white dark:bg-zinc-900 flex justify-between items-center">               <span className="text-sm text-gray-500 font-mono">
                Tools / {activeTool}
              </span>

              <div className="flex gap-3">
           <button
    onClick={toggleTheme}
    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
  >
    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
  </button>

                <button
                  onClick={() => setActiveTool("dashboard")}
                  className="text-sm text-gray-500"
                >
                  Back
                </button>
              </div>
            </div>
          )}


          {/* Dashboard Panel View */}
          {activeTool === "dashboard" && (
            <div className="w-full max-w-6xl px-8 py-16 flex flex-col items-center text-center">
                          <div className=" px-6 py-10 items-center text-center">

              <h2 className="text-3xl font-bold mb-2 text-black dark:text-white tracking-tight">
                Welcome to your Workspace
              </h2>
              <p className="text-gray-400 mb-16 dark:text-gray-400 max-w-md">
                Select a tool to start your workflow.
              </p>
              </div>

              {/* Grid Matrix Alignment */}
              <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    setActiveTool={setActiveTool}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Tool View Panel */}
          {activeTool !== "dashboard" && (
            <div className="w-full">
              {/* <div className="border-b border-gray-300 dark:border-gray-800 px-8 py-4 bg-white dark:bg-zinc-900 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">   
                                 Tools / {activeTool}
                </span>

                <div className="flex items-center gap-3">
  <button
    onClick={toggleTheme}
    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
  >
    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
  </button>

  <button
    onClick={() => setActiveTool("dashboard")}
    className="text-xs text-gray-500 hover:text-black dark:hover:text-white"
  >
    Back to Dashboard
  </button>
</div>

              </div> */}

              <div className="p-8">
                {toolComponents[activeTool] || (
                  <div className="text-gray-500 font-medium">
                    Tool coming soon...
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default App;