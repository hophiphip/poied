module.exports = {
  root: true,
  env: { 
      browser: true, 
      es2020: true 
  },
  extends: [
      'eslint:recommended', 
      'plugin:@typescript-eslint/strict-type-checked', 
      'plugin:@typescript-eslint/stylistic-type-checked', 
      'plugin:react/recommended', 
      'plugin:react/jsx-runtime', 
      'plugin:react-hooks/recommended', 
      'plugin:storybook/recommended',
      'plugin:prettier/recommended'
  ],
  ignorePatterns: [
      'dist',
      'dist-preivew',
      'storybook-static', 
      '.eslintrc.cjs'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
      'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
      ],
      '@typescript-eslint/consistent-type-definitions': [
          'warn',
          'type'
      ]
  },
  parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: [
          './tsconfig.json', 
          './tsconfig.node.json'
      ],
      tsconfigRootDir: __dirname,
  },
  settings: {
      react: {
          version: 'detect',
      }
  }
}
