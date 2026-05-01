# FourthWallBreaks Testing Guide

## Automated Refactor Checks

Run this after changing plugin source, extracted modules, or release tooling:

```bash
node tools/verify_refactor.js
```

The check verifies script syntax for the loader, runtime source, and bundled plugin; rejects static `import`/`export` in script-loaded plugin files; confirms overlay rendering is still present in runtime outputs; smoke-tests extracted module imports; checks that `FourthWallBreaks.js` stays small; and checks that the release plugin matches the generated bundle when a release folder exists.

Run these checks inside a blank RPG Maker MZ test project before publishing.

## Core Visual Tests

- Set Crack Stage 1, 2, 3, 4
- Clear Crack
- Pulse Crack
- Flash Crack
- Toggle accessibility options and repeat visual tests

## Presence Tests

Script calls:

```js
FourthWallBreaks.setPresence(0)
FourthWallBreaks.setPresence(25)
FourthWallBreaks.setPresence(50)
FourthWallBreaks.setPresence(75)
FourthWallBreaks.setPresence(100)
```

Confirm `FourthWallBreaks.getPresenceTier()` returns expected tiers.

## Sequence Tests

```js
FourthWallBreaks.runSequence("Subtle Warning")
FourthWallBreaks.queueSequence("System Failure")
FourthWallBreaks.pauseSequence()
FourthWallBreaks.resumeSequence()
FourthWallBreaks.stopSequence(true)
```

## Trigger Tests

```js
FourthWallBreaks.registerTrigger({
  id: "test_presence",
  condition: "presence GTE 50",
  action: "message",
  value: "Presence trigger fired.",
  once: "session"
})
FourthWallBreaks.setPresence(60)
```

## Input / Control Tests

```js
FourthWallBreaks.lockInput(60)
FourthWallBreaks.setControlDistortion({ invertX: true, duration: 180 })
FourthWallBreaks.clearControlDistortion()
```

## UI / Fake System Tests

```js
FourthWallBreaks.setUiCorruption(3, 300)
FourthWallBreaks.fakeSystemMessage("Runtime warning.")
FourthWallBreaks.fakeSaveFailure()
FourthWallBreaks.fakeOptionChange("Volume", "???")
```

## Battle Tests

- Enemy with `<FWBAwareEnemy>`
- Enemy with `<FWBAwarenessStage: 3>`
- Enemy with HP threshold tags
- Script calls:
```js
FourthWallBreaks.fakeDamage(0, 9999)
FourthWallBreaks.fakeHeal(0, 9999)
FourthWallBreaks.corruptBattleLog(0.25, 3)
```

## Audio / Visual / Meta Tests

```js
FourthWallBreaks.setAudioCorruption({ pitchDrift: 0.08, duration: 300 })
FourthWallBreaks.setVisualDistortion({ breathAmount: 0.02, duration: 300 })
FourthWallBreaks.fakeCrash({ message: "Runtime breach detected.", duration: 180, returnStage: 2 })
```

## Style Pack Tests

Register and activate custom style packs:

```js
FourthWallBreaks.registerStylePack("myCrackPack", "cracks", { stages: ["Custom_01", "Custom_02"] })
FourthWallBreaks.setStylePack("cracks", "myCrackPack")
FourthWallBreaks.getActiveStylePacks()
FourthWallBreaks.clearStylePack("cracks")
```

Register and apply style recipes:

```js
FourthWallBreaks.registerStyleRecipe("HorrorRecipe", {
  cracks: "horrorCracks",
  overlays: "horrorOverlays",
  ui: "horrorUI",
  audio: "horrorAudio",
  presence: "horrorPresence",
  sequences: "horrorSequences"
})
FourthWallBreaks.applyStyleRecipe("HorrorRecipe")
FourthWallBreaks.previewStyleRecipe("HorrorRecipe")
FourthWallBreaks.listStylePacks()
FourthWallBreaks.listStyleRecipes()
```

Test plugin commands:
- `SetStylePack cracks myCrackPack`
- `ClearStylePack cracks`
- `ApplyStyleRecipe HorrorRecipe`
- `PreviewStyleRecipe HorrorRecipe`
- `ListStylePacks`

## Hardening Tests

```js
FourthWallBreaks.validateConfig()
FourthWallBreaks.debugSnapshot()
FourthWallBreaks.debugPrintTriggers()
FourthWallBreaks.debugPrintSequences()
FourthWallBreaks.debugPrintMemory()
FourthWallBreaks.compat.report()
FourthWallBreaks.enableSafeMode()
FourthWallBreaks.disableSafeMode()
```
