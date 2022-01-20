// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';

import { ExecutionContext } from '@dolittle/sdk.execution';

/**
 * Defines a reverse call client callback to handle a request coming from the server to the client.
 */
export type ReverseCallCallback<TRequest, TResponse> = (request: TRequest, executionContext: ExecutionContext) => TResponse | Promise<TResponse>;

/**
 * Defines a client for reverse calls coming from the server to the client.
 */
export abstract class IReverseCallClient<TConnectResponse> extends Observable<TConnectResponse> {}
