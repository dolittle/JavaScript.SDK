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

