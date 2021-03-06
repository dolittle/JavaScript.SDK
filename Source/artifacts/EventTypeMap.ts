// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';
import { Generation } from './Generation';
/**
 * Represents a map for mapping an event type to a given type and provide.
 * @template TType Type to map to.
 */
export class EventTypeMap<T> implements Map<EventType, T> {
    private _generationsById: Map<string, Map<number, T>>;

    /**
     * Initializes a new instance of {@link EventTypeMap}
     */
    constructor() {
        this._generationsById = new Map<string, Map<number, T>>();
    }
    /** @inheritdoc */
    [Symbol.toStringTag] = 'EvenTypeMap';

    /**
     * Gets the size of the map.
     */
    get size(): number {
        let size = 0;
        for (const generations of this._generationsById.values()) {
            size += generations.size;
        }
        return size;
    }

    /** @inheritdoc */
    has(key: EventType): boolean {
        const eventTypeId = key.id.toString();
        return this._generationsById.get(eventTypeId)?.has(key.generation.value) ?? false;
    }

    /** @inheritdoc */
    get(key: EventType): T | undefined {
        const eventTypeId = key.id.toString();
        return this._generationsById.get(eventTypeId)?.get(key.generation.value);
    }

    /** @inheritdoc */
    set(key: EventType, value: T): this {
        const eventTypeId = key.id.toString();

        let generations: Map<number, T>;
        if (this._generationsById.has(eventTypeId)) {
            generations = this._generationsById.get(eventTypeId)!;
        } else {
            generations = new Map<number, T>();
            this._generationsById.set(eventTypeId, generations);
        }
        generations.set(key.generation.value, value);

        return this;
    }

    /** @inheritdoc */
    clear(): void {
        this._generationsById.clear();
    }

    /** @inheritdoc */
    delete(key: EventType): boolean {
        const eventTypeId = key.id.toString();

        const generations = this._generationsById.get(eventTypeId);
        if (generations) {
            const deleted = generations.delete(key.generation.value);
            if (generations.size === 0) {
                this._generationsById.delete(eventTypeId);
            }
            return deleted;
        }
        return false;
    }

    /** @inheritdoc */
    *[Symbol.iterator](): IterableIterator<[EventType, T]> {
        for (const [eventTypeId, generations] of this._generationsById) {
            for (const [generation, entry] of generations) {
                const eventType = new EventType(EventTypeId.from(eventTypeId), Generation.from(generation));
                yield [eventType, entry];
            }
        }
    }

    /** @inheritdoc */
    entries(): IterableIterator<[EventType, T]> {
        return this[Symbol.iterator]();
    }

    /** @inheritdoc */
    *keys(): IterableIterator<EventType> {
        for (const [eventType, _] of this.entries()) {
            yield eventType;
        }
    }

    /** @inheritdoc */
    *values(): IterableIterator<T> {
        for (const [_, type] of this.entries()) {
            yield type;
        }
    }

    /** @inheritdoc */
    forEach(callbackfn: (value: T, key: EventType, map: Map<EventType, T>) => void, thisArg?: any): void {
        for (const [eventType, type] of this.entries()) {
            callbackfn.call(thisArg, type, eventType, this);
        }
    }
}
