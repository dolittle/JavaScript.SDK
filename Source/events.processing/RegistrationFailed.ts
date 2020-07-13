// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Failure } from '@dolittle/sdk.protobuf';

/**
 * Exception that gets thrown when a failure occurs during registration of an event processor.
 */
export class RegistrationFailed extends Error {

    /**
     * Initializes a new instance of {@link DidNotReceRegistrationFailediveConnectResponse}.
     */
    constructor(kind: string, identifier: Guid | string, failure: Failure) {
        super(`Failure occurred during registration of ${kind} ${identifier}. ${failure.reason}`);
    }
}
