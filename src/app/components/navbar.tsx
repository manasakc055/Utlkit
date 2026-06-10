"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  BarChart2,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
            <QrCode
              size={17}
              className="text-white dark:text-zinc-900"
            />
          </div>

          <span className="font-semibold text-[15px] text-black dark:text-white tracking-tight">
            QRUtl
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {[
            ["#generator", "Generator"],
            ["#features", "Features"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-white" />
            ) : (
              <Moon size={18} className="text-zinc-700 dark:text-white" />
            )}
          </button>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 text-[13px] text-gray-700 dark:text-gray-300 px-3.5 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          >
            <BarChart2 size={14} />
            Dashboard
          </Link>

          {/* Sign Up */}
          {/* <button className="text-[13px] px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg font-medium transition">
            Sign up free
          </button> */}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
          >
            {mobileOpen ? (
              <X size={17} />
            ) : (
              <Menu size={17} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3 space-y-1">
          {[
            ["#generator", "Generator"],
            ["#features", "Features"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-[14px] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              {label}
            </a>
          ))}

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 py-2.5 text-[14px] text-gray-600 dark:text-gray-400 w-full"
          >
            {theme === "dark" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}

            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 py-2.5 text-[14px] text-zinc-900 dark:text-white font-medium"
          >
            <BarChart2 size={14} />
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}