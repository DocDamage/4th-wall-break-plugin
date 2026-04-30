# FourthWallBreaks v4.13.0 for RPG Maker MZ

FourthWallBreaks is a staged 4th-wall break engine for RPG Maker MZ. It includes screen-crack escalation, breach meter, presence tiers, conditional sequences, trigger rules, input/control distortion, UI corruption, fake system messages, memory/narrative state, battle awareness, audio corruption, visual distortion, fake crash illusions, real-time messages, debug tools, safe mode, presets, and release packaging support.

## Install From Release

Run `node tools/build_release.js`, then copy the contents of `release/FourthWallBreaks_v<version>/` into your RPG Maker MZ project:

```text
js/plugins/FourthWallBreaks.js
img/pictures/FourthWall_01_HairlineFracture.png
img/pictures/FourthWall_02_RealityCrack.png
img/pictures/FourthWall_03_ScreenShatter.png
img/pictures/FourthWall_04_FullBreach.png
```

Enable `FourthWallBreaks` in Plugin Manager.

## Install From Source Checkout

If you are testing directly from this repository instead of the release folder, keep both plugin files together:

```text
js/plugins/FourthWallBreaks.js
js/plugins/FourthWallBreaks.bundled.js
```

`FourthWallBreaks.js` is a small loader in the source checkout. The release builder replaces it with the full bundled plugin in `release/FourthWallBreaks_v<version>/`.

## v4.13.0 Highlights

- Safe mode
- Config import/export
- Built-in preset library
- Runtime config validation
- State recovery helpers
- Debug console reporters
- Compatibility report helpers
- Release package builder script
- Testing guide and changelog

## Safety

All save errors, crashes, corruption, and system messages are safe in-game illusions. The plugin does not modify real files outside normal RPG Maker save data.

## Refactoring Progress (as of April 30, 2026)

The plugin is being refactored for maintainability and modularity. The development entry at `js/plugins/FourthWallBreaks.js` is now a small loader, `js/plugins/FourthWallBreaks.runtime.js` holds the current monolithic runtime source, and `js/plugins/FourthWallBreaks.bundled.js` is generated for local loader use and release packaging. Extracted module files are present as work-in-progress reference slices and should not be installed directly.

- `helpers.js` – Utility functions
- `settings.js` – Plugin parameter parsing and defaults
- `state.js` – State management
- `triggers.js` – Trigger normalization and ID logic
- `presence.js` – Presence and narrative tier logic
- `cracks.js` – Crack transitions, crack state, overlay rendering
- `battle.js` – Battle break and enemy awareness logic
- `audio.js` – Audio corruption logic
- `pluginCommands.js` – Plugin command registration
- `uiCorruption.js` – UI corruption and fake system layer logic
- `visualDistortion.js` – Visual distortion logic
- `glitch.js` – Glitch text and message logic
- `sequences.js` – Sequence logic, validation, runtime, and helpers

### Next Steps
- Keep release packaging responsible for producing the stable single-file installable plugin.
- Continue extracting modules only after their dependencies are explicitly injected or exported.
- Gradually move behavior from `FourthWallBreaks.runtime.js` into modules once each module can reproduce the monolithic behavior, including overlay rendering.

## Development

To regenerate the bundled copy used by release packaging:

```bash
node tools/bundle.js
```

This generates `js/plugins/FourthWallBreaks.bundled.js` from `js/plugins/FourthWallBreaks.runtime.js` and validates it with a syntax check.

To build a full release package (including images, docs, and the bundled plugin):

```bash
node tools/build_release.js
```

This runs the bundler and copies everything into `release/FourthWallBreaks_v<version>/`, ready for zipping.

To run the refactor safety checks directly:

```bash
node tools/verify_refactor.js
```

This checks the loader, runtime source, and bundled copy for script syntax, confirms overlay rendering is present in runtime outputs, smoke-tests the extracted modules, verifies the loader stays small, and verifies the release plugin matches the generated bundle when the release folder exists.

### Module layout

- `js/plugins/FourthWallBreaks.js` – Small development loader and RPG Maker plugin metadata
- `js/plugins/FourthWallBreaks.runtime.js` – Current monolithic runtime source
- `js/plugins/FourthWallBreaks.bundled.js` – Generated runtime bundle used by the loader and copied into release packages
- `js/plugins/FourthWallBreaks/helpers.js` – Shared utilities
- `js/plugins/FourthWallBreaks/state.js` – State shape and migration
- `js/plugins/FourthWallBreaks/settings.js` – Defaults and profile stubs
- `js/plugins/FourthWallBreaks/presence.js` – Presence tier helpers
- `js/plugins/FourthWallBreaks/triggers.js` – Trigger engine utilities
- `js/plugins/cracks.js` – Crack transitions and overlay helpers
- `js/plugins/battle.js` – Battle break effects and enemy awareness
- `js/plugins/audio.js` – Audio corruption layer
- `js/plugins/uiCorruption.js` – UI corruption and fake system messages
- `js/plugins/visualDistortion.js` – Visual distortion logic
- `js/plugins/glitch.js` – Glitch text and message logic
- `js/plugins/sequences.js` – Sequence validation, runtime, and execution
- `js/plugins/pluginCommands.js` – Plugin command registration

**Status:** Modular extraction is in progress. The editable entry is small, while release packaging still produces a stable single-file plugin for RPG Maker.
