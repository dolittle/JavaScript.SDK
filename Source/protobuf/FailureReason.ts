// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

export class FailureReason extends ConceptAs<string, '@dolittle/sdk.protobuf.FailureReason'> {
    constructor(reason: string) {
        super(reason, '@dolittle/sdk.protobuf.FailureReason');
    }

    static create(reason: string): FailureReason {
        return new FailureReason(reason);
    }
}
