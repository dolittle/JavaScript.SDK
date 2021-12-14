// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ClassCallback } from './ClassCallback';
import { ICanTraverseModules } from './ICanTraverseModules';

type ObjectCallback = (object: any) => void;

/**
 * Represents an implementation of {@link ICanTraverseModules}.
 */
export class ModuleTraverser extends ICanTraverseModules {
    /**
     * A list of module paths that we know don't export any interesting types, and will therefore not be traversed.
     * Note: all modules imported by these blacklisted modules will also not be traversed.
     */
    static readonly blacklistPaths: readonly string[] = [
        'node_modules/@dolittle',
        'JavaScript.SDK/Source',
    ];

    /** @inheritdoc */
    forEachClass(callback: ClassCallback): void {
        this.traverseLoadedModulesFromMain((object) => {
            if (typeof object !== 'function') {
                return;
            }

            if (object.prototype === undefined || object.prototype.constructor !== object) {
                return;
            }

            callback(object);
        });
    }

    private traverseLoadedModulesFromMain(callback: ObjectCallback): void {
        if (typeof require.main !== 'object') {
            return;
        }

        const set = new Set<string>();
        this.traverseLoadedModuleRecursively(require.main, set, callback);
    }

    private traverseLoadedModuleRecursively(module: NodeJS.Module, checked: Set<string>, callback: ObjectCallback): void {
        if (module.id === undefined || checked.has(module.id)) {
            return;
        }
        checked.add(module.id);

        for (const blacklistPath of ModuleTraverser.blacklistPaths) {
            if (module.path.includes(blacklistPath)) {
                return;
            }
        }

        if (module.loaded === true && module.exports !== undefined) {
            this.traverseExportsRecursively(module.exports, [], callback);
        }

        if (Array.isArray(module.children)) {
            for (const child of module.children) {
                this.traverseLoadedModuleRecursively(child, checked, callback);
            }
        }
    }

    private traverseExportsRecursively(object: any, stack: any[], callback: ObjectCallback): void {
        if (object === undefined || stack.includes(object)) {
            return;
        }

        callback(object);

        stack.push(object);
        for (const property in object) {
            this.traverseExportsRecursively(object[property], stack, callback);
        }
        stack.pop();
    }
}
