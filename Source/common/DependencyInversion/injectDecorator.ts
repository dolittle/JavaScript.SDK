// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { ServiceIdentifier } from './ServiceIdentifier';

const INJECTION_DESCRIPTORS_PROPERTY = '@dolittle/sdk.common.InjectionDescriptors';

type InjectionDescriptor = {
    readonly service: ServiceIdentifier<any>;
    readonly multiple: boolean;
    readonly index: number;
};

/**
 * Whatever.
 * @param {Constructor<any>} target - The things.
 * @returns {InjectionDescriptor[]} The descriptors.
 */
export function getServiceInjectionDescriptors(target: NewableFunction): InjectionDescriptor[] {
    return (target as any)[INJECTION_DESCRIPTORS_PROPERTY] || [];
}

function setServiceInjectionDescriptors(target: Constructor<any>, descriptors: InjectionDescriptor[]) {
    if (Object.prototype.hasOwnProperty.call(target, INJECTION_DESCRIPTORS_PROPERTY)) {
        (target as any)[INJECTION_DESCRIPTORS_PROPERTY] = descriptors;
    } else {
        Object.defineProperty(target, INJECTION_DESCRIPTORS_PROPERTY, {
            configurable: false,
            enumerable: false,
            value: descriptors,
            writable: true,
        });
    }
}

type Service = ServiceIdentifier<any>;
type Inject = (target: any, propertyKey?: string | symbol, parameterIndex?: number) => void;

/**
 * Injects services.
 * @param {...ServiceIdentifier<any>[]} services - The services to inject.
 * @returns {any} Whatever.
 */
export function inject(...services: (Service | [Service])[]): Inject {
    return function (target: any, propertyKey?: string | symbol, parameterIndex?: number) {
        const descriptors = getServiceInjectionDescriptors(target);

        if (typeof parameterIndex === 'number') {
            const service = services[0];
            if (Array.isArray(service)) {
                descriptors[parameterIndex] = {
                    service: service[0],
                    multiple: true,
                    index: parameterIndex,
                };
            } else {
                descriptors[parameterIndex] = {
                    service,
                    multiple: false,
                    index: parameterIndex,
                };
            }
        } else {
            for (const [parameterIndex, service] of services.entries()) {
                if (descriptors[parameterIndex] === undefined) {
                    if (Array.isArray(service)) {
                        descriptors[parameterIndex] = {
                            service: service[0],
                            multiple: true,
                            index: parameterIndex,
                        };
                    } else {
                        descriptors[parameterIndex] = {
                            service,
                            multiple: false,
                            index: parameterIndex,
                        };
                    }
                }
            }
        }

        setServiceInjectionDescriptors(target, descriptors);
    };
};
