// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ClassCallback } from './ClassCallback';
import { ICanTraverseModules } from './ICanTraverseModules';

type ObjectCallback = (object: any) => void;

/**
 * Represents an implementation of {@link ICanTraverseModules}.
 */
export class ModuleTraverser extends ICanTraverseModules {
    /** @inheritdoc */
    forEachClass(callback: ClassCallback): void {
        this.traverseLoadedModules((object) => {
            if (typeof object !== 'function') {
                return;
            }

            if (object.prototype === undefined || object.prototype.constructor !== object) {
                return;
            }

            callback(object);
        });
    }

    private traverseLoadedModules(callback: ObjectCallback): void {
        if (typeof require.cache !== 'object') {
            return;
        }

        for (const moduleId in require.cache) {
            const module = require.cache[moduleId];

            if (module === undefined || module.loaded === false) {
                continue;
            }

            this.traverseExportsRecursively(module.exports, [], callback);
        }
    }

    private traverseExportsRecursively(object: any, stack: any[], callback: ObjectCallback): void {
        if (stack.includes(object)) {
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
