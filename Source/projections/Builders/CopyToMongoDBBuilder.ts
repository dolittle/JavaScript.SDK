// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ComplexValueMap } from '@dolittle/sdk.artifacts';
import { IClientBuildResults } from '@dolittle/sdk.common';
import { Constructor } from '@dolittle/types';

import { ProjectionField } from '../Copies/ProjectionField';
import { CollectionName, CollectionNameLike } from '../Copies/MongoDB/CollectionName';
import { Conversion } from '../Copies/MongoDB/Conversion';
import { MongoDBCopies } from '../Copies/MongoDB/MongoDBCopies';
import { ProjectionId } from '../ProjectionId';
import { ICopyToMongoDBBuilder } from './ICopyToMongoDBBuilder';
import { ReadModelField } from './ReadModelField';

/**
 * Represents an implementation of {@link ICopyToMongoDBBuilder}.
 * @template T The type of the projection read model.
 */
export class CopyToMongoDBBuilder<T> extends ICopyToMongoDBBuilder<T> {
    private _collectionName?: CollectionName;
    private readonly _conversions: Map<ProjectionField, Conversion> = new ComplexValueMap(ProjectionField, field => [field.value], 1);

    /**
     * Initialises a new instance of the {@link CopyToMongoDBBuilder} class.
     * @param {ProjectionId} _projectionId - The unique identifier of the projection to build for.
     * @param {Constructor<T> | T} _readModelTypeOrInstance - The read model type.
     */
    constructor(
        private readonly _projectionId: ProjectionId,
        private readonly _readModelTypeOrInstance: Constructor<T> | T,
    ) {
        super();
        this.inferCollectionNameFromType();
    }

    /** @inheritdoc */
    collection(collectionName: CollectionNameLike): ICopyToMongoDBBuilder<T> {
        this._collectionName = CollectionName.from(collectionName);
        return this;
    }

    /** @inheritdoc */
    convert(field: ReadModelField<T>, to: Conversion): ICopyToMongoDBBuilder<T> {
        this._conversions.set(ProjectionField.from(field), to);
        return this;
    }

    /**
     * Builds the {@link MongoDBCopies} specification configured by this builder.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {MongoDBCopies} The built {@link MongoDBCopies} specification.
     */
    build(results: IClientBuildResults): MongoDBCopies {
        if (this._collectionName === undefined) {
            results.addFailure(`The MongoDB collection name cannot be inferred for projection ${this._projectionId}`, 'Please specify the collection name explicitly');
            return MongoDBCopies.default;
        }

        return new MongoDBCopies(true, this._collectionName, this._conversions);
    }

    private inferCollectionNameFromType() {
        if (this._readModelTypeOrInstance instanceof Function) {
            this._collectionName = CollectionName.from(this._readModelTypeOrInstance.name);
        }
    }
}
