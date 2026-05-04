import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['gardensolitaire.paullm.cloud'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Garden Solitaire',
        short_name: 'Solitaire',
        description: 'A bright, bubbly nature-themed solitaire game',
        theme_color: '#F0F7EE',
        background_color: '#F0F7EE',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
