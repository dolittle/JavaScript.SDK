// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subscribable } from 'rxjs';

export type ReverseCallCallback<TRequest, TResponse> = (request: TRequest) => TResponse;

/**
 * Defines a client for reverse calls coming from the server to the client.
 */
export interface IReverseCallClient<TConnectResponse> extends Subscribable<TConnectResponse> {
}
