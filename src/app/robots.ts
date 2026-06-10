import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
        const baseUrl = "https://utlkit.unistacx.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/contact",],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}