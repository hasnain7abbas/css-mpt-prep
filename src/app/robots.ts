import type { MetadataRoute } from "next";

const SITE = "https://fiajobprep.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep authenticated areas out of the index.
      disallow: ["/dashboard", "/subjects", "/tests", "/progress", "/admin", "/account", "/api"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
