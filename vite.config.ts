import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [cloudflare(), tailwindcss(), tsConfigPaths(), react()],
})
