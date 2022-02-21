module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    plugins: ['react', 'react-hooks', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: { 'prettier/prettier': 'warn' },
}
