import { getCollection } from "astro:content";

export async function GET() {
  const news = await getCollection("news");

  const items = news
    .sort(
      (a, b) =>
        new Date(b.data.publishedAt).getTime() -
        new Date(a.data.publishedAt).getTime(),
    )
    .map((entry) => {
      const url = `https://sabaseda.ir/news/${entry.id}/`;
      const date = new Date(entry.data.publishedAt).toUTCString();

      return `
        <item>
          <title><![CDATA[${entry.data.title}]]></title>
          <description><![CDATA[${entry.data.summary}]]></description>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${date}</pubDate>
          <category><![CDATA[${entry.data.category}]]></category>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>صبا رسانه</title>
    <description>صدای حقیقت، مطالبه عدالت</description>
    <link>https://sabaseda.ir/</link>
    <language>fa-IR</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
