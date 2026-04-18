import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
  },
  plugins: [
    // default enabled built-in plugins https://oxc.rs/docs/guide/usage/linter/plugins.html#supported-plugins
    "eslint",
    "typescript",
    "oxc",
    "unicorn",

    // default disabled built-in plugins
    "react",
    "react-perf"
  ],
  ignorePatterns: [
    "routeTree.gen.ts"
  ],
});
