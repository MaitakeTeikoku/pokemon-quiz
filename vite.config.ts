import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo192.png"],
      injectRegister: "auto",
      manifest: {
        name: "ポケモンクイズ",
        short_name: "ポケモンクイズ",
        description: "ポケモンのフレーバーテキストから正しいポケモンを推測し、4つの選択肢から答えを選ぶクイズゲームです!",
        theme_color: "#141414",
        icons: [
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ],
  server: { host: true },
})