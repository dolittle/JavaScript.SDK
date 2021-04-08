// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionCurrentState, ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Events.Processing/Projections_pb';
import { CurrentState } from '..';
import { CurrentStateType } from '../CurrentStateType';
import { IConvertProjectionsToSDK } from './IConvertProjectionsToSDK';
import { UnknownCurrentStateType } from './UnknownCurrentStateType';

export class ProjectionsToSDKConverter implements IConvertProjectionsToSDK {

    /** @inheritdoc */
    convert<TProjection>(state: ProjectionCurrentState): CurrentState<TProjection> {
        const type = this.getStateType(state.getType());
        const convertedState = JSON.parse(state.getState());
        return new CurrentState<TProjection>(type, convertedState);
    }

    /** @inheritdoc */
    convertAll<TProjection>(stateArray: ProjectionCurrentState[]): CurrentState<TProjection>[] {
        return stateArray.map(state => this.convert<TProjection>(state));
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
