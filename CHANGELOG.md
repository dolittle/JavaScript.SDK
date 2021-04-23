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

