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

### ios bundle_ids

```sh
[bundle exec] fastlane ios bundle_ids
```

List all registered bundle identifiers in the account

### ios delete_odyssey

```sh
[bundle exec] fastlane ios delete_odyssey
```

Delete the sideloaded Odyssey jailbreak bundle identifier

### ios find_delete

```sh
[bundle exec] fastlane ios find_delete
```

Introspect delete methods for bundle ids

### ios probe_client

```sh
[bundle exec] fastlane ios probe_client
```

Probe raw HTTP verbs on the ConnectAPI client

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
