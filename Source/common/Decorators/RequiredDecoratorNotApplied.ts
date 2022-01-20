// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { DecoratorTarget } from './DecoratorTarget';
import { InvalidDecoratorTarget } from './InvalidDecoratorTarget';

/**
 * The exception that gets thrown when a required decorator is not applied.
 */
export class RequiredDecoratorNotApplied extends Error {
    /**
     * Initialises a new instance of the {@link RequiredDecoratorNotApplied} class.
     * @param {string} displayName - The decorator display name.
     * @param {DecoratorTarget} validTargets - The valid targets of the decorator.
     * @param {Constructor<any>} type - The class that was expected to have the decorator.
     * @param {string} reason - The reason why the decorator is required.
     */
    constructor(displayName: string, validTargets: DecoratorTarget, type: Constructor<any>, reason: string) {
        super(`The @${displayName} decorator is not applied to ${RequiredDecoratorNotApplied.getApplicableTargets(validTargets, type)}. ${reason}.`);
    }

    private static getApplicableTargets(validTargets: DecoratorTarget, type: Constructor<any>): string {
        switch (validTargets) {
            case DecoratorTarget.Class:
                return `class ${type.name}`;
            default:
                return `any ${InvalidDecoratorTarget.getTargetNames(validTargets)} in class ${type.name}`;
        }
    }
}
