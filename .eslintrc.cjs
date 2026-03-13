const path = require('path');

module.exports = {
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // Resolve tsconfig relative to this config file so ESLint finds it
    // even when the workspace root is the parent folder (e.g. cart_challenge)
    project: [
      path.join(__dirname, 'tsconfig.app.json'),
      path.join(__dirname, 'tsconfig.node.json'),
    ],
  },
  plugins: ['react-hooks'],
  overrides: [
    {
      files: ['.eslintrc.cjs', '*.cjs'],
      env: { node: true },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ],
};
