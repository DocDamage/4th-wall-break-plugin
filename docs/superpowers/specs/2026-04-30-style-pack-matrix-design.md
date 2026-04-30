# FourthWallBreaks Style Pack Matrix Design

Date: 2026-04-30

## Goal

Add a mix-and-match visual/audio style system to FourthWallBreaks so designers can choose independent art directions for cracks, overlays, UI corruption, audio corruption, presence behavior, and sequence flavor. The system should make the plugin feel more expressive without forcing one global theme.

The first implementation should prioritize a registry/API and built-in metadata that uses existing effects and assets. New generated assets can be added pack-by-pack after the selection and preview system exists.

## Core Concept

Style packs are grouped by channel. A designer can set one pack per channel:

```js
FourthWallBreaks.setStylePack("cracks", "clean_glass");
FourthWallBreaks.setStylePack("ui", "digital_malware");
FourthWallBreaks.setStylePack("audio", "vhs_decay");
FourthWallBreaks.setStylePack("presence", "entity_watching");
```

Recipes are optional convenience presets that apply multiple channels at once:

```js
FourthWallBreaks.applyStyleRecipe("digital_malware");
FourthWallBreaks.previewStyleRecipe("void_entity", 600);
```

## Channels

### Cracks

Controls crack stage profiles and crack-related visual defaults.

Pack data may include:

- Stage image names
- Opacity
- Blend mode
- Flicker
- Chromatic flag and offset
- Random rotation/offset/scale
- Scanline/static profile fields

Initial built-in packs:

- `clean_glass`
- `deep_fracture`
- `shattered_lens`
- `void_tear`
- `digital_split`

### Overlays

Controls non-crack visual pressure layered on top of the screen.

Pack data may include:

- Vignette/edge pressure image
- Static veil image
- Presence mark image
- Blend mode
- Opacity
- Pulse/phase behavior

Initial built-in packs:

- `none`
- `static_veil`
- `edge_pressure`
- `presence_mark`
- `cosmic_noise`

### UI

Controls menu/save/load corruption flavor.

Pack data may include:

- Glitch symbols
- Text corruption amount modifier
- Cursor instability modifier
- Window offset amount
- Fake disabled-command probability
- Save/load label flavor

Initial built-in packs:

- `subtle_wrongness`
- `haunted_save`
- `terminal_failure`
- `malware_popup`
- `dream_decay`

### Audio

Controls defaults for audio corruption.

Pack data may include:

- Pitch drift default
- Volume flutter default
- Dropout chance
- Wrong SE chance
- SE substitution pool

Initial built-in packs:

- `vhs_decay`
- `signal_dropout`
- `wrong_sfx`
- `low_breathing`
- `system_bleed`

### Presence

Controls how presence tiers express themselves visually and behaviorally.

Pack data may include:

- Presence-to-stage bias
- Random subtle event weights
- Preferred sequence names
- Visual distortion defaults
- Overlay pack recommendation
- UI corruption level bias

Initial built-in packs:

- `entity_watching`
- `void_pressure`
- `cosmic_attention`
- `hostile_system`
- `silent_observer`

### Sequences

Controls optional sequence flavor choices. This channel should not replace the existing sequence registry; it should provide recommended defaults and aliases.

Pack data may include:

- Recommended subtle sequence
- Recommended hostile sequence
- Recommended fake-crash sequence
- Sequence action defaults

Initial built-in packs:

- `classic`
- `vhs`
- `malware`
- `void`
- `dream`

## Public API

```js
FourthWallBreaks.registerStylePack(channel, name, data);
FourthWallBreaks.unregisterStylePack(channel, name);
FourthWallBreaks.listStylePacks(channel);
FourthWallBreaks.getStylePack(channel, name);
FourthWallBreaks.setStylePack(channel, name, options);
FourthWallBreaks.getActiveStylePacks();
FourthWallBreaks.clearStylePack(channel);

FourthWallBreaks.registerStyleRecipe(name, recipe);
FourthWallBreaks.applyStyleRecipe(name, options);
FourthWallBreaks.previewStyleRecipe(name, frames);
FourthWallBreaks.listStyleRecipes();
```

`setStylePack` should return `true` on success and `false` for unknown channels or pack names. Invalid input should fail safely and log only when debug mode is enabled.

## Plugin Commands

Add commands:

- `SetStylePack`
- `ClearStylePack`
- `ApplyStyleRecipe`
- `PreviewStyleRecipe`
- `ListStylePacks`

Command args:

- `channel`
- `packName`
- `recipeName`
- `duration`

## State Shape

Add to runtime state:

```js
stylePacks: {
  cracks: "",
  overlays: "",
  ui: "",
  audio: "",
  presence: "",
  sequences: ""
},
stylePreview: null
```

`stylePreview` should be runtime-only or safely cleared after its duration. Save migration must add `stylePacks` for old saves without losing existing state.

## Data Flow

1. Built-in style packs register during plugin initialization.
2. Designer selects packs through script calls or plugin commands.
3. Selected pack names are stored in state.
4. Systems read merged style values through helper functions instead of directly reading pack objects.
5. Preview functions temporarily override active style values and restore the prior selection after the duration ends.

## Merge Rules

Style pack values should be additive and conservative:

- Explicit designer plugin parameters remain the base.
- Active style packs provide defaults or modifiers.
- Direct script calls and sequence steps remain highest priority.
- Accessibility overrides always win.
- Safe mode disables or caps risky visual/audio/input effects regardless of style pack.

## Asset Plan

First pass should use existing crack assets and runtime effects. After the API is stable, add assets in small packs:

```text
FourthWall_05_ThinTear.png
FourthWall_06_DeepFracture.png
FourthWall_07_StaticVeil.png
FourthWall_08_EdgePressure.png
FourthWall_09_PresenceMark.png
```

Future art directions can add more assets without changing the core API.

## Safety And Accessibility

- `reduceFlashing` must cap flash/strobe-like pack behavior.
- `disableFlicker` must disable text flicker, static flicker, and rapid alpha changes.
- `disableAudioDistortion` must block audio style effects.
- `disableStage4` must prevent style packs from forcing stage 4.
- `maxOverlayOpacity` must cap style-driven overlay opacity.
- Safe mode must clear previews and suppress strong style behavior.

## Testing

Automated checks:

- `node tools/verify_refactor.js`
- `node tools/build_release.js`

Manual RPG Maker checks:

- Set each channel independently and verify only that channel changes.
- Apply a recipe and verify all expected channels change.
- Preview a recipe and verify prior packs restore afterward.
- Toggle accessibility settings and verify strong effects are capped or disabled.
- Save/load and verify selected style packs persist.
- Run a release build and verify the release plugin loads as a single file.

## Implementation Slices

1. Add state fields, registry structures, and read-only list/get helpers.
2. Add built-in pack metadata using existing assets/effects.
3. Add `setStylePack`, `clearStylePack`, and active pack merge helpers.
4. Wire crack/audio/UI/presence systems to read style defaults conservatively.
5. Add recipes and preview runtime.
6. Add plugin commands.
7. Add docs and manual testing notes.
8. Generate/add new assets pack-by-pack.

## Open Decisions

- The first implementation should not generate assets yet. It should make packs selectable and testable with current effects.
- New assets should be added after the API proves stable.
- The style system should not require ES module loading in RPG Maker; release output remains a single-file plugin.
