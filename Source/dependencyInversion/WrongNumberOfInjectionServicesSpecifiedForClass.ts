// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when the wrong number of injected services does not match the number of parameters in the class constructor.
 */
export class WrongNumberOfInjectionServicesSpecifiedForClass extends Error {
    /**
     * Initialises a new instance of the {@link WrongNumberOfInjectionServicesSpecifiedForClass} class.
     * @param {string} className - The name of the class with the inject decorator.
     * @param {number} constructorParameters - The number of expected parameters from the constructor.
     * @param {number} injectedServices - The number of provided services in the inject decorator.
     */
    constructor(className: string, constructorParameters: number, injectedServices: number) {
        super(`Wrong number of injected services specified for class ${className}. The constructor takes ${constructorParameters} parameters, while ${injectedServices} services was specified in the @inject() decorator.`);
    }
}
