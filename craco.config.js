const path = require('path');
const CracoAntDesignPlugin = require('craco-antd');
const sassResourcesLoader = require('craco-sass-resources-loader');

const target = process.env.WEBPACK_TARGET === 'electron' ? 'electron-renderer' : 'web';
console.log('[Info] Loaded with target: ', target);

module.exports = {
  webpack: {
    configure: {
      target: process.versions['electron'] ? 'electron-renderer' : 'web'
    },
    alias: {
      '~': path.resolve(__dirname, 'src/')
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^~(.*)$': '<rootDir>/src$1'
      },
    },
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(
          __dirname,
          '~antd/dist/antd.less'
        ),
      },
    },
    {
      plugin: sassResourcesLoader,
      options: {
        resources: [
          './src/assets/styles/_colors.scss',
          './src/assets/styles/_common.scss',
        ],
      },
    },
  ],
};
