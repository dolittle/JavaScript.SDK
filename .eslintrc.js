// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

module.exports = {
    extends: '@dolittle/typescript',
    root: true,
    parserOptions: {
        project: './Sources/*/tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    rules: {
        "@typescript-eslint/unified-signatures": 'off',
        "import/no-extraneous-dependencies": 'off'
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
