export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://sabaseda.ir/sitemap.xml
`;

  return new Response(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
