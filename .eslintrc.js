// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

module.exports = {
    extends: '@dolittle',
    root: true,
    parserOptions: {
        project: './Sources/*/tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    rules: {
        '@typescript-eslint/unified-signatures': 'off',
        'import/no-extraneous-dependencies': 'off',
        'eol-last': 'error',
        'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
        'header/header': [
            2,
            'line',
            [
                ' Copyright (c) Dolittle. All rights reserved.',
                ' Licensed under the MIT license. See LICENSE file in the project root for full license information.',
            ],
            2
        ],
        'jsdoc/require-param-name': 'error',
        'jsdoc/require-param-type': 'error',
        'jsdoc/check-alignment': 'error',
        'jsdoc/check-indentation': 'error',
        'jsdoc/valid-types': 'error',
        'jsdoc/require-hyphen-before-param-description': 'error',
        'jsdoc/check-line-alignment': 'error',
        'jsdoc/require-returns': 'error',
        'jsdoc/require-returns-check': 'error',
        'jsdoc/require-returns-description': 'error',
        'jsdoc/require-returns-type': 'error',
        'jsdoc/check-tag-names': 'error',
        'jsdoc/check-param-names': 'error',
        'jsdoc/check-types': 'error',
        'jsdoc/empty-tags': 'error',
        'jsdoc/no-bad-blocks': 'error',
        'jsdoc/no-undefined-types': 'error',
        'jsdoc/multiline-blocks': 'error',
        'jsdoc/no-multi-asterisks': 'error',
        'jsdoc/require-asterisk-prefix': 'error',
        'jsdoc/require-description': 'error',
        'jsdoc/require-description-complete-sentence': 'error',
        'jsdoc/require-param': 'error',
        'jsdoc/require-param-description': 'error',
        'jsdoc/tag-lines': ['error', 'always', { 'count': 0 }],

        'jsdoc/require-jsdoc': ['error', {
            'require': {
                'FunctionDeclaration': false
            },
            'contexts': [
                'ExportNamedDeclaration>TSTypeAliasDeclaration',
                'ExportNamedDeclaration>FunctionDeclaration'
            ]
        }]
    },
    overrides: [
        {
            files: ['**/for_*/**'],
            rules: {
                '@typescript-eslint/naming-convention': 'off',
            },
        },
        {
            files: ['**/for_*/**'],
            rules: {
                '@typescript-eslint/no-unused-expressions': 'off',
            },
        },
        {
            files: ['**/for_*/**'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
        {
            files: ['**/for_*/**'],
            rules: {
                'no-restricted-globals': 'off',
            },
        },
        {
            files: ['Source/sdk/**'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
        {
            files: ['Samples/Basic/**'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
    ],
};
