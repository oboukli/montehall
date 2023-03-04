module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./tsconfig.spec.json"],
  },
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    "import/no-unresolved": "error",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".mts", ".ts", ".d.ts"],
    },
    "import/resolver": {
      typescript: {
        project: ["tsconfig.json", "tsconfig.spec.json"],
      },
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  env: {
    node: true,
  },
  overrides: [
    {
      files: ["**/*.spec.ts"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
    },
  ],
};
