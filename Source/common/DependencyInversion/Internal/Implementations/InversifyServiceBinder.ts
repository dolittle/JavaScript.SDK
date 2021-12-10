// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Container, interfaces } from 'inversify';

import { Constructor } from '@dolittle/types';

import { AsyncServiceFactory } from '../../AsyncServiceFactory';
import { IBindServiceScope } from '../../IBindServiceScope';
import { IBindServiceTo } from '../../IBindServiceTo';
import { IServiceBinder } from '../../IServiceBinder';
import { ServiceFactory } from '../../ServiceFactory';
import { ServiceIdentifier } from '../../ServiceIdentifier';
import { InversifyServiceProvider } from './InversifyServiceProvider';

/**
 * Represents an implementation of {@link IBindServiceScope} that uses InversifyJS as it's underlying implementation.
 */
class InversifyBindServiceScope extends IBindServiceScope {
    /**
     * Initialises a new instance of the {@link InversifyBindServiceScope} class.
     * @param {interfaces.BindingInSyntax<any>} _bindIn - The binding in syntax to set the scope on.
     */
    constructor(
        private readonly _bindIn: interfaces.BindingInSyntax<any>
    ) {
        super();
    }

    /** @inheritdoc */
    asTransient(): void {
        this._bindIn.inTransientScope();
    }

    /** @inheritdoc */
    asSingleton(): void {
        this._bindIn.inSingletonScope();
    }
}

/**
 * Represents an implementation of {@link IBindServiceTo} that uses InversifyJS as it's underlying implementation.
 * @template T - The service binding type.
 */
class InversifyBindServiceTo<T> extends IBindServiceTo<T> {
    /**
     * Initialises a new instance of the {@link InversifyBindServiceTo} class.
     * @param {interfaces.BindingToSyntax<T>} _bindTo - The binding to syntax to set the resolver on.
     */
    constructor(
        private readonly _bindTo: interfaces.BindingToSyntax<T>,
    ) {
        super();
    }

    /** @inheritdoc */
    toType(type: Constructor<T>): IBindServiceScope {
        const bindInWhenOn = this._bindTo.to(type);
        bindInWhenOn.inTransientScope();
        return new InversifyBindServiceScope(bindInWhenOn);
    }

    /** @inheritdoc */
    toFactory(factory: ServiceFactory<T>): IBindServiceScope {
        const bindInWhenOn = this._bindTo.toDynamicValue((context: interfaces.Context) => {
            const container = new InversifyServiceProvider(context.container as Container);
            return factory(container);
        });
        bindInWhenOn.inTransientScope();
        return new InversifyBindServiceScope(bindInWhenOn);
    }

    /** @inheritdoc */
    toAsyncFactory(factory: AsyncServiceFactory<T>): IBindServiceScope {
        const bindInWhenOn = this._bindTo.toDynamicValue((context: interfaces.Context) => {
            const container = new InversifyServiceProvider(context.container as Container);
            return factory(container);
        });
        bindInWhenOn.inTransientScope();
        return new InversifyBindServiceScope(bindInWhenOn);
    }

    /** @inheritdoc */
    toInstance(instance: T): void {
        this._bindTo.toConstantValue(instance);
    }
}

/**
 * Represents an implementation of {@link IServiceBinder} that uses InversifyJS as it's underlying implementation.
 */
export class InversifyServiceBinder extends IServiceBinder {
    /**
     * Initialises a new instance of the {@link InversifyServiceBinder} class.
     * @param {Container} _container - The InversifyJS child container that contains tenant bindings.
     */
    constructor(
        private readonly _container: Container
    ) {
        super();
    }

    /** @inheritdoc */
    bind<T = any>(service: ServiceIdentifier<T>): IBindServiceTo<T> {
        const bindTo = this._container.bind(service);
        return new InversifyBindServiceTo<T>(bindTo);
    }
}
