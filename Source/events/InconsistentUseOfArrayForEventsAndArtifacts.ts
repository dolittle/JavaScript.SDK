// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when there is an inconsistent use of types between events and artifacts.
 */
export class InconsistentUseOfArrayForEventsAndArtifacts extends Error {

    /**
     * Initializes a new instance of {InconsistentUseOfArrayForEventsAndArtifacts}
     * @param {*} events Event or events.
     * @param {*} artifacts Artifact or artifacts
     */
    constructor(events: any, artifacts: any) {
        super(`Was given '${events}' as event(s) and '${artifacts}' as artifact(s) they both has to either be single or array. As an array, they need to be of same length and order.`);
    }
}
