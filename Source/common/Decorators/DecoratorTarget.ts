// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents the targets of a decorator.
 */
export enum DecoratorTarget {
    /**
     * A class (constructor) target.
     */
    Class = 1,

    /**
     * A constructor parameter target.
     */
    ConstructorParameter = 2,

    /**
     * A method target.
     */
    Method = 4,

    /**
     * A method parameter target.
     */
    MethodParameter = 8,

    /**
     * A property target.
     */
    Property = 16,

    /**
     * A setter target.
     */
    Setter = 32,

    /**
     * A getter target.
     */
    Getter = 64,

    /**
     * All targets.
     */
    All = 127,
}
