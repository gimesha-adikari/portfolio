import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        ignores: [".next/**", "node_modules/**", "out/**"],
    },
    eslint.configs.recommended,
    {
        rules: {
            // Existing compatibility code intentionally swallows optional API
            // failures; these rules can be tightened during the cleanup phase.
            "no-empty": "off",
            "no-useless-escape": "off",
        },
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            globals: {
                console: "readonly",
                process: "readonly",
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            // TypeScript supplies these checks through the compiler; the parser
            // is kept here so the existing lint command can parse TS/TSX.
            "no-undef": "off",
            "no-unused-vars": "off",
        },
    },
];
