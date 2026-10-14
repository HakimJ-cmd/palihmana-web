import { MetadataRoute } from "next";
import { SITE_CONFIG, PILAR_SLUGS } from "@/lib/constants";
import { getLatestArticles } from "@/modules/articles/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  // Static routes
  const staticRoutes = [
    "",
    "/utility",
    "/understand",
    "/opini",
    "/discover",
    "/people",
    "/catatan-lapangan",
    "/kalender",
    "/simpanan",
    "/cari",
    "/tentang",
    "/pedoman-editorial",
    "/kebijakan-koreksi",
    "/privasi",
    "/kontak",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("always" as const) : ("daily" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Article routes
  const articles = await getLatestArticles({ limit: 100 });
  const articleRoutes = articles.map((a) => {
    const pilarSlug = (a.pilar as string).toLowerCase().replace("_", "-");
    return {
      url: `${baseUrl}/${pilarSlug}/${a.slug}`,
      lastModified: a.contentUpdatedAt || a.publishedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
  });

  return [...staticRoutes, ...articleRoutes];
}
