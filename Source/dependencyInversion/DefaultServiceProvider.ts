// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Container } from 'inversify';

import { InversifyServiceProvider } from './Internal/Implementations/InversifyServiceProvider';
import { IServiceProvider } from './IServiceProvider';

/**
 * Represents the default {@link IServiceProvider} that will be used if no external service provider is configured for the dolittle client.
 */
export class DefaultServiceProvider extends InversifyServiceProvider {
    /**
     * Initialises a new instance of the {@link DefaultServiceProvider} class.
     */
    constructor() {
        super(new Container());
    }
}
