import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://biustinnovation.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/", "/login/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
