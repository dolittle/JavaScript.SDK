// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TenantId } from '@dolittle/sdk.execution';
import { CallbackShouldBeFunction } from './CallbackShouldBeFunction';
import { Subscription } from './Subscription';
import { SubscriptionResponse } from './SubscriptionResponse';

/**
 * Callback that gets called when a subscription has been completed.
 */
export type SubscriptionCompleted = (consumerTenant: TenantId, subscription: Subscription, subscriptionResponse: SubscriptionResponse) => void;

/**
 * Callback that gets called when a subscription has been failed.
 */
export type SubscriptionFailed = (consumerTenant: TenantId, subscription: Subscription, subscriptionResponse: SubscriptionResponse) => void;

/**
 * Callback that gets called when a subscription has been succeeded.
 */
export type SubscriptionSucceeded = (consumerTenant: TenantId, subscription: Subscription, subscriptionResponse: SubscriptionResponse) => void;

/**
 * Represents the arguments related to {@link SubscriptionCallbacks}.
 */
export class SubscriptionCallbackArguments {
    /**
     * Initialises a new instance of the {@link SubscriptionCallbackArguments} class.
     * @param {TenantId} consumerTenant - The consumer tenant id of the subscription.
     * @param {Subscription} subscription - The subscription.
     * @param {SubscriptionResponse} response - The subscription response.
     */
    constructor(readonly consumerTenant: TenantId, readonly subscription: Subscription, readonly response: SubscriptionResponse) { }
}

/**
 * Represents all callbacks possible for a subscription related to subscribing and the response from the runtime.
 */
export class SubscriptionCallbacks {
    readonly responses: Observable<SubscriptionCallbackArguments> = new Subject();

    private _completed: Observable<SubscriptionCallbackArguments> = new Observable();
    private _succeeded: Observable<SubscriptionCallbackArguments> = new Observable();
    private _failed: Observable<SubscriptionCallbackArguments> = new Observable();

    private _ownsResponses: Boolean = true;

    /**
     * Initializes a new instance of {@link SubscriptionCallbacks}.
     * @param {Observable<SubscriptionCallbackArguments>} [source] - Optional source of responses.
     */
    constructor(source?: Observable<SubscriptionCallbackArguments>) {
        if (source) {
            this.responses = source;
            this._ownsResponses = false;
        }
        this._completed = this.responses.pipe();
        this._succeeded = this.responses.pipe(filter(_ => !_.response.failed));
        this._failed = this.responses.pipe(filter(_ => _.response.failed));
    }

    /**
     * Registers a completed callback. This will be called for all responses.
     * @param {SubscriptionCompleted} callback - The callback to register.
     * @throws {CallbackShouldBeFunction} If the callback is not a function.
     */
    onCompleted(callback: SubscriptionCompleted): void {
        CallbackShouldBeFunction.assert(callback);
        this._completed.subscribe(_ => callback(_.consumerTenant, _.subscription, _.response));
    }

    /**
     * Registers a succeeded callback. This will be called for all successful responses.
     * @param {SubscriptionSucceeded} callback - The callback to register.
     * @throws {CallbackShouldBeFunction} If the callback is not a function.
     */
    onSucceeded(callback: SubscriptionSucceeded): void {
        CallbackShouldBeFunction.assert(callback);
        this._succeeded.subscribe(_ => callback(_.consumerTenant, _.subscription, _.response));
    }

    /**
     * Registers a succeeded callback. This will be called for all failed responses.
     * @param {SubscriptionFailed} callback - The callback to register.
     * @throws {CallbackShouldBeFunction} If the callback is not a function.
     */
    onFailed(callback: SubscriptionFailed): void {
        CallbackShouldBeFunction.assert(callback);
        this._failed.subscribe(_ => callback(_.consumerTenant, _.subscription, _.response));
    }

    /**
     * Pushes the next response.
     * @param {TenantId} consumerTenant - The consumer tenant the response is for.
     * @param {Subscription} subscription - The actual subscription that was subscribing.
     * @param {SubscriptionResponse} response - The response from the subscription attempt.
     */
    next(consumerTenant: TenantId, subscription: Subscription, response: SubscriptionResponse): void {
        if (this._ownsResponses) {
            (this.responses as Subject<SubscriptionCallbackArguments>).next(new SubscriptionCallbackArguments(consumerTenant, subscription, response));
        }
    }
}
