const path = require('path');

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
};
