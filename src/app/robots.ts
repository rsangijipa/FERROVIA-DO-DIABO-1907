import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://ferrovia-do-diabo-1907.vercel.app/sitemap.xml",
  };
}
