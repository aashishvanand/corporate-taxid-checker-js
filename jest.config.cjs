module.exports = {
  "transform": {
    "\\.compressed$": "<rootDir>/tests/rawTransform.js",
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.json",
      diagnostics: false
    }]
  },
  "testEnvironment": "node",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json"]
};
