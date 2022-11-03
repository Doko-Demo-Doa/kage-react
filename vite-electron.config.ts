import path from "path";
import { defineConfig } from "vite-plugin-electron";

export default defineConfig({
  main: {
    entry: "electron-main/main.ts",
  },
  preload: {
    // Must be use absolute path, this is the limit of rollup
    input: path.join(process.cwd(), "electron-preload", "index.ts"),
  },
});
