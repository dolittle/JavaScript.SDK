// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when the events and artifacts collections are not the same length
 */
export class EventsAndArtifactsAreNotTheSameSize extends Error {

    /**
     * Initializes an instance of {EventsAndArtifactsAreNotTheSameSize}.
     * @param {number} eventsLength Length of the events collection.
     * @param {number} artifactsLength Length of the artifacts collection.
     */
    constructor(eventsLength: number, artifactsLength: number) {
        super(`Collection of events (${eventsLength}) and collection of artifacts (${artifactsLength}) needs to be exact same length`);
    }
}
