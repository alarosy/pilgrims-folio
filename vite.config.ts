import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { normalizeBase } from "./src/lib/base.ts";

export default defineConfig({
  // Must match React Router's basename (react-router.config.ts), so asset links point to the right folder.
  base: normalizeBase(process.env.BASE_PATH),
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
