import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  build: {
    outDir: './build',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      includeAssets: [],
      manifest: {
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: './',
        start_url: './index.html',
        name: 'Lounasvahti',
        short_name: 'Lounasvahti',
        description:
          'Lounasvahti auttaa sinua löytämään sinua lähellä olevan opiskelijaravintolan ja sen ruokalistan.',
        icons: [
          {
            src: 'img/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'img/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
