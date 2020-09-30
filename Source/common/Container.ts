// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { IContainer } from './IContainer';
import { DefaultContainerDoesNotSupportConstructorArguments } from './DefaultContainerDoesNotSupportConstructorArguments';

/**
 * Represents an implementation of {@link IContainer}.
 */
export class Container implements IContainer {

    /** @inheritdoc */
    get(service: Constructor) {
        this.throwIfConstructorHasArguments(service);
        return new service();
    }

    private throwIfConstructorHasArguments(service: Constructor) {
        if (service.length > 0) {
            throw new DefaultContainerDoesNotSupportConstructorArguments();
        }
    }
}
