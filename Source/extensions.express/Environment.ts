// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEnvironment } from './IEnvironment';

/**
 * Represents an implementation of {@link IEnvironment}.
 */
export class Environment extends IEnvironment {
    /**
     * Initialises a new instance of the {@link Environment} class.
     */
    constructor() {
        super();

        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    /** @inheritdoc */
    readonly isDevelopment: boolean;
}
