// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IServiceBinder } from './IServiceBinder';

/**
 * Defines a callback that will be called to provide service bindings.
 */
export type ServiceBindingCallback = (binder: IServiceBinder) => void;
