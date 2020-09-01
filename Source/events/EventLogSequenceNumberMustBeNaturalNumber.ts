// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when {EventLogSequenceNumber} is not a natural number.
 *
 * @export
 * @class GenerationMustBeNaturalNumber
 * @extends {Exception}
 */
export class EventLogSequenceNumberMustBeNaturalNumber extends Exception {
    constructor() {
        super('The event log sequence number must be a natural number');
    }
}
