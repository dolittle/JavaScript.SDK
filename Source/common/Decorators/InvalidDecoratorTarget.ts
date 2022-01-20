// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DecoratorTarget } from './DecoratorTarget';

/**
 * Exception that gets thrown when a decorator is used on an invalid target.
 */
export class InvalidDecoratorTarget extends Error {
    /**
     * Initialises a new instance of the {@link InvalidDecorator} class.
     * @param {string} name - The name of the decorator that was used.
     * @param {DecoratorTarget} decoratedTarget - The target that was decorated.
     * @param {DecoratorTarget} validTargets - The valid targets for the decorator.
     */
    constructor(name: string, decoratedTarget: DecoratorTarget, validTargets: DecoratorTarget) {
        super(`The @${name} decorator cannot be used on ${InvalidDecoratorTarget.getTargetNames(decoratedTarget)}. It is only valid for ${InvalidDecoratorTarget.getTargetNames(validTargets)}`);
    }

    /**
     * Gets target names formatted as a human readable string.
     * @param {DecoratorTarget} target - The decorator target(s).
     * @returns {string} A human readable string.
     */
    static getTargetNames(target: DecoratorTarget): string {
        const names: string[] = [];

        if ((target & DecoratorTarget.Class) !== 0) {
            names.push('class');
        }
        if ((target & DecoratorTarget.ConstructorParameter) !== 0) {
            names.push('constructor parameter');
        }
        if ((target & DecoratorTarget.Method) !== 0) {
            names.push('method');
        }
        if ((target & DecoratorTarget.MethodParameter) !== 0) {
            names.push('method parameter');
        }
        if ((target & DecoratorTarget.Property) !== 0) {
            names.push('property');
        }
        if ((target & DecoratorTarget.Getter) !== 0) {
            names.push('getter');
        }
        if ((target & DecoratorTarget.Setter) !== 0) {
            names.push('setter');
        }

        switch (names.length) {
            case 0:
                return '';
            case 1:
                return names[0];
            case 2:
                return names.join(' or ');
            default:
                return names.slice(0, -1).join(', ') + ' or ' + names.slice(-1)[0];
        }
    };
}
