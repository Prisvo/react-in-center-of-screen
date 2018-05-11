module.exports = {
  parser: "babel-eslint",
  plugins: ["jest", "flowtype"],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:flowtype/recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    sourceType: "module"
  },
  overrides: [
    {
      files: "src/*.test.js",
      env: {
        "jest/globals": true
      }
    }
  ]
};
