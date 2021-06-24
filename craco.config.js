const path = require("path");
const CracoAntDesignPlugin = require("craco-antd");
const sassResourcesLoader = require("craco-sass-resources-loader");

const target = process.env.WEBPACK_TARGET === "electron" ? "electron-renderer" : "web";
console.log("[Info] Loaded with target: ", target);

module.exports = {
  style: {
    css: {
      loaderOptions: (cssLoaderOptions, { env, paths }) => {
        // We want to select the CSS loader config for all plain `.scss` files. In the current CRA Webpack configuration,
        // this SCSS rules are defined by using `importLoaders: 3`. To make a distinction between the rules for SCSS modules
        // and plain SCSS files, we need to look for the loaderOptions where no modules are set. The if-statement below
        // filters this and keeps existing CRA configuration for all other rules intact.
        //
        // See https://github.com/facebook/create-react-app/blob/b9963abde5870d46cd906160f98f81dbc0a5ecf2/packages/react-scripts/config/webpack.config.js#L563
        if (cssLoaderOptions.importLoaders !== 3 || cssLoaderOptions.modules)
          return cssLoaderOptions;

        return {
          ...cssLoaderOptions,
          modules: {
            compileType: "icss",
          },
        };
      },
    },
  },
  webpack: {
    configure: {
      target: target,
    },
    alias: {
      "~": path.resolve(__dirname, "src/"),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^~(.*)$": "<rootDir>/src$1",
      },
    },
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, "~antd/dist/antd.less"),
      },
    },
    {
      plugin: sassResourcesLoader,
      options: {
        resources: [
          "./src/assets/styles/_colors.scss",
          "./src/assets/styles/_common.scss",
          "./src/assets/styles/_mixins.scss",
        ],
      },
    },
  ],
};
