import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "no-unused-vars": ["warn"],
    },
  },
];
