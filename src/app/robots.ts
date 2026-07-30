import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cssmptprep.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep authenticated areas out of the index.
      disallow: [
        "/dashboard",
        "/subjects",
        "/mocks",
        "/past-papers",
        "/tests",
        "/progress",
        "/admin",
        "/account",
        "/api",
      ],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
