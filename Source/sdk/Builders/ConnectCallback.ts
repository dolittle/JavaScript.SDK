// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IDolittleClient } from '../';
import { IConfigurationBuilder } from './IConfigurationBuilder';

/**
 * The callback used to configure the {@link IDolittleClient} when connecting.
 */
export type ConnectCallback = (builder: IConfigurationBuilder) => void;
