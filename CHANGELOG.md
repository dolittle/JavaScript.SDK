# [24.0.0] - 2022-3-25 [PR: #129](https://github.com/dolittle/JavaScript.SDK/pull/129)
## Summary

Use the newest major version of the Dolittle Grpc Contracts to be compatible with version 8 of the Runtime

### Changed

- Use the newest major version 7 of the Dolittle Grpc Contracts


# [23.2.3] - 2022-3-23 [PR: #127](https://github.com/dolittle/JavaScript.SDK/pull/127)
## Summary

Fixes a bug in the AggregateRoot where an on-method would be called (while applying events) with the value of a property named `content` on the event (usually `undefined`) - not the actual event. 

### Fixed

- When on-methods in Aggregate Roots where called while applying events, the wrong object was passed in as the event. Which in most cases would mean they were called with `undefined`.


# [23.2.2] - 2022-3-9 [PR: #125](https://github.com/dolittle/JavaScript.SDK/pull/125)
## Summary

Upgrade the grpc versions

### Changed

- Changed the grpc and contracts versions


# [23.2.1] - 2022-3-8 [PR: #124](https://github.com/dolittle/JavaScript.SDK/pull/124)
## Summary

Fixes a bug that resulted in wrong retry timings when processing of events failed.

### Fixed

- The event processing retry time should now increment in the correct interval


# [23.2.0] - 2022-2-14 [PR: #123](https://github.com/dolittle/JavaScript.SDK/pull/123)
## Summary

Adds aliases to Projections, in the same way we have for Event Handlers. They default to the name of the read model class, and can be overridden with a decorator option or a builder method.

### Added

- An optional `alias` property on the `@projection` decorator options.
- A `.withAlias` method on the Projection builder API.


# [23.1.0] - 2022-2-11 [PR: #122](https://github.com/dolittle/JavaScript.SDK/pull/122)
## Summary

Adds two new event key selectors to projections, `StaticKey` and `KeyFromEventOccurred`

### Added

- `staticKey` event key selector attribute for projection On-methods that sets a constant, static, key as the key of the read model
- `keyFromEventOccurred` event key selector for projection On-methods that uses the event occurred metadata as the key for the projection read models formatted as the string given to the attribute. We currently support these formats:
    - yyyy-MM-dd
    - yyyy-MM
    - yyyy
    - HH:mm:ss
    - hh:mm:ss
    - HH:mm
    - hh:mm
    - HH
    - hh
    - yyyy-MM-dd HH:mm:ss
    - And the above in different orderings


# [23.0.0] - 2022-2-10 [PR: #121](https://github.com/dolittle/JavaScript.SDK/pull/121)
## Summary

The Dolittle Client now fetches resources while establishing the initial connection so that we could make the resources interfaces synchronous, simplifying the usage and allowing us to bind the MongoDB types in the DI container. Collections that are created by copying Projection read models are bound in the tenant scoped DI containers. The `.connected` property on the client has been changed to a `Promise` so you can await the connection asynchronously. The old boolean property has been moved to `.isConnected`. 

### Added

- A new property `IDolittleClient.connected` that returns a `Promise<void>` that is resolved when the client is successfully connected to a Runtime.
- A binding for the MongoDB `Db` type in the tenant scoped DI containers. 
- Bindings for MongoDB `Collection<TReadModel>` types in the tenant scoped DI containers for Projections with read models copied to MongoDB. These can be resolved using the service identifier provided by the extension method `Collection.forReadModel(TReadModel)`.

### Changed

- The `IMongoDBResource.getDatabase()` returns an `Db` instead of a `Promise<Db>` since the configuration is retrieved while connecting to the Runtime.
- The `IDolittleClient.connected` boolean property has been renamed to `.isConnected`.


# [22.2.0] - 2022-2-9 [PR: #114](https://github.com/dolittle/JavaScript.SDK/pull/114)
## Summary

Introduces APIs to configure secondary storage for Projection read models for querying, as introduced in https://github.com/dolittle/Runtime/pull/614 (requires Runtime v7.6.0). These changes makes it easy to query Projection read models by specifying that you want copies stored in MongoDB, and then use an `IMongoCollection<>` for that Projection as any other MongoDB collection. The Projection still operates normally and can be fetched from the Projection Store. Modifications of documents in the copied collections will affect the original Projection processing, but should be avoided as it could cause unexpected behaviour. The collections are automatically created and dropped as needed by the Runtime when Projections are created or changed.

There is currently no mechanism for detecting multiple projections copied to the same collection, so be aware of possible strange behaviour if you have multiple Projections with the same name.

### Added

- The `@copyToMongoDB(...)` decorator that enables read model copies for a Projection class to MongoDB. The default collection name is the same as the class name. The decorator accepts an argument to override the collection name.
- The `@convertToMongoDB(conversion)` decorator to specify a BSON conversion to apply when copying the Projection read model to a MongoDB collection.
- A `.copyToMongoDB(...)` method on the Projection builder for enabling read model copies for Projections created using the builder API. This method accepts a callback that you can use to set the collection name and conversions for the read model copies.
- Extension method `Db.collection(readModelType, settings?)` to get a collection using the name of the read model or the collection specified in the `@copyToMongoDB(collection)` decorator.


# [22.1.0] - 2022-1-28 [PR: #113](https://github.com/dolittle/JavaScript.SDK/pull/113)
## Summary

Adds the possibility to take upon a specific projection read model as a dependency and use that to get the projection states for that read model type.

### Added

- `IProjectionOf<TReadModel>` that acts as a minimal `IProjectionStore` for a particular projection type.
- `IProjectionStore.of<TReadModel>(...)` method with overloads for sending in `ProjectionId` and `ScopeId` to create instances of `IProjectionOf<TReadModel>`
- `IProjectionOf<TReadModel>` is registered in the tenant scoped service providers for all types with the `[Projection]` attribute, or projections created in the `.WithProjections(...)` builder. So they can be injected in controllers etc.
- `IProjectionOf.for(type)` that returns a service identifier that can be used in `@inject(...)` decorators.
- `IAggregateOf.for(type)` that returns a service identifier that can be used in `@inject(...)` decorators.


# [22.0.0] - 2022-1-25 [PR: #112](https://github.com/dolittle/JavaScript.SDK/pull/112)
## Summary

Simplifies the `IProjectionStore` apis by removing the `CurrentState<>` wrapper around the returned types from `get(...)` and `getAll(...)` methods, and returns an array instead of a `Map` when getting multiple read models. And introduces a new `getState(...)` method that has the wrapped types for when it is interesting.

### Added

- `IProjectionStore.getState(...)` method that keeps the syntax of the previous `.get(...)` method.

### Changed

- `IProjectionStore.get(...)` returns the specified type or `any` instead of wrapping with `CurrentState<>`
- `IProjectionStore.getAll(...)` returns an array of the specified type or `any` instead of a `Map` of keys to `CurrentState<>`.


# [21.0.1] - 2022-1-24 [PR: #111](https://github.com/dolittle/JavaScript.SDK/pull/111)
## Summary

Uses the new batch streaming method to get all Projection states from the Runtime. This fixes an issue where a large amount of Projection states caused the gRPC client in the SDK to throw an exception because the response message was too big. Also fixed some gRPC method internals that we haven't used before (server streaming calls), and fixed the references to JavaScript.Fundamentals pre-release packages.

### Fixed

- The `IProjectionStore.getAll` method now uses the new gRPC method that streams results back in batches to fix the issue of too large gRPC messages when a large amount of projection read models have been created.


# [21.0.0] - 2022-1-20 [PR: #88](https://github.com/dolittle/JavaScript.SDK/pull/88)
## Summary

Major improvements to the Dolittle Client, in how it connects to the Runtime, configuration, setup an integration with ExpressJS. Combined these changes aim to make the SDK easier to setup and configure, and to make it easier to detect when incompatible versions are used.

### Added

- Support for Dependency Injection using Inversify internally, with support for TypeDi and TSyinge, also supporting tenant-specific bindings.
- The DolittleClient and tenant specific resources (IEventStore, IAggregates, IProjections, ...) are bound in the service provider used and exposed by the client. They can be used in for example Event Handlers, or with the ExpressJS integration in request handlers.
- Express integration through .use(dolittle()) on `express` , starts the DolittleClient and sets it up with default configurations if not explicitly provided, starts a middleware that makes the DolittleClient resources available on the request based on the `Tenant-ID` header (provided by the platform). See the ExpressJS sample.
- By default auto discover all aggregate roots, event types, event handlers, projections and embeddings 
- When starting up a DolittleClien, it now performs an initial handshake with the configured Runtime to determine that the version of the SDK and the Runtime are compatible, and retrieves the MicroserviceId to configure its executions context (provided by the platform).

### Changed

- Building a DolittleClient is two steps, namely `.setup()` and `.connect()`, to make integrations easier. 
- The configured Tenants are retrieved during the first connection to the Runtime, so the `.tenants` on the DolittleClient Is no longer an asynchronous call.
- The builder APIs exposed in the `.setup(...)` call have been changed so they are all called `.register()` or `.create()` and removed the `.build()` methods
 - The `aggregateOf()` methods on the client have been changed to an `Aggregates` property that behaves like the other tenant specific resources.

### Fixed

- The SDK de-duplicates registered types and processors (Event Handlers, ...) so that you can use both automatic discovery and manual registration.

### Removed

- `.build()` methods no longer exposed on the builder API


# [20.0.0] - 2021-11-18 [PR: #73](https://github.com/dolittle/JavaScript.SDK/pull/73)
## Summary

Adds the ability to get the configured tenants, and a MongoDB database per tenant from the Runtime through the client. Also renames the Client to DolittleClient, and introduces interfaces many places to simplify creation of mocks for testing purposes.

### Added

- ITenants tenants property on the client for getting all tenants from the Runtime
- IResourcesBuilder resources property on the client for getting resources for a specific tenant. Currently supports MongoDB. 
- IDolittleClient interface that DolittleClient implements, and interfaces for other classes in the client structure

### Changed

- Client renamed to DolittleClient
- ClientBuilder renamed to DolittleClientBuilder

### Fixed

- A bug in the implementation of `Cancellation` and `CancellationSource` where `instanceof Cancellation` does not work.
- A small typo in the exception thrown when the client cannot connect to the configured Runtime.


# [19.0.1] - 2021-11-9 [PR: #71](https://github.com/dolittle/JavaScript.SDK/pull/71)
## Summary

Reducing the development foot print by using a more streamlined and slim version of our @doluttle/typescript.build package.  The only controversial thing here is targeting ES2017 instead of ES2015, I don't think that this change is strictly necessary in order for this PR to work, but most it will reduce the size of the output and all modern browsers should support it.

### Added

- Extension methods for converting guids to and from protobuf

### Changed

- Target ES2017 instead of ES2015
- Upgrade to newest version of @dolittle/typescript.build
- Change package.json scripts to be more streamlined and using mocha, eslint and tsc for testing, linting and compiling the code instead of using gulp
- Changed specs to use @dolittle/typescript.testing describeThis function that generates a more useful output when running the tests
- Apply lint fix to fix lint errors

### Fixed

- Fixed some specs in @dolittle/sdk.protobuf
- Fixes the wallaby configuration


# [19.0.0] - 2021-11-5 [PR: #67](https://github.com/dolittle/JavaScript.SDK/pull/67)
## Summary

Fixes a problem with aggregates so that it now can be used in an async way. Registration of event types and aggregate roots to the Runtime.


### Added

- Registration of alias for event types through the attribute or builder
- Registration of alias fro aggregate roots through the attribute
- Default alias registration for event type classes and aggregate root classes. Default is the name of the class

### Changed

- Log Level for registered Event Processors to Information
- The Getting Started, Aggregates, Projections and Embeddings tutorials updated to reflect new features of the SDK

### Fixed

- A problem where you couldn't use an aggregate root in an asynchronous manner
- Calling `apply()` in an aggregate root now invokes the corresponding `on()` method

### Removed
- `EventSourceId.unspecified`. This value was used internally, but should not really ever be used - so it is now gone.
- `IEventStore.fetchForAggregateSync()`. No longer needed after fixing the aggregate root implementation. Relied on a NodeJS hack that we weren't really happy with.


# [18.1.0] - 2021-10-25 [PR: #66](https://github.com/dolittle/JavaScript.SDK/pull/66)
## Summary

Updates Grpc, protobuf and contracts dependency versions and adds the possibility to register event handlers with aliases that is useful for when using the Dolittle CLI.

### Added

- `withAlias` build step on the fluent builder for event handlers.
- `alias` argument on the `eventHandler` decorator
- Event handler classes without the `alias` argument gets registered with an alias that is the class name.

### Changed

- Updated Grpc, protobuf and contracts dependency versions


# [18.0.0] - 2021-10-13 [PR: #61](https://github.com/dolittle/JavaScript.SDK/pull/61)
## Summary

Implementing the changes introduced by https://github.com/dolittle/Contracts/pull/53. Allowing EventSourceID and PartitionID to be strings, to more easily integrate with events from existing systems.

Also fixed a small bug when returning an array of events from an Embedding Update/Delete method.

This is considered a breaking change because it requires a Runtime compatible with Contracts v6 to function.

### Added

- EventSourceID is now a string instead of a Guid.
- PartitionID is now also a string instead of a Guid.

### Fixed

- Aligned names of event type fields throughout messages from Contracts v6.0.0
- Allow Embedding Update/Delete method to return an array of events.


# [17.0.3] - 2021-9-30 [PR: #60](https://github.com/dolittle/JavaScript.SDK/pull/60)
## Summary

Encountered an inconvenience when consuming the SDK where the type of a Commtted Event Result's occurred property was of an `any` type unless you had the @types/luxon package installed locally in your project. We should instead just have that package as a normal dependency so that typescript consumers of the SDK does not need to install that package themselves.

### Changed

- @types/luxon package as a non-dev dependency


# [17.0.2] - 2021-9-29 [PR: #59](https://github.com/dolittle/JavaScript.SDK/pull/59)
## Summary

Fixes a bug where `async` Event Handler methods were not properly awaited (and thus also exceptions ignored) if they did any async work. In the process, also found a bug related to _delete results_ returned from async Projection and Embedding methods, that would not be handled correctly.

### Fixed

- Return the `Promise` from Event Handler methods in the EventHandlerClassBuilder to handle async methods properly.
- Await results from Projection/Embedding `on()` methods, so that async _delete results_ are handled properly.


# [17.0.1] - 2021-7-23 [PR: #58](https://github.com/dolittle/JavaScript.SDK/pull/58)
## Summary

Adding "sdk.embeddings" to the "sdk" package.json.

### Fixed

- Adding sdk.embeddings to sdk, making the npm package include the new embeddings work


# [17.0.0] - 2021-7-20 [PR: #55](https://github.com/dolittle/JavaScript.SDK/pull/55)
## Summary

Renames the `compare` and `remove` builder methods and decorators to `resolveUpdateToEvents` and `resolveDeletionToEvents`, so that the API is consistent with the C# SDK. The new names also are more descriptive of their new function.

Also updated the JS sample code to match the new [embeddings tutorial](https://dolittle.io/docs/tutorials/embeddings/).

### Added
- A new exception `CouldNotResolveUpdateToEvents`, which can be used as the default exception for when the `resolveUpdateToEvents` couldn't resolve into any events
- A new exception `CouldNotResolveDeletionToEvents`, which can be used as the default exception for when the `resolveUpdateToEvents` couldn't resolve into any events

### Changed
- `compare` method and decorator became `resolveUpdateToEvents`
- `remove` method and decorator became `resolveDeletionToEvents`
- `resolveUpdateToEvents` and `resolveDeletionToEvents` now has to return an `Object | Object[]` instead of `any | any[]`. This is to enforce the methods always returning one or many events


# [16.0.0] - 2021-7-1 [PR: #54](https://github.com/dolittle/JavaScript.SDK/pull/54)
## Summary

Renames the call to delete an embedding from`embeddings.delete()` to `embeddings.remove()`, so that it's consistent with the `@remove()` decorator and inline builder naming.

Originally the decorators were also supposed to be called `@delete()`, but as `delete` is a reserved keyword in JS, we changed them to `@remove()`, but didn't think of changing the deletion call too to match. Internally the processor and contracts still call it `delete`, this change only affects the outside facing API.

### Changed

- Change the `embeddings.delete()` call to `embeddings.remove()`.


# [15.0.0] - 2021-6-29 [PR: #47](https://github.com/dolittle/JavaScript.SDK/pull/47)
## Summary

Adds a new feature, Embeddings! They are similar to Projections, but they are meant to be used to event source changes coming from an external system. Check the [sample](https://github.com/dolittle/JavaScript.SDK/tree/master/Samples/Tutorials/Embeddings) for an example.

Also changes the behavior of the pinging system to be more reliable and to be ready to receive pings immediately upon connecting to the Runtime. This is to deal with a bug that was causing connections between the SDK and the Runtime to be dropped. This is a **breaking behavioral change** and it's related to the [release of version `v6`](https://github.com/dolittle/Runtime/pull/532) of the Runtime. You have to update to version `v6*` of the Runtime, older versions wont work with this release of the SDK. We've added a [compatibility table](https://dolittle.io/docs/reference/runtime/compatibility) for checking the supported versions.

### Added

- Embeddings! You can use them inline with the `withEmbeddings()` method, or with the `@embedding`, `@compare`, `@delete` and `@on` decorators on classes. The embeddings can be updated, deleted and fetched from the `client.embeddings` property.

### Changed

- The reverse call connections are now ready to start receiving pings and writing pongs immediately upon connecting.

### Fixed

- Fix Event Horizon connection to actually retry if it encounters an error in the connection process.
- Pinging system should now timeout a lot less than before.


# [14.4.0] - 2021-5-19 [PR: #52](https://github.com/dolittle/JavaScript.SDK/pull/52)
## Summary

Adds the current `ExecutionContext` as an argument to `IContainer.get(...)` and sends it along from the `EventContext` when instantiating event handler classes.

### Added

- Added `executionContext: ExecutionContext` as an argument in `IContainer.get(...)`.


# [14.3.2] - 2021-5-18 [PR: #50](https://github.com/dolittle/JavaScript.SDK/pull/50)
## Summary

Fixes `applyPublic()` to actually be public. It was giving false for the `isPublic` parameter for the committing of the event.

### Fixed

- Fixes `applyPublic()` to actually commit public events.


# [14.3.1] - 2021-4-23 [PR: #49](https://github.com/dolittle/JavaScript.SDK/pull/49)
## Summary

Changes all `interface` types to `abstract class`. Their naming stays the same, as we're still using them like interfaces. 
The reason for the change is to enable the use of dependency-injection frameworks for TS/JS for developers.
Transpiling TS -> JS strips away all the interfaces, leaving the DI framework with no token to associate with the type.
Changing them to abstract classes generates empty classes (that must not be instantiated in JS), that can be used as binding tokens.

### Changed

- All `interfaces` to `abstract class`.


# [14.3.0] - 2021-4-9 [PR: #44](https://github.com/dolittle/JavaScript.SDK/pull/44)
## Summary

Adds Projections, that are a special type of event handler dealing with read models. Projections can be defined either inline in the client build steps, or declaratively with `@projection()` decorator.

Example for writing inline projections and registering declared projections:
```typescript
const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes => {
        eventTypes.register(DishPrepared);
        eventTypes.register(ChefFired);
    })
    .withProjections(projections => {
        projections.createProjection('4a4c5b13-d4dd-4665-a9df-27b8e9b2054c')
            .forReadModel(Chef)
            .on(DishPrepared, _ => _.keyFromProperty('Chef'), (chef, event, ctx) => {
                console.log(`Handling read model ${JSON.stringify(chef)}`);
                chef.name = event.Chef;
                chef.dishes.push(event.Dish);
                return chef;
            })
            .on(ChefFired, _ => _.keyFromProperty('Chef'), (chef, event, ctx) => {
                console.log(`Firing ${chef.name}`);
                return ProjectionResult.delete;
            });
        projections.register(Menu);
    })
    .build();
```

Example of `@projection()` decorator:
```typescript
@projection('5b22e60e-f8db-494e-af5c-e8728acb2470')
export class Menu {
    dishes: string[] = [];

    @on(DishPrepared, _ => _.keyFromEventSource())
    on(event: DishPrepared, ctx: EventContext) {
        if (!this.dishes.includes(event.Dish)) {
            this.dishes.push(event.Dish);
        }
    }
}
```

Example of getting projections:
```typescript
const {state: menu} = await client.projections
	.forTenant(TenantId.development)
	.get(Menu, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
console.log('Got menu', menu);

console.log('Getting all chefs');
for (const [, { key, state: chef }] of await client.projections.forTenant(TenantId.development).getAll(Chef)) {
    console.log(`Found chef ${key}`, chef);
}
console.log('Getting all chefs but specify ids');
for (const [, { key, state: chef }] of await client.projections.forTenant(TenantId.development).getAll(Chef, '4a4c5b13-d4dd-4665-a9df-27b8e9b2054d')) {
    console.log(`Found chef ${key}`, chef);
}
console.log('Getting all chefs with no type');
for (const [, { key, state: chef }] of await client.projections.forTenant(TenantId.development).getAll('4a4c5b13-d4dd-4665-a9df-27b8e9b2054c', ScopeId.default)) {
    console.log(`Found chef ${key}`, chef);
}
```

### Added
- New `client.withProjections()` to build Projections inline in the clients build steps.
- Classes can be decorated with`@projection('projectionId')` to declare them as Projections (just like you can do with EventHandlers). The class itself becomes the readmodel for the projection.
- `on()` methods are the handlers for a Projection. They `@on()` decorator defines the event for the method to handle and it defines the key to use for the read model.
- Get the state of a Projection with `client.projections.get<ReadModel>(key)` and `client.projections.getAll<ReadModel>()` (+ other overloads).
- Sample for how to use Projections in _Samples/Tutorials/Projections_.

### Changed
- Sample directory structure and moved the tutorials around

### Fixed
- Fix references in _tsconfig.json_ files


# [14.2.0] - 2021-2-15 [PR: #40](https://github.com/dolittle/JavaScript.SDK/pull/40)
## Summary

Adds aggregates to the SDK in a barebones matter, agnostic to whether there is IoC or not.

### Added

- System for working with aggregates and aggregate roots
- AggregateOf<> method on Client for creating an aggregate root operation on a specific aggregate
- Small sample showcasing the aggregates system

### Changed
- docker-compose in samples run with latest runtime versions


# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [14.0.1] - 2020-10-06
### Changed
- Change basic sample to be the same as the tutorial sample

## [14.0.0] - 2020-10-06
### Added
- Make builder API's behave like int the C# parts
### Changed
- Remove unecessary null checks from concepts and add more types to the conversions

