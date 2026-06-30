import type { MetadataRoute } from "next";
import { posts } from "../lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.cl";
  const routes = [
    "",
    "/blog",
    "/agenda-masoterapia",
    "/contacto",
    "/politicas",
    "/newsletter",
    "/masoterapia-santiago",
    "/masoterapia-providencia",
    "/masoterapia-las-condes"
  ];
  const blogRoutes = posts.map((p) => `/blog/${p.slug}`);
  return [...routes, ...blogRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
