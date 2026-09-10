import { defineConfig } from "astro/config";
import remarkBreaks from "remark-breaks";

export default defineConfig({
  site: "https://sabaseda.ir",
  output: "static",
  trailingSlash: "always",
  markdown: {
    remarkPlugins: [remarkBreaks]
  }
});
