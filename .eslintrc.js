module.exports = {
    root: true,
    extends: [
        'plugin:@wordpress/eslint-plugin/recommended',
        'prettier', // optional: disables rules that conflict with Prettier
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    rules: {
        // You can override rules here
        'react/prop-types': 'off', // common for Gutenberg where prop types aren't always used
    },
};
