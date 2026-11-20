module.exports = {
  "transform": {
    "^.+\\.tsx?$": "@swc/jest"
  },
  "testEnvironment": "node",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json"],
  "collectCoverageFrom": ["src/**/*.ts", "worker/src/**/*.ts"],
  "coverageThreshold": {
    "global": {
      "statements": 55,
      "branches": 40,
      "functions": 85,
      "lines": 60
    }
  }
};
