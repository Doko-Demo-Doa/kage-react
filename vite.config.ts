import { defineConfig } from "vite";
// @ts-ignore
// * No declaration file for less-vars-to-js
import vitePluginImp from "vite-plugin-imp";
import { ViteAliases } from "vite-aliases";
import Inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import EnvironmentPlugin from "vite-plugin-environment";
import tsconfigPaths from "vite-tsconfig-paths";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron/renderer";
// @ts-ignore
import polyfillExports from "vite-plugin-electron/polyfill-exports";
// https://github.com/vbenjs/vite-plugin-style-import
import { createStyleImportPlugin, AntdResolve } from "vite-plugin-style-import";

import electronConfig from "./vite-electron.config";

// https://github.com/asurraa-lab/react-vite2-ts-antd/blob/master/vite.config.ts
// https://github.com/electron-vite/vite-plugin-electron-quick-start

import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({}) => {
  return {
    base: "./",
    assetsInclude: ["**/*.gltf", "**/*.png"],
    envPrefix: ["REACT_APP_", "GH_TOKEN"],
    plugins: [
      EnvironmentPlugin("all", { prefix: "REACT_APP_" }),
      createStyleImportPlugin({
        resolves: [AntdResolve()],
      }),
      Inspect(),
      ViteAliases({}),
      react(),
      svgr(),
      tsconfigPaths(),
      electron(electronConfig),
      electronRenderer(),
      polyfillExports(),
      vitePluginImp({
        libList: [
          {
            libName: "antd",
            style: (name) => {
              if (name === "col" || name === "row") {
                return "antd/lib/style/index.less";
              }
              return `antd/es/${name}/style/index.less`;
            },
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
        "./lib-cov/fluent-ffmpeg": "./lib/fluent-ffmpeg", // This line
      },
    },
    build: {
      sourcemap: true,
      emptyOutDir: false,
      rollupOptions: {
        output: {
          format: "cjs",
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "./src/assets/styles/_colors.scss";
            @import "./src/assets/styles/_common.scss";
            @import "./src/assets/styles/_mixins.scss";
          `,
        },
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
