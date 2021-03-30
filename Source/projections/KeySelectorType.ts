
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Defines the ways of getting the projection key from an event.
 */
export enum KeySelectorType {
    /**
     * Get the key from the event source id metadata.
     */
    EventSourceId = 'eventSourceId',
    /**
     * Get the key from the stream partition metadata.
     */
    PartitionId = 'partitionId',
    /**
     * Get the key from a named property on the event content.
     */
    Property = 'property',
}
