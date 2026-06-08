"use client";
import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Trash2,
  QrCode,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";

function QRGenerator() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value);

      return (
        url.protocol === "http:" ||
        url.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  const validUrl = isValidUrl(text);

  const downloadQR = async () => {
    if (!validUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      if (!qrRef.current) return;

      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 4,
      });

      const link = document.createElement("a");

      link.download = "website-qr.png";
      link.href = dataUrl;
      link.click();

      toast.success("QR Code downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download QR Code");
    }
  };

  const clearQR = () => {
    setText("");
    setCopied(false);
    toast.success("Cleared");
  };

  const copyText = async () => {
    if (!validUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div
        className="
          w-full
          max-w-2xl
          bg-white
          dark:bg-zinc-900
          border
          border-gray-200
          dark:border-zinc-800
          rounded-3xl
          p-5
          sm:p-8
          shadow-sm
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-gray-100
              dark:bg-zinc-800
              border
              border-gray-200
              dark:border-zinc-700
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <QrCode
              size={30}
              className="text-gray-700 dark:text-gray-300"
            />
          </div>

          <h2 className="text-3xl font-bold text-black dark:text-white">
            QR Code Generator
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Generate QR codes from website URLs.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter Website URL
          </label>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-800
              text-black
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              transition
            "
          />

          <p className="text-xs text-gray-500">
            Characters: {text.length}
          </p>

          {text && !validUrl && (
            <p className="text-sm text-red-500">
              Please enter a valid URL (https://...)
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <button         
            onClick={downloadQR}
            disabled={!validUrl}
            className="
              flex
              items-center
              justify-center
              gap-2
              py-3
              rounded-xl
              bg-black
              dark:bg-white
              text-white
              dark:text-black
              font-medium
              transition
              hover:opacity-90
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <Download size={18} />
            Download
          </button>

          <button
            onClick={copyText}
            disabled={!validUrl}
            className="
              flex
              items-center
              justify-center
              gap-2
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-zinc-700
              hover:bg-gray-100
              dark:hover:bg-zinc-800
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {copied ? (
              <>
                <Check size={18} />
                Copied
              </>
            ) : (
              <>
                <Copy size={18} />
                Copy URL
              </>
            )}
          </button>

          <button
            onClick={clearQR}
            disabled={!text}
            className="
              flex
              items-center
              justify-center
              gap-2
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-zinc-700
              hover:bg-gray-100
              dark:hover:bg-zinc-800
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <Trash2 size={18} />
            Clear
          </button>
        </div>

        {/* QR Preview */}
        {validUrl && (
          <div
            className="
              mt-8
              rounded-2xl
              border
              border-gray-200
              dark:border-zinc-700
              bg-gray-50
              dark:bg-zinc-800
              p-6
            "
          >
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
              Generated QR Code
            </p>

            <div className="flex justify-center">
              <div
                ref={qrRef}
                className="
                  bg-white
                  rounded-2xl
                  p-5
                  shadow-sm
                "
              >
                <QRCodeSVG
                  value={text}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500 break-all">
                {text}
              </p>
            </div>
          </div>
        )}

        {/* Info Card */}
        {/* <div
          className="
            mt-6
            rounded-2xl
            border
            border-gray-200
            dark:border-zinc-800
            bg-gray-50
            dark:bg-zinc-800/50
            p-4
          "
        >
          <h3 className="font-semibold text-black dark:text-white mb-2">
            Supported URLs
          </h3>

          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>✓ Website URLs</li>
            <li>✓ Portfolio Links</li>
            <li>✓ LinkedIn Profiles</li>
            <li>✓ GitHub Repositories</li>
            <li>✓ Google Play Store Links</li>
            <li>✓ App Store Links</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default QRGenerator;