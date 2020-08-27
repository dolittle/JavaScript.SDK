// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

export class FailureId extends ConceptAs<Guid, '@dolittle/sdk.protobuf.FailureId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.protobuf.FailureId');
    }

    static create(id: string | Guid): FailureId {
        return new FailureId(Guid.as(id));
    };
}
