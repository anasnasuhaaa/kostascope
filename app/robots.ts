import type { MetadataRoute } from "next";

const SITE_URL = "https://angkasakost.ormawaeksekutifpku.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}