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
