// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject } from 'rxjs';

import { Cancellation } from './Cancellation';

/**
 * Represents a source of a {@link Cancellation}.
 */
export class CancellationSource {
    private readonly _subject: Subject<void>;

    /**
     * Initializes a new instance of {@link CancellationSource}.
     * @param {Cancellation[]} sources - A set of {@link Cancellation} to link to this source.
     */
    constructor(...sources: Cancellation[]) {
        this._subject = new Subject();
        for (const source of sources) {
            source.subscribe(this._subject);
        }
        this.cancellation = new Cancellation(this._subject);
    }

    /**
     * Cancel the {@link Cancellation} of the {@link CancellationSource}.
     */
    cancel(): void {
        this._subject.complete();
    }

    /**
     * Gets the {@link Cancellation} for the {@link CancellationSource}.
     */
    readonly cancellation: Cancellation;

    /**
     * Gets a value indicating wheter or not the {@link CancellationSource} is cancelled.
     */
    get cancelled(): boolean {
        return this.cancellation.cancelled;
    }
}
