module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  transformIgnorePatterns: ["/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"],
  testRegex: "(/__tests__/.*|src/.*\\.(test|spec))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
