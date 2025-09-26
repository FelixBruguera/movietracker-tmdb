import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import path from "path"

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [cloudflare(), tailwindcss(), tsConfigPaths(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
      "@ui": path.resolve(__dirname, "./app/components/ui"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@stores": path.resolve(__dirname, "./src/stores"),
    },
  },
})
