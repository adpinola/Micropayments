module.exports = {
  singleQuote: true,
  printWidth: 150,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.sol',
      options: {
        printWidth: 150,
        tabWidth: 4,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: false,
        explicitTypes: 'always',
      },
    },
  ],
};
