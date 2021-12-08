// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export { EventHandler } from './EventHandler';
export { EventHandlerAlias, EventHandlerAliasLike } from './EventHandlerAlias';
export { EventHandlerId } from './EventHandlerId';
export { EventHandlers } from './EventHandlers';
export { EventHandlerSignature } from './EventHandlerSignature';
export { IEventHandler } from './IEventHandler';
export { IEventHandlers } from './IEventHandlers';
export { MissingEventHandlerForType } from './MissingEventHandlerForType';

export * as internal from './Internal';

export {
    CannotRegisterEventHandlerThatIsNotAClass,
    CouldNotCreateInstanceOfEventHandler,
    EventHandlerBuilder,
    EventHandlerBuilderCallback,
    EventHandlerClassBuilder,
    EventHandlerDecoratedType,
    EventHandlerDecoratedTypes,
    eventHandler,
    EventHandlerMethodsBuilder,
    EventHandlerOptions,
    EventHandlersBuilder,
    EventHandlersBuilderCallback,
    HandlesDecoratedMethod,
    HandlesDecoratedMethods,
    handles,
    IEventHandlerBuilder,
    IEventHandlerMethodsBuilder,
    IEventHandlersBuilder,
} from './Builder';
