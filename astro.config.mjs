import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import compressor from "astro-compressor";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from 'astro/config';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), sitemap(), robotsTxt(), compressor({
    gzip: true,
    brotli: false
  })],
  site: 'http://localhost:4321',
  base: '/',
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});