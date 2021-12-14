// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, NEVER, timer, Subject } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

/**
 * Represents a possible cancellation.
 */
export class Cancellation extends Observable<void> {
    private readonly _subject = new Subject<void>();
    private _cancelled = false;

    /**
     * Creates a new instance of the {@link Cancellation} class.
     * @param {Observable<void>} source - The source observable indicates a cancellation has been requested by completing.
     */
    constructor(source: Observable<void>) {
        super((subscriber) => {
            const subscription = this._subject.subscribe(subscriber);
            return () => {
                subscription.unsubscribe();
            };
        });
        source.subscribe(this._subject);
    }

    /**
     * Gets a value indicating wheter or not the {@link Cancellation} is cancelled.
     */
    get cancelled(): boolean {
        return this._subject.isStopped;
    }

    /**
     * Default {@link Cancellation}, which is never.
     */
    static default: Cancellation = new Cancellation(NEVER);

    /**
     * Creates a new {@link Cancellation} that is cancelled after the specified amount of time.
     * @param {number} time - The time in milliseconds until the cancellation occurs.
     * @returns {Cancellation} The scheduled cancellation.
     */
    static after(time: number): Cancellation {
        const source = timer(time).pipe(ignoreElements());
        return new Cancellation(source);
    }
}
