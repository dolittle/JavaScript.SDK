// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Defines the different types a projection state can have.
 */
export enum CurrentStateType {
    /**
     * The state was created from the initial state.
     */
    CreatedFromInitialState,
    /**
     * The state was created from the persisted state.
     */
    Persisted
}
