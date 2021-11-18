// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext } from '@dolittle/sdk.execution';
import { PartialObserver, Subscribable, Unsubscribable } from 'rxjs';

/**
 * Defines a reverse call client callback to handle a request comfing from the server to the client.
 */
export type ReverseCallCallback<TRequest, TResponse> = (request: TRequest, executionContext: ExecutionContext) => TResponse | Promise<TResponse>;

/**
 * Defines a client for reverse calls coming from the server to the client.
 */
export abstract class IReverseCallClient<TConnectResponse> implements Subscribable<TConnectResponse> {
    abstract subscribe(observer?: PartialObserver<TConnectResponse>): Unsubscribable;
    abstract subscribe(next: null | undefined, error: null | undefined, complete: () => void): Unsubscribable;
    abstract subscribe(next: null | undefined, error: (error: any) => void, complete?: () => void): Unsubscribable;
    abstract subscribe(next: (value: TConnectResponse) => void, error: null | undefined, complete: () => void): Unsubscribable;
    abstract subscribe(next?: (value: TConnectResponse) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
    abstract subscribe(next?: any, error?: any, complete?: any): Unsubscribable;
}
