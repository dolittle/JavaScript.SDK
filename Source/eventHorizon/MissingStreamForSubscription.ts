// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MicroserviceId } from '@dolittle/sdk.execution';
import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when a subscription does not have the stream configured.
 */
export class MissingStreamForSubscription extends Exception {

    /**
     * Initializes a new instance of {@link MissingStreamForSubscription}
     * @param {MicroserviceId} microservice The microservice the subscription is for.
     */
    constructor(microservice: MicroserviceId) {
        super(`Missing stream for subscription for microservice with Id '${microservice}'`);
    }
}
