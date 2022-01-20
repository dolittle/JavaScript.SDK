// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents a decorator function to apply.
 */
export type Decorator = (target: any, propertyKey?: string | symbol, parameterIndex?: PropertyDescriptor | number) => void;
