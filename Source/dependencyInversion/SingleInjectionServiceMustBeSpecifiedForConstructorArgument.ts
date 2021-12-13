// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The exception that is thrown when no or multiple services are injected into a constructor parameter.
 */
export class SingleInjectionServiceMustBeSpecifiedForConstructorArgument extends Error {
    /**
     * Initialises a new instance of the {@link SingleInjectionServiceMustBeSpecifiedForConstructorArgument} class.
     * @param {string} className - The name of the class that has an inject decorator for a constructor parameter.
     * @param {number} index - The parameter index that has none or multiple services specified.
     */
    constructor(className: string, index: number) {
        super(`Exactly one service must be injected for constructor argument ${index} in class ${className}.`);
    }
}
