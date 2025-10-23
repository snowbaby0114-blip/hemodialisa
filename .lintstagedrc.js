module.exports = {
  // Run ESLint and Prettier on TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],

  // Format other files with Prettier
  '*.{json,css,md}': ['prettier --write'],

  // Type-check TypeScript files
  '*.{ts,tsx}': () => 'tsc --noEmit',
}
