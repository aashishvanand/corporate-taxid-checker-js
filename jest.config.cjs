module.exports = {
  "transform": {
    "\\.compressed$": "<rootDir>/tests/rawTransform.js",
    "^.+\\.tsx?$": "@swc/jest"
  },
  "testEnvironment": "node",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json"]
};
