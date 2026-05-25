import type { MetadataRoute } from "next";

const SITE = "https://fiajobprep.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Only public routes belong in the sitemap.
  return ["/", "/demo", "/login", "/register"].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
