import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'Apna Digital Khata',
        short_name: 'Khata',
        description: 'Offline-First Kirana Stock & Reorder Khata App',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache all static HTML, JS, CSS, and asset files aggressively for zero-network startup
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    host: true,
    port: 3000,
  },
});
