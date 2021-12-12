// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { createMetadataDecorator } from '../Decorators/createMetadataDecorator';
import { DecoratorTarget } from '../Decorators/DecoratorTarget';
import { ServiceIdentifier } from './ServiceIdentifier';
import { SingleInjectionServiceMustBeSpecifiedForConstructorArgument } from './SingleInjectionServiceMustBeSpecifiedForConstructorArgument';
import { WrongNumberOfInjectionServicesSpecifiedForClass } from './WrongNumberOfInjectionServicesSpecifiedForClass';

type Inject = (target: any, propertyKey?: string | symbol, parameterIndex?: PropertyDescriptor | number) => void;

type Service = ServiceIdentifier<any>;

type InjectionDescriptor = {
    readonly service: ServiceIdentifier<any>;
    readonly multiple: boolean;
    readonly index: number;
};

const [decorator, getMeteadata] = createMetadataDecorator<InjectionDescriptor[]>('inject', 'inject', DecoratorTarget.Class | DecoratorTarget.ConstructorParameter);

/**
 * Gets the specified service injection descriptors for a class.
 * @param {NewableFunction} target - The class to get the service injection descriptors for.
 * @returns {InjectionDescriptor[]} The service injection descriptors.
 */
export function getServiceInjectionDescriptors(target: NewableFunction): InjectionDescriptor[] {
    return getMeteadata(target as Constructor<any>) || [];
}

/**
 * Specifies service(s) to inject when constructing an instance of a class using the dependency injection container.
 * This decorator can be used on the class to specify all services, or on each constructor parameter individually.
 * @param {...ServiceIdentifier<any>[]} services - The services to inject.
 * @returns {Inject} The decorator.
 */
export function inject(...services: (Service | [Service])[]): Inject {
    return decorator((target, type, propertyKey, index, value) => {
        const descriptors = value || [];

        switch (target) {
            case DecoratorTarget.Class:
                if (services.length !== type.length) {
                    throw new WrongNumberOfInjectionServicesSpecifiedForClass(type.name, type.length, services.length);
                }

                for (const [index, service] of services.entries()) {
                    if (descriptors[index] !== undefined) {
                        continue;
                    }

                    if (Array.isArray(service)) {
                        descriptors[index] = {
                            index,
                            service: service[0],
                            multiple: true,
                        };
                    } else {
                        descriptors[index] = {
                            index,
                            service,
                            multiple: false,
                        };
                    }
                }
                break;
            case DecoratorTarget.ConstructorParameter:
                if (services.length !== 1) {
                    throw new SingleInjectionServiceMustBeSpecifiedForConstructorArgument(type.name, index as number);
                }

                const service = services[0];
                if (Array.isArray(service)) {
                    descriptors[index as number] = {
                        index: index as number,
                        service: service[0],
                        multiple: true,
                    };
                } else {
                    descriptors[index as number] = {
                        index: index as number,
                        service,
                        multiple: false,
                    };
                }
        }

        return descriptors;
    });
};
