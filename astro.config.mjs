import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), sitemap(), robotsTxt()],
  site: 'http://localhost:4321',
  base: '/'
});