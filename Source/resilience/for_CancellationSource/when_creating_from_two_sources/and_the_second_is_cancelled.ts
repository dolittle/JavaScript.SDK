// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject } from 'rxjs';
import { describeThis } from '@dolittle/typescript.testing';

import { CancellationSource } from '../../CancellationSource';

describeThis(__filename, () => {
    const first = new Subject<void>();
    const second = new Subject<void>();

    const source = new CancellationSource(first, second);
    const cancellation = source.cancellation;

    let cancelled = false;
    cancellation.subscribe({
        complete: () => cancelled = true,
    });

    second.complete();

    it('should be cancelled', () => cancelled.should.be.true);
});
