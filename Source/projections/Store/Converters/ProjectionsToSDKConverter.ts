// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ProjectionCurrentState, ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Projections/State_pb';

import { Key } from '../../Key';
import { CurrentState } from '../CurrentState';
import { CurrentStateType } from '../CurrentStateType';
import { IConvertProjectionsToSDK } from './IConvertProjectionsToSDK';
import { UnknownCurrentStateType } from './UnknownCurrentStateType';

/**
 * Represents an implementation of {@link IConvertProjectionsToSDK}.
 */
export class ProjectionsToSDKConverter extends IConvertProjectionsToSDK {

    /** @inheritdoc */
    convert<TProjection = any>(type: Constructor<TProjection> | undefined, state: ProjectionCurrentState): CurrentState<TProjection> {
        const stateType = this.getStateType(state.getType());
        let convertedState = JSON.parse(state.getState());
        const key = Key.from(state.getKey());

        if (type !== undefined) {
            convertedState = Object.assign(new type(), convertedState);
        }

        return new CurrentState<TProjection>(stateType, convertedState, key);
    }

    /** @inheritdoc */
    convertAll<TProjection = any>(type: Constructor<TProjection> | undefined, states: ProjectionCurrentState[]): Map<Key, CurrentState<TProjection>> {
        const stateMap = new Map();
        for (const state of states) {
            const converted = this.convert<TProjection>(type, state);
            stateMap.set(converted.key, converted);
        }
        return stateMap;
    }

    private getStateType(type: ProjectionCurrentStateType) {
        switch (type) {
            case ProjectionCurrentStateType.CREATED_FROM_INITIAL_STATE:
                return CurrentStateType.CreatedFromInitialState;
            case ProjectionCurrentStateType.PERSISTED:
                return CurrentStateType.Persisted;
            default:
                throw new UnknownCurrentStateType(type);
        }
    }
}
