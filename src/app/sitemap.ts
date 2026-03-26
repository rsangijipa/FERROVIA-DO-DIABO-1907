import type { MetadataRoute } from "next";

const routes = [
  "",
  "/restauracao-2026",
  "/historia-interativa",
  "/quiz-tematico",
  "/museu-vivo",
  "/resultado-integrado",
  "/config",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ferrovia-do-diabo-1907.vercel.app";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
