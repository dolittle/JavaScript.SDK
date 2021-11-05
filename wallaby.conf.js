// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

module.exports = function (w) {
    return {
        files: [
            '!Distribution',
            '!**/Distribution',
            'Source/**/*.ts',
            { pattern: 'Source/**/for_*/**/given/*.@(ts|js)', instrument: false },
            '!Source/**/for_*/**/!(given)/*.ts',
            '!Source/**/for_*/*.ts',
        ],

        tests: [
            '!Distribution',
            '!**/Distribution',
            'Source/**/for_*/*.ts',
            'Source/**/for_*/**/!(given)/*.ts',
            '!Source/**/for_*/given/*.ts',
            '!Source/**/for_*/**/given/*.ts',
        ],

        env: {
            type: 'node'
        },

        compilers: {
            'Source/**/*.ts?(x)': w.compilers.typeScript({
                module: 'commonjs',
                downlevelIteration: true,
                experimentalDecorators: true,
                jsx: "react",
                esModuleInterop: true,
                target: 'es6'
            })
        },

        setup: (w) => {
            global.expect = chai.expect;
            const should = chai.should();
            global.sinon = require('sinon');
            const sinonChai = require('sinon-chai');
            const chaiAsPromised = require('chai-as-promised');
            chai.use(sinonChai);
            chai.use(chaiAsPromised);
        }
    };
};
