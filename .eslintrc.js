module.exports = {
    root: true,
    env: {
        node: true,
        'vue/setup-compiler-macros': true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    globals: {
        FroalaEditor: true
    },
    ignorePatterns: ['scripts/*'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'space-before-function-paren': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // https://github.com/eslint/eslint/issues/13956
        indent: 'off',
        '@typescript-eslint/indent': ['warn', 4],
        'import/no-duplicates': 'off'
    }
}
