import type { Metadata } from "next";
import QRGeneratorClient from "./QRGeneratorClient";

export const metadata: Metadata = {
  title: "UtlQR - Free QR Code Generator",
  description:
    "Generate QR codes instantly for URLs, text, email, phone numbers, Wi-Fi networks, and vCards. Customize and download high-quality QR codes for free.",

  keywords: [
    "UtlQR",
    "QR Code Generator",
    "Free QR Code Generator",
    "QR Code Maker",
    "WiFi QR Code",
    "vCard QR Code",
    "URL QR Code",
  ],

  openGraph: {
    title: "UtlQR - Free QR Code Generator",
    description:
      "Create beautiful QR codes instantly. No sign-up required.",
    url: "https://utlkit.unistacx.com",
    siteName: "UtlQR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  alternates: {
    canonical: "https://utlkit.unistacx.com",
  },
};

export default function HomePage() {
  return <QRGeneratorClient />;
}