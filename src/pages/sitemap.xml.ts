import { getCollection } from "astro:content";

export async function GET() {
  const news = await getCollection("news");

  const categories = [...new Set(news.map((entry) => entry.data.category))];

  const urls = [
    "https://sabaseda.ir/",
    "https://sabaseda.ir/news/",
    ...categories.map((category) => `https://sabaseda.ir/category/${encodeURIComponent(category)}/`),
    ...news.map((entry) => `https://sabaseda.ir/news/${entry.id}/`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
