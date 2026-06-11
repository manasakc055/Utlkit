import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://utlkit.unistacx.com"),
  title: {
    default: "UtlKit",
    template: "%s | UtlKit",
  },
  description: "Free online tools by Unistacx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
            <GoogleAnalytics gaId="G-F0TW1WSE8H" />

    </html>
  );
}

// import { MetadataRoute } from "next";

// export default function robots(): MetadataRoute.Robots {
//         const baseUrl = "https://utlkit.unistacx.com";

//   return {
//     rules: {
//       userAgent: "*",
//       allow: "/",
//       disallow: ["/contact",],
//     },
//     sitemap: `${baseUrl}/sitemap.xml`,
//   };
// }



// import { MetadataRoute } from "next";

// export default function sitemap(): MetadataRoute.Sitemap {
//     const baseUrl = "https://utlkit.unistacx.com";
//   return [
//     {
//       url: baseUrl,
//       lastModified: new Date(),
//       priority: 1,
//     },
//     {
//       url: `${baseUrl}/dashboard`,
//       lastModified: new Date(),
//       priority: 0.8,
//     },
//   ];
// } 