module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Prevent TypeScript-specific issues
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // Enforce consistent React patterns
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    
    // Accessibility
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/aria-props': 'warn',
    
    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
    'no-duplicate-imports': 'warn'
  },
  overrides: [
    {
      // Relax rules for test files
      files: ['**/*.test.ts', '**/*.test.tsx', '**/test/**/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off'
      }
    }
  ]
};
