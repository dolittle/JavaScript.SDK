// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Logger } from 'winston';

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Observable } from 'rxjs';
import { Cancellation } from '@dolittle/sdk.resilience';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { IReverseCallClient } from './IReverseCallClient';

/**
 * Defines a system for registering a processor that handles request from the Runtime.
 */
export abstract class ClientProcessor<TIdentifier extends ConceptAs<Guid, string>, TRegisterArguments, TRegisterResponse, TRequest, TResponse> {

    constructor(
        protected _kind: string,
        protected _identifier: TIdentifier) { }

    /**
     * Registers a processor with the Runtime, and if successful starts handling requests.
     * @param {Cancellation} cancellation Used to cancel the registration and processing.
     * @returns {Observable} Representing the connection to the Runtime.
     */
    protected abstract register (cancellation: Cancellation): Observable<never>;

    protected abstract get registerArguments (): TRegisterArguments;

    /**
     * Creates a reverse call client.
     * @param registerArguments
     * @param callback
     * @param pingTimeout
     * @param cancellation
     */
    protected abstract createClient (
        registerArguments: TRegisterArguments,
        callback: (request: TRequest, executionContext: ExecutionContext) => Promise<TResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<TRegisterResponse>;

    /**
     * Handles the request from the Runtime.
     * @param {TRequest} request The request from the Runtime.
     * @param {ExecutionContext} executionContext The execution context.
     */
    protected abstract handle (request: TRequest, executionContext: ExecutionContext): Promise<TResponse>;
}
