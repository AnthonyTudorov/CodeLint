module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-shadow': 'off',
    'react/jsx-file-extension': 'off',
    camelcase: 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-cycle': 'off',
    'no-unused-vars': 'off',
    'no-mixed-operators': 'off',
    'react/prop-types': 'off'
  },
};
