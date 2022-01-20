// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { getDecoratorMetadata } from './getDecoratorMetadata';
import { setDecoratorMetadata } from './setDecoratorMetadata';

const APPLIED_DECORATORS_NAME = 'decorators';

/**
 * Represents a decorator that has been applied to a target.
 */
export type AppliedDecorator = {
    name: string;
    displayName: string;
    target: Function | Object;
    propertyKey: string | symbol | undefined;
    descriptorOrIndex: PropertyDescriptor | number | undefined;
};

/**
 * Gets the list of decorators that have been applied to the specified type.
 * @param {Constructor<any>} type - The type to get the applied decorators for.
 * @returns {AppliedDecorator[]} The applied decorators.
 */
export function getAppliedDecorators(type: Constructor<any>): AppliedDecorator[] {
    let decorators = getDecoratorMetadata<AppliedDecorator[]>(APPLIED_DECORATORS_NAME, type, true);

    if (decorators === undefined) {
        decorators = [];
        setDecoratorMetadata(APPLIED_DECORATORS_NAME, type, decorators);
    }

    return decorators;
}
