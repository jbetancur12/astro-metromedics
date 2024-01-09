import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from 'astro/config';

import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), sitemap(), robotsTxt(), compressor({ gzip: true, brotli: false },)],
  site: 'https://metromedics.co',
  base: '/'
});