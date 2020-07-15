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
        "@typescript-eslint/no-this-alias": ['error', { allowedNames: ['self']}],
        "no-restricted-globals": 'off'
    }
};
