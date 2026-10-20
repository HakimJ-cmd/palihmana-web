import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { getLatestArticles, getAllTags } from "@/modules/articles/queries";
import { getUtilities } from "@/modules/utilities/queries";
import { getUpcomingEvents } from "@/modules/events/queries";

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
    "/layanan",
    "/kalender",
    "/simpanan",
    "/cari",
    "/masuk",
    "/daftar",
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

  // Utility routes
  const utilities = await getUtilities();
  const utilityRoutes = utilities.map((u) => ({
    url: `${baseUrl}/layanan/${u.slug}`,
    lastModified: u.lastVerifiedAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Event routes
  const events = await getUpcomingEvents();
  const eventRoutes = events.map((e) => ({
    url: `${baseUrl}/kalender/${e.slug}`,
    lastModified: new Date(e.eventDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Tag routes
  const tags = await getAllTags();
  const tagRoutes = tags.map((t) => ({
    url: `${baseUrl}/tag/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...utilityRoutes,
    ...eventRoutes,
    ...tagRoutes,
  ];
}
