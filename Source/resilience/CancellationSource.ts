// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject } from 'rxjs';
import { Cancellation } from './Cancellation';

/**
 * Represents the source of a {@link Cancellation}.
 */
export class CancellationSource {
    private _subject: Subject<void>;

    /**
     * Initializes a new instance of {@link CancellationSource}.
     * @param {Cancellation[]} sources - A set of {@link Cancellation} to link to this source.
     */
    constructor(...sources: Cancellation[]) {
        this._subject = new Subject();
        for (const source of sources) {
            source.subscribe(this._subject);
        }
    }

    /**
     * Cancel it.
     */
    cancel(): void {
        this._subject.complete();
    }

    /**
     * Gets the cancellation subject.
     */
    get cancellation(): Cancellation {
        return this._subject;
    }

    /**
     * Get whether or not the {@link CancellationSource} is cancelled.
     */
    get cancelled(): boolean {
        return this._subject.isStopped;
    }
}
