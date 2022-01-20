// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject } from 'rxjs';
import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '../../Cancellation';
import { CancellationSource } from '../../CancellationSource';

describeThis(__filename, () => {
    const first = new Subject<void>();
    const second = new Subject<void>();

    const source = new CancellationSource(new Cancellation(first), new Cancellation(second));
    const cancellation = source.cancellation;

    let complete = false;
    cancellation.subscribe({
        complete: () => complete = true,
    });

    second.complete();

    it('should be cancelled', () => cancellation.cancelled.should.be.true);
    it('should complete', () => complete.should.be.true);
});
