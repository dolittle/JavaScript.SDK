// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, NEVER } from 'rxjs';

/**
 * Represents a possible cancellation.
 */
export class Cancellation extends Observable<void> {
    private _cancelled = false;

    /**
     * Creates a new instance of the {@link Cancellation} class.
     * @param {Observable<void>} source - The source observable indicates a cancellation has been requested by completing.
     */
    constructor(source: Observable<void>) {
        super((subscriber) => {
            const subscription = source.subscribe(subscriber);
            return () => {
                subscription.unsubscribe();
            };
        });
        source.subscribe({
            complete: () => {
                this._cancelled = true;
            }
        });
    }

    /**
     * Gets a value indicating wheter or not this cancellation is cancelled.
     */
    get cancelled(): boolean {
        return this._cancelled;
    }

    /**
     * Default cancellation, which is never.
     */
    static default: Cancellation = new Cancellation(NEVER);
}
