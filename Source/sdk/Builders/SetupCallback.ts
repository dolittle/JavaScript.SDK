// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SetupBuilder } from './SetupBuilder';

/**
 * The callback used to set up a {@link IDolittleClient}.
 */
export type SetupCallback = (builder: SetupBuilder) => void;
