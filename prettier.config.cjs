/** @type {import("prettier").Config} */
module.exports = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  arrowParens: "avoid",
  bracketSpacing: true,
  semi: true,
  printWidth: 100,
  trailingComma: "none",
  endOfLine: "lf",
  bracketSameLine: true,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
