// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IProjectionStore } from './IProjectionStore';
import { Key } from '../Key';
import { CurrentState } from './CurrentState';
import { ScopedProjectionId } from './ScopedProjectionId';
import { IProjectionOf } from './IProjectionOf';

/**
 * Represents an implementation of {@link IProjectionOf}.
 * @template TReadModel The type of the projection read model.
 */
export class ProjectionOf<TReadModel> extends IProjectionOf<TReadModel> {

    /**
     * Initialises a new instance of the {@link ProjectionOf} class.
     * @param {Constructor<TReadModel>} _readModelType - The type of the read model.
     * @param {IProjectionStore} _projectionStore - The projection store to get the projection from.
     * @param {ScopedProjectionId} identifier - The scoped projection identifier.
     */
    constructor(
        private _readModelType: Constructor<TReadModel>,
        private readonly _projectionStore: IProjectionStore,
        readonly identifier: ScopedProjectionId) {
        super();
    }
    /** @inheritdoc */
    get(key: Key, cancellation?: Cancellation): Promise<TReadModel> {
        return this._projectionStore.get(this._readModelType, key, this.identifier.projectionId, this.identifier.scopeId, cancellation);
    }
    /** @inheritdoc */
    getState(key: Key, cancellation?: Cancellation): Promise<CurrentState<TReadModel>> {
        return this._projectionStore.getState(this._readModelType, key, this.identifier.projectionId, this.identifier.scopeId, cancellation);
    }
    /** @inheritdoc */
    getAll(cancellation?: Cancellation): Promise<TReadModel[]> {
        return this._projectionStore.getAll(this._readModelType, this.identifier.projectionId, this.identifier.scopeId, cancellation);
    }

}
