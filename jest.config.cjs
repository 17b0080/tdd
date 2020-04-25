module.exports = {
  testPathIgnorePatterns: [
    "./node_modules/",
    "./.cache/",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
};
