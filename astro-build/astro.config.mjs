// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://capevows.co.za',
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});
