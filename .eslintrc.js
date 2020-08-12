/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
  },
  extends: ['prettier', 'airbnb-base'],
  plugins: ['prettier'],
};
