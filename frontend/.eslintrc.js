module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'plugin:vue/recommended', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/attribute-hyphenation': 'never'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}