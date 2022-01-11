// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Request, Response, NextFunction, Handler } from 'express';

import { Abstract, Newable, ServiceIdentifier } from '@dolittle/sdk.dependencyinversion';

import { InjectNotCalledWithHandler } from './InjectNotCalledWithHandler';

type InjectedServiceType<T extends ServiceIdentifier<any>> =
    T extends Newable<infer U> ? U :
    T extends Abstract<infer U> ? U :
    any;

type InjectedServiceTypes<T extends ServiceIdentifier<any>[]> = {
    [index in keyof T]: T[index] extends ServiceIdentifier<any> ? InjectedServiceType<T[index]> : any ;
};

type HandlerFunction<T extends ServiceIdentifier<any>[]> =  (request: Request, response: Response, next: NextFunction, ...services: InjectedServiceTypes<T>) => void;

type HandlerGenerator<T extends ServiceIdentifier<any>[]> = (handler: HandlerFunction<T>) => Handler;

/**
 * Creates a handler function generator that will inject services into an Express handler function.
 * @param {ServiceIdentifier[]} services - The services to inject into the handler function.
 * @returns {HandlerGenerator} A function to call with an Express handler function that will get the specified services injected.
 */
export const inject = <T extends ServiceIdentifier<any>[]>(...services: T): HandlerGenerator<T> => {
    return (handler): Handler => {
        if (typeof handler !== 'function') {
            throw new InjectNotCalledWithHandler();
        }

        return function (this: any, req, res, next) {
            const constructedServices = services.map(identifier => req.dolittle.services.get(identifier));
            handler.apply(this, [req, res, next, ...constructedServices] as any);
        };
    };
};
