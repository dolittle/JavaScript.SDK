// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import { Subject } from 'rxjs';
import { Cancellation, CancellationSource } from '../../index';

describeThis(__filename, () => {
    const first = new Subject<void>();
    const second = new Subject<void>();

    const source = new CancellationSource(first, second);
    const cancellation = source.cancellation;

    let cancelled = false;
    cancellation.subscribe({
        complete: () => cancelled = true,
    });

    first.complete();

    it('should be cancelled', () => cancelled.should.be.true);
});
