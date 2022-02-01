// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ICopyToMongoDBBuilder } from './ICopyToMongoDBBuilder';

/**
 * Defines the callback signature used for configuring read model copies to a MongoDB collection.
 * @template T The type of the projection read model.
 */
export type CopyToMongoDBCallback<T> = (builder: ICopyToMongoDBBuilder<T>) => void;
