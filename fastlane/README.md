fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios inspect

```sh
[bundle exec] fastlane ios inspect
```

Inspect app version + locale state

### ios screens

```sh
[bundle exec] fastlane ios screens
```

Upload screenshots only to the editable App Store version

### ios verify_screens

```sh
[bundle exec] fastlane ios verify_screens
```

Verify uploaded screenshot sets

### ios all_screens

```sh
[bundle exec] fastlane ios all_screens
```

List screenshots for every version (live + editable)

### ios readiness

```sh
[bundle exec] fastlane ios readiness
```

Check submission readiness for editable version

### ios submit

```sh
[bundle exec] fastlane ios submit
```

Attach build 2 and submit v1.0.1 for review

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
