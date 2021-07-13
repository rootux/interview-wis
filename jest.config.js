module.exports = {
  "moduleFileExtensions": [
    "js",
    "ts"
  ],
  "transform": {
    "\\.ts$": "ts-jest"
  },
  preset: "ts-jest",
  setupFilesAfterEnv: ["jest-extended"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};
