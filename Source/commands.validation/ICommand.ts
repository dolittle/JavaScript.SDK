// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Defines the base structure of a Command
 */
export interface ICommand {

    /**
     * The Artifact Id that represents the type of the Command.
     *
     * @type {string}
     */
    readonly type: string;
}
