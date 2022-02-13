// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { IClientBuildResults } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeIdLike, EventTypeMap,  IEventTypes } from '@dolittle/sdk.events';

import { DeleteReadModelInstance } from '../DeleteReadModelInstance';
import { IProjection } from '../IProjection';
import { KeySelector } from '../KeySelector';
import { Projection } from '../Projection';
import { ProjectionCallback } from '../ProjectionCallback';
import { getConvertToMongoDBDecoratedProperties } from './Copies/convertToMongoDBDecorator';
import { getDecoratedCopyProjectionToMongoDB, isDecoratedCopyProjectionToMongoDB } from './Copies/copyProjectionToMongoDBDecorator';
import { ProjectionCopies } from '../Copies/ProjectionCopies';
import { ProjectionProperty } from '../Copies/ProjectionProperty';
import { MongoDBCopies } from '../Copies/MongoDB/MongoDBCopies';
import { PropertyConversion } from '../Copies/MongoDB/PropertyConversion';
import { OnDecoratedProjectionMethod } from './OnDecoratedProjectionMethod';
import { getOnDecoratedMethods } from './onDecorator';
import { ProjectionDecoratedType } from './ProjectionDecoratedType';

/**
 * Represents a builder for building a projection from a class.
 * @template T The type of the projection class.
 */
export class ProjectionClassBuilder<T> implements IEquatable {
    /**
     * Initialises a new instance of the {@link FailureReason} class.
     * @param {ProjectionDecoratedType} type - The decorated projection type of the class.
     */
    constructor(readonly type: ProjectionDecoratedType) {
    }

    /** @inheritdoc */
    equals(other: any): boolean {
        if (this === other) return true;

        if (other instanceof ProjectionClassBuilder) {
            return this.type === other.type;
        }

        return false;
    }

    /**
     * Builds the projection.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IProjection | undefined} The built projection if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IProjection<T> | undefined {
        results.addInformation(`Building projection ${this.type.projectionId} processing events in scope ${this.type.scopeId} from type ${this.type.type.name}`);

        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (!this.tryAddAllOnMethods(events, this.type.type, eventTypes)) {
            results.addFailure(`Could not create projection ${this.type.type.name} because it contains invalid projection methods`, 'Maybe you have multiple @on methods handling the same event type?');
            return;
        }

        const copies = this.buildCopies(results);
        if (copies === undefined) {
            return undefined;
        }

        return new Projection<T>(this.type.projectionId, this.type.type, this.type.scopeId, events, copies, this.type.alias);
    }

    private tryAddAllOnMethods(events: EventTypeMap<[ProjectionCallback<T>, KeySelector]>, type: Constructor<any>, eventTypes: IEventTypes): boolean {
        let allMethodsValid = true;
        const methods = getOnDecoratedMethods(type);
        if (methods.length < 1) {
            allMethodsValid = false;
            return allMethodsValid;
        }

        for (const method of methods) {
            const [hasEventType, eventType] = this.tryGetEventTypeFromMethod(method, eventTypes);

            if (!hasEventType) {
                allMethodsValid = false;
                continue;
            }

            const onMethod = this.createOnMethod(method);
            const keySelector = method.keySelector;

            if (events.has(eventType!)) {
                allMethodsValid = false;
                continue;
            }
            events.set(eventType!, [onMethod, keySelector]);
        }
        return allMethodsValid;
    }

    private tryGetEventTypeFromMethod(method: OnDecoratedProjectionMethod, eventTypes: IEventTypes): [boolean, EventType | undefined] {
        if (this.eventTypeIsId(method.eventTypeOrId)) {
            return [
                true,
                new EventType(
                    EventTypeId.from(method.eventTypeOrId),
                    method.generation ? Generation.from(method.generation) : Generation.first)
            ];
        } else if (!eventTypes.hasFor(method.eventTypeOrId)) {
            return [false, undefined];
        } else {
            return [true, eventTypes.getFor(method.eventTypeOrId)];
        }
    }

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeIdLike): eventTypeOrId is EventTypeIdLike {
        return eventTypeOrId instanceof EventTypeId || eventTypeOrId instanceof Guid || typeof eventTypeOrId === 'string';
    }

    private createOnMethod(method: OnDecoratedProjectionMethod): ProjectionCallback<T> {
        return async (instance, event, projectionContext) => {
            const result = await method.method.call(instance, event, projectionContext);
            if (result instanceof DeleteReadModelInstance) {
                return result;
            }
            return instance;
        };
    }

    private buildCopies(results: IClientBuildResults): ProjectionCopies | undefined {
        const mongoDBCopies = this.buildMongoDBCopies(results);

        if (mongoDBCopies === undefined) {
            return undefined;
        }

        return new ProjectionCopies(
            mongoDBCopies,
        );
    }

    private buildMongoDBCopies(results: IClientBuildResults): MongoDBCopies | undefined {
        if (!isDecoratedCopyProjectionToMongoDB(this.type.type)) {
            return MongoDBCopies.default;
        }

        const decoratedType = getDecoratedCopyProjectionToMongoDB(this.type.type);
        const collection = decoratedType.collection;

        const [collectionNameIsValid, collectionNameValidationError] = collection.isValid();
        if (!collectionNameIsValid) {
            results.addFailure(`Cannot create MongoDB read model copies. ${collectionNameValidationError?.message}`);
            return undefined;
        }

        const decoratedProperties = getConvertToMongoDBDecoratedProperties(this.type.type);
        const conversions = decoratedProperties.map(property =>
            new PropertyConversion(
                property.property,
                property.conversion,
                false,
                ProjectionProperty.from(''),
                []
            )
        );

        return new MongoDBCopies(true, collection, conversions);
    }
}
