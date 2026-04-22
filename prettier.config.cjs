const config = {
  arrowParens: 'always',
  singleQuote: true,
  eslintIntegration: true,
  endOfLine: 'auto',
  printWidth: 200,
  useTabs: false,
  tabWidth: 2,
  jsxSingleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: true,
  semi: false,
  vueIndentScriptAndStyle: false,
  spaceBeforeFunctionParen: true,
  overrides: [
    {
      files: ['*.html'],
      options: { parser: 'html' }
    }
  ]
}

module.exports = config
