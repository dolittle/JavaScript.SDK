// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Defines a system that keeps track of the results of building a client.
 */
export abstract class IClientBuildResults {
    /**
     * Adds an informational build result.
     * @param {string} message - The information message.
     */
    abstract addInformation(message: string): void;

    /**
     * Adds a failure build result.
     * @param {string} message - The failure message.
     * @param {string} [fix] - An optional suggested fix to resolve the failure.
     */
    abstract addFailure(message: string, fix?: string): void;

    /**
     * Adds an error result.
     * @param {Error} error - The error that was thrown.
     */
    abstract addError(error: Error): void;

    /**
     * Gets a value indicating whether the client building failed or not.
     */
    abstract get failed(): boolean;
}
