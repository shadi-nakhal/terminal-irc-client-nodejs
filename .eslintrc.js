module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        // Require parenthesis around arrow function argument
        'arrow-parens': 'error',
        'comma-dangle': ['error', 'never'],
        'linebreak-style': ['error', 'unix'],
        'no-useless-concat' : 'error',
        // 'max-len': ['error', { code: 100, tabWidth: 2, ignoreUrls: true }],
        'max-len': 'off',
        'semi': ['error', 'always']
      }
};
