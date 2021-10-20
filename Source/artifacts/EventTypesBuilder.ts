// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { resolve } from 'path';
import * as fs from 'fs';
import { Constructor } from '@dolittle/types';
import { Guid } from '@dolittle/rudiments';
import * as TJS from 'typescript-json-schema';

import { Generation } from './Generation';
import { EventType } from './EventType';
import { IEventTypes } from './IEventTypes';
import { EventTypeId } from './EventTypeId';
import { EventTypesFromDecorators } from './EventTypesFromDecorators';
import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core';

export type EventTypesBuilderCallback = (builder: EventTypesBuilder) => void;

/**
 * Represents a builder for adding associations into {@link IEventTypes} instance.
 */
export class EventTypesBuilder {
    private _associations: [Constructor<any>, EventType][] = [];

    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventType} eventType EventType to associate with.
     */
    associate<T = any>(type: Constructor<T>, eventType: EventType): EventTypesBuilder;
    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventTypeId | Guid | string} identifier Identifier to associate with.
     */
    associate<T = any>(type: Constructor<T>, identifier: EventTypeId | Guid | string): EventTypesBuilder;
    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventTypeId | Guid | string} identifier Identifier to associate with.
     * @param {Generation | number} generation The generation to associate with.
     */
    associate<T = any>(type: Constructor<T>, identifier: EventTypeId | Guid | string, generation: Generation | number): EventTypesBuilder;
    associate<T = any>(type: Constructor<T>, eventTypeOrIdentifier: EventType | EventTypeId | Guid | string, generation?: Generation | number): EventTypesBuilder {
        const eventType = this.getEventType(eventTypeOrIdentifier, generation);
        this._associations.push([type, eventType]);
        return this;
    }

    /**
     * Register the type as an {@link EventType}.
     * @param type The type to register as an {@link EventType}
     */
    register<T = any>(type: Constructor<T>): EventTypesBuilder {
        this.associate(type, EventTypesFromDecorators.eventTypes.getFor(type));
        return this;
    }

    registerForSchema<T = any>(type: Constructor<T>): EventTypesBuilder {
        this.associate(type, EventTypesFromDecorators.eventTypes.getFor(type));
        this.createSchema(type);
        return this;
    }

    getEventType(eventTypeOrIdentifier: EventType | EventTypeId | Guid | string, generation?: Generation | number): EventType {
        return eventTypeOrIdentifier instanceof EventType ?
                            eventTypeOrIdentifier
                            : new EventType(
                                EventTypeId.from(eventTypeOrIdentifier),
                                generation ? Generation.from(generation) : Generation.first);
    }

    createSchema<T = any>(type: Constructor<T>): void {
        const eventType = this.getEventType(EventTypesFromDecorators.eventTypes.getFor(type));

        /*
        const jsonInput = jsonInputForTargetLanguage('schema');
        // type is a Constructor<T>
        const { ...object } = new type();
        // object has properties with undefined values, not valid JSON
        const replacer = (_: any, value: any) =>
            typeof value === 'undefined' ? null : value;
        const json = JSON.stringify(object, replacer);

        jsonInput.addSourceSync({ name: type.name, samples: [json] });

        const inputData = new InputData();
        inputData.addInput(jsonInput);
        quicktype({ inputData, lang: 'schema' }).then(schema => console.log(schema.lines.join('\n')));
        */

        const program = TJS.getProgramFromFiles([resolve(`EventTypes/${type.name}.ts`)]);
        const schema = TJS.generateSchema(program, type.name) as any;
        schema.EventTypeId = eventType.id.toString();
        schema.EventTypeGeneration = eventType.generation.value;
        schema['$id'] = `https://dolittle.io/${type.name}/${eventType.generation.value}`
        schema.title = type.name;
        fs.writeFileSync(`GeneratedJSON/${type.name}.${eventType.generation.value}.json`, JSON.stringify(schema, null, 4));
        console.log('Done writing');
    }

    /**
     * Build an artifacts instance.
     * @returns {IArtifacts} Artifacts to work with.
     */
    addAssociationsInto(eventTypes: IEventTypes): void {
        for (const [type, eventType] of this._associations) {
            eventTypes.associate(type, eventType);
        }
    }
}
