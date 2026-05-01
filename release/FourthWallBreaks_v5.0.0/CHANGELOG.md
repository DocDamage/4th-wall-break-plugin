# Changelog

## v5.0.0

Style Pack Matrix system.

- Added 6-channel style pack matrix (cracks, overlays, ui, audio, presence, sequences)
- Added `FourthWallBreaks.registerStylePack` API for registering custom packs
- Added `FourthWallBreaks.setStylePack` API for activating packs per channel
- Added `FourthWallBreaks.getActiveStylePacks` API for inspecting active packs
- Added `FourthWallBreaks.clearStylePack` API for clearing channel packs
- Added `FourthWallBreaks.registerStyleRecipe` API for bundling multi-channel combinations
- Added `FourthWallBreaks.applyStyleRecipe` API for applying recipes
- Added `FourthWallBreaks.previewStyleRecipe` API for previewing recipes without persisting
- Added `FourthWallBreaks.listStylePacks` API for listing registered packs
- Added `FourthWallBreaks.listStyleRecipes` API for listing registered recipes
- Added plugin commands: `SetStylePack`, `ClearStylePack`, `ApplyStyleRecipe`, `PreviewStyleRecipe`, `ListStylePacks`
- Added built-in style packs for all 6 channels
- Added `stylePacks` state field with save migration

## v4.13.0

Release hardening and packaging pass.

- Added safe mode
- Added config import/export
- Added built-in preset library
- Added config validation
- Added state recovery helpers
- Added runtime-only reset helper
- Added debug trigger/sequence/memory reporters
- Added compatibility report helper
- Added release package builder
- Added testing guide
- Added preset JSON files

## v4.12.0

- Visual distortion layer
- Fake crash/reboot illusion
- Real-time awareness
- Debug snapshots
- Runtime validation

## v4.9.0

- Memory and narrative expansion
- Enemy awareness and battle illusion hooks
- Audio corruption

## v4.6.0

- Trigger engine
- Input/control distortion
- UI corruption and fake system layer

## v4.3.0

- Conditional sequence engine
- Sequence queue/control API
- Sequence validation

## v4.2.0

- Presence tiers
- Presence decay
- Presence bindings
- Presence tokens and note tags

## v4.1.0

- Phase 1 architecture
- Event bus
- Condition engine
- Breach/input locks
- Region and map-enter expansion

## v4.0.0

- Base staged screen-crack system
- Breach meter
- Battle hooks
- Text glitching
- Save/load/menu corruption illusions
