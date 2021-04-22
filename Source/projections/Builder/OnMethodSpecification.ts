// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { TypeOrEventType } from './TypeOrEventType';

export type OnMethodSpecification<TCallback> = [TypeOrEventType, KeySelectorBuilderCallback, TCallback];
