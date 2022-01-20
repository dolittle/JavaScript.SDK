// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IDolittleClient } from './IDolittleClient';

/**
 * Exception that gets thrown when attempting to access properties of a {@link IDolittleClient} that is not connected.
 */
export class CannotUseUnconnectedDolittleClient extends Error {
    /**
     * Initialises a new instance of the {@link CannotUseUnconnectedDolittleClient} class.
     * @param {string} propertyName - The name of the property that was accessed.
     */
    constructor(propertyName: string) {
        super(`The Dolittle Client has not been connected yet, so you cannot use the ${propertyName} property. Connect the client by calling the .connect() method.`);
    }
}
