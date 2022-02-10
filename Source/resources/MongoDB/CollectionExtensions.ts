// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Collection } from 'mongodb';
import { Constructor } from '@dolittle/types';

import { Abstract, ServiceIdentifier } from '@dolittle/sdk.dependencyinversion';

declare module 'mongodb' {
    namespace Collection {
        /**
         * Gets a {@link ServiceIdentifier} for a read model type to inject a {@link Collection} from the service provider.
         * @param {Constructor} type - The type of the read model.
         * @returns {Abstract} The service identifier to use for injection.
         */
        function forReadModel<TReadModel>(type: Constructor<TReadModel>): Abstract<Collection<TReadModel>>;
    }
}

Collection.forReadModel = function forReadModel<TReadModel>(type: Constructor<TReadModel>): Abstract<Collection<TReadModel>> {
    return `Collection<${type.name}>` as any;
};
