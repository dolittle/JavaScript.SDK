// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, NEVER, Subject, ReplaySubject } from 'rxjs';

export class Cancellation extends Observable<void> {
    static default: Cancellation = NEVER;
}

export class CancellationSource {
    private _subject: Subject<void>;

    constructor(...sources: Cancellation[]) {
        this._subject = new ReplaySubject(1);
        for (const source of sources) {
            source.subscribe(this._subject);
        }
    }

    cancel(): void {
        this._subject.next();
    }

    get cancellation(): Cancellation {
        return this._subject;
    }
}