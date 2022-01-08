// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { NestedMap } from '../../NestedMap';

export type keys = [string, number, boolean];
export type value = object;

export type map = NestedMap<keys, value>;
