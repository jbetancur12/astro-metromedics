import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from 'astro/config';

import compressor from "astro-compressor";
import { lastModified } from "./src/utils/lastModified.mjs";

// AI crawlers allowed explicitly: search/answer bots (they cite the site in
// ChatGPT, Claude, Perplexity, Gemini...) and the training ones.
const aiCrawlers = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot",
];

// How AI may use the content (https://contentsignals.org/). Policy choice.
// A crawler only reads its own group, so the line goes in every group.
const contentSignal = "Content-Signal: search=yes, ai-input=yes, ai-train=no";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    sitemap({
      filter: (page) => !page.includes("/evaluacion-servicio"),
      serialize: (item) => {
        const lastmod = lastModified(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    robotsTxt({
      policy: [
        { userAgent: "*", allow: "/" },
        ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/" })),
      ],
      transform: (content) =>
        content
          .replace(/^Allow: \/$/gm, `Allow: /\n${contentSignal}`)
          .replace(/\nSitemap:/, "\n\nSitemap:"),
    }),
    compressor({ gzip: true, brotli: false },),
  ],
  site: 'https://metromedicslab.com',
  base: '/'
});