import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://main--lucent-faloodeh-cc8acd.netlify.app',
  base: '/'
});