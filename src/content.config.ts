import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const news = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/news"
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    publishedAt: z
      .union([z.string(), z.date()])
      .transform((value) =>
        value instanceof Date ? value.toISOString() : value
      ),
    image: z.string(),
    imageAlt: z.string(),
    featured: z.boolean().default(false)
  })
});

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/pages"
  }),
  schema: z.object({
    title: z.string()
  })
});

export const collections = { news, pages };
