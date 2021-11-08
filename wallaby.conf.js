// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

module.exports = function (w) {
    return {
        files: [
            { pattern: 'package.json', instrument: false },
            { pattern: 'Source/*/package.json', instrument: false },
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
            '**/*.ts': w.compilers.typeScript({        
                target: "ES2017",
                module: "CommonJS",
                downlevelIteration: true,
                experimentalDecorators: true,
                esModuleInterop: true,
            })
        },

        setup: (w) => {
            const rootFolder = w.projectCacheDir;
            const getAliases = () => {
                const { glob } = require('glob');
                const aliases = {};
                const rootPackage = require('./package.json');
                rootPackage.workspaces.forEach(workspaceGlob => {
                    glob.sync(workspaceGlob).forEach(workspaceRoot => {
                        const relativeWorkspaceRoot = `./${workspaceRoot}`
                        const absoluteWorkspaceRoot = `${rootFolder}/${workspaceRoot}`;
                        const packageName = require(`${relativeWorkspaceRoot}/package.json`).name;
                        aliases[packageName] = absoluteWorkspaceRoot;
                    });
                });
                return aliases;
            }
            const { addAliases } = require('module-alias');
            addAliases(getAliases());
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


