import type { MetadataRoute } from "next";
import { profile } from "@/data/resume";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${profile.siteUrl}${profile.resume}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
