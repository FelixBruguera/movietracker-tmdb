import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: "tests/vitest.setup.js",
    testTimeout: 30_000,
    include: ["**/vitest/**"]
  },
})