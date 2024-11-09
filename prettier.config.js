/** @type {import('prettier').Config} */
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 120,
  // tailwindcss
  tailwindAttributes: ["theme"],
  tailwindFunctions: ["twMerge", "createTheme"],
};
