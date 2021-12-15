// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ClassCallback } from './ClassCallback';

/**
 * Defines a system that can traverse currently loaded modules.
 */
export abstract class ICanTraverseModules {
    /**
     * Traverses the loaded modules and calls the provided callback for each class.
     * @param {ClassCallback} callback - The callback to invoke for each discovered class.
     */
    abstract forEachClass(callback: ClassCallback): void;
}
