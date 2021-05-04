// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { KeySelector, KeySelectorBuilder } from '..';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { OnMethodSpecification } from './OnMethodSpecification';
import { TypeOrEventType } from './TypeOrEventType';

/**
 * Represents a builder for building and getting the inline on() methods for inline projections.
 */
export abstract class OnMethodBuilder<T, TCallback> {
    protected onMethods: OnMethodSpecification<TCallback>[] = [];

    /**
     * Add an on method for handling the event.
     * @template U Type of event.
     * @param {Constructor<U>} type The type of event.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {TCallback<T,U>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on<U>(type: Constructor<U>, keySelectorCallback: KeySelectorBuilderCallback<U>, callback: TCallback): this;
    /**
     * Add an on method for handling the event.
     * @param {EventType} eventType The identifier of the event.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {TCallback} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventType: EventType, keySelectorCallback: KeySelectorBuilderCallback, callback: TCallback): this;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId|Guid|string} eventType The identifier of the event.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {TCallback} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, keySelectorCallback: KeySelectorBuilderCallback, callback: TCallback): this;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId | Guid | string} eventType The identifier of the event.
     * @param {Generation | number} generation The generation of the event type.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {TCallback} method Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, generation: Generation | number, keySelectorCallback: KeySelectorBuilderCallback, callback: TCallback): this;
    on<U>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<U> | Generation | number,
        keySelectorCallbackOrCallback?: KeySelectorBuilderCallback<U> | TCallback,
        maybeCallback?: TCallback): this {

        const typeOrEventType = this.getTypeOrEventTypeFrom(typeOrEventTypeOrId, keySelectorCallbackOrGeneration);
        const keySelectorCallback = typeof keySelectorCallbackOrGeneration === 'function'
            ? keySelectorCallbackOrGeneration
            : keySelectorCallbackOrCallback as KeySelectorBuilderCallback<U>;
        const callback = maybeCallback || keySelectorCallbackOrCallback as TCallback;

        this.onMethods.push([typeOrEventType, keySelectorCallback, callback]);

        return this;
    }

    protected tryAddOnMethods(
        eventTypes: IEventTypes,
        events: EventTypeMap<[TCallback, KeySelector]>): boolean {
        let allMethodsValid = true;
        const keySelectorBuilder = new KeySelectorBuilder();
        for (const [typeOrEventTypeOrId, keySelectorBuilderCallback, method] of this.onMethods) {
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (events.has(eventType)) {
                allMethodsValid = false;
            }
            events.set(eventType, [method, keySelectorBuilderCallback(keySelectorBuilder)]);
        }
        return allMethodsValid;
    }

    private getTypeOrEventTypeFrom<U>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<U> | Generation | number): Constructor<T> | EventType {

        if (typeof typeOrEventTypeOrId === 'function') {
            return typeOrEventTypeOrId;
        }

        if (typeOrEventTypeOrId instanceof EventType) {
            return typeOrEventTypeOrId;
        }

        const eventTypeId = typeOrEventTypeOrId;
        const eventTypeGeneration = typeof keySelectorCallbackOrGeneration === 'function' ? Generation.first : keySelectorCallbackOrGeneration;

        return new EventType(EventTypeId.from(eventTypeId), Generation.from(eventTypeGeneration));
    }

    private getEventType(typeOrEventTypeOrId: TypeOrEventType, eventTypes: IEventTypes): EventType {
        let eventType: EventType;
        if (typeOrEventTypeOrId instanceof EventType) {
            eventType = typeOrEventTypeOrId;
        } else {
            eventType = eventTypes.getFor(typeOrEventTypeOrId);
        }
        return eventType;
    }
}
