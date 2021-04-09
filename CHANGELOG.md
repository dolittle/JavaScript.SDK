# [14.3.0-projections.1] - 2021-4-9 [PR: #45](https://github.com/dolittle/JavaScript.SDK/pull/45)
## Summary

Upgrade to latest prerelease of Contracts, and implement getting of current projection state from the Runtime through `IProjectionStore`.

### Added

- The `IProjectionStore` interface to get current projection states from the Runtime.

### Changed

- Updated to latest prerelease of Contracts (11).
- Improve some log messages that referred to a type. It was printing the whole class definition.
- Reset the default log level back to `info`.


# [14.3.0-projections.0] - 2021-3-30 [PR: #43](https://github.com/dolittle/JavaScript.SDK/pull/43)
- Added a new package `projections` in the project.
- New `client.withProjections()` for building Projections inline
- New `ProjectionsBuilder` with `createProjection(projectionId)` method that returns a `ProjectionBuilder` that has 3 methods:
  - `inScope(scopeId)` for setting the scope (defaults to default scope)
  - `forReadModel(Constructor<any>)` that takes a class to register as a readmodel for the projection
  - `on()` with all of the variations for using `EventType`s, type arguments or `Generation`s etc 
- I made the API a bit more flat so that you can put the `forReadModel()`, `on()` and `inScope()` methods in whichever order.
  - I don't think we need a constraint on this, if users want to put them in a different order then that's on them. It also doesn't make the code suddenly stop working if you put `forReadModel()` before `inScope()` or stuff like that.
  - This also means that the code is more error prone as it's slightly easier to accidentally call `forReadModel()` twice I guess. This gets checked during the build and it will throw an error in that case.
- New sample in `Samples/Tutorials/Projections` with a readmodel of all chefs and all the dishes they've prepared
  - This could be enough for the tutorial too, that can be discussed when we get there
- Code regarding the decorators is not complete as we should just first focus on the inline
- The `projections` project builds,  but the whole repo  doesn't as I'm waiting for the `ProjectionsClient` from the new contracts for JS. I've mocked the `ProjectionsClient` in places with a dummy type.
- You can delete a readmodel by returning a `ProjectionResult.delete` in the `on()` method.

Example how the inline code would look like:

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
                console.log(`Handling event ${JSON.stringify(event)} and read model ${JSON.stringify(chef)}`);
                chef.name = event.Chef;
                chef.dishes.push(event.Dish);
                return chef;
            })
            .on(ChefFired, _ => _.keyFromProperty('Chef'), (chef, event, ctx) => {
                console.log(`Firing ${chef.name}`);
                return ProjectionResult.delete;
            })
        })
    .build();
```

And a diagram on how the builder works:
![image](https://user-images.githubusercontent.com/10163775/112305046-87714180-8c9e-11eb-950d-17e3ae4af416.png)


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

