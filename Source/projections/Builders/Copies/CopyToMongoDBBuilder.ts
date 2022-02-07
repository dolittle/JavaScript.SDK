// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults } from '@dolittle/sdk.common';
import { Constructor } from '@dolittle/types';

import { ProjectionProperty } from '../../Copies/ProjectionProperty';
import { CollectionName, CollectionNameLike } from '../../Copies/MongoDB/CollectionName';
import { Conversion } from '../../Copies/MongoDB/Conversion';
import { MongoDBCopies } from '../../Copies/MongoDB/MongoDBCopies';
import { PropertyConversion } from '../../Copies/MongoDB/PropertyConversion';
import { ProjectionId } from '../../ProjectionId';
import { ReadModelField } from './../ReadModelField';
import { ICopyToMongoDBBuilder } from './ICopyToMongoDBBuilder';

type BuilderConversion = { property: string, convertTo: Conversion, children: BuilderConversion[] };

/**
 * Represents an implementation of {@link ICopyToMongoDBBuilder}.
 * @template T The type of the projection read model.
 */
export class CopyToMongoDBBuilder<T> extends ICopyToMongoDBBuilder<T> {
    private _collectionName?: CollectionName;
    private readonly _conversions: Map<string, Conversion> = new Map();

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
    toCollection(collectionName: CollectionNameLike): ICopyToMongoDBBuilder<T> {
        this._collectionName = CollectionName.from(collectionName);
        return this;
    }

    /** @inheritdoc */
    withConversion(field: ReadModelField<T>, to: Conversion): ICopyToMongoDBBuilder<T> {
        this._conversions.set(field, to);
        return this;
    }

    /**
     * Builds the {@link MongoDBCopies} specification configured by this builder.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {MongoDBCopies} The built {@link MongoDBCopies} specification.
     */
    build(results: IClientBuildResults): MongoDBCopies | undefined {
        if (this._collectionName === undefined) {
            results.addFailure(`The MongoDB collection name cannot be inferred for projection ${this._projectionId}`, 'Please specify the collection name explicitly');
            return undefined;
        }

        return new MongoDBCopies(true, this._collectionName, this.buildPropertyConversions());
    }

    private inferCollectionNameFromType() {
        if (this._readModelTypeOrInstance instanceof Function) {
            this._collectionName = CollectionName.from(this._readModelTypeOrInstance.name);
        }
    }

    private buildPropertyConversions(): PropertyConversion[] {
        const conversions: BuilderConversion[] = [];

        for (const [field, conversionType] of this._conversions) {
            const properties = field.split('.');
            const conversion = this.makeConversionWithParents(conversions, properties);
            conversion.convertTo = conversionType;
        }

        return this.convertPropertyConversions(conversions);
    }

    private makeConversionWithParents(conversions: BuilderConversion[], properties: string[]): BuilderConversion {
        const current = properties[0];
        const remainder = properties.slice(1);

        for (const conversion of conversions) {
            if (conversion.property === current) {
                if (remainder.length > 0) {
                    return this.makeConversionWithParents(conversion.children, remainder);
                }

                return conversion;
            }
        }

        const conversion = { property: current, convertTo: Conversion.None, children: [] };
        conversions.push(conversion);
        if (remainder.length > 0) {
            return this.makeConversionWithParents(conversion.children, remainder);
        }

        return conversion;
    }

    private convertPropertyConversions(conversions: BuilderConversion[]): PropertyConversion[] {
        return conversions.map(conversion =>
            new PropertyConversion(
                ProjectionProperty.from(conversion.property),
                conversion.convertTo,
                false,
                ProjectionProperty.from(''),
                this.convertPropertyConversions(conversion.children)
            )
        );
    }
}
