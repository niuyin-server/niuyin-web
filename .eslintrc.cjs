module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-essential',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'  // 这里是将prettier作为插件被eslint使用，避免两者有冲突，放在extends最下方
    ],
    overrides: [],
    parser: 'vue-eslint-parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: '@typescript-eslint/parser'
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'max-len': ['error', 100], // 强制一行的最大长度
      'no-shadow': 'off', // 禁止变量声明与外层作用域的变量同名
      'no-unused-vars': 'warn', // 禁止出现未使用过的变量
      eqeqeq: 'off', // 要求使用 === 和 !==
      'prefer-const': 'warn', // 要求使用 const 声明那些声明后不再被修改的变量
      '@typescript-eslint/no-empty-function': 'off', // 不允许空函数
      '@typescript-eslint/no-explicit-any': 'off' // 禁止使用 any 类型
    }
}
