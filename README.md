# FourthWallBreaks v4.1.0 for RPG Maker MZ

A staged 4th-wall break plugin for RPG Maker MZ. It uses four progressive screen-crack overlays and adds escalation commands, a breach meter, timed break sequences, battle hooks, note tags, UI corruption, text glitching, player-behavior tracking, common-event hooks, persistence options, debug tools, accessibility controls, input locks, custom reusable sequences, expanded region triggers, breach locking, and scanline performance caching.

## Install

Copy these into your project:

```text
js/plugins/FourthWallBreaks.js
img/pictures/FourthWall_01_HairlineFracture.png
img/pictures/FourthWall_02_RealityCrack.png
img/pictures/FourthWall_03_ScreenShatter.png
img/pictures/FourthWall_04_FullBreach.png
```

Then enable **FourthWallBreaks** in the RPG Maker MZ Plugin Manager.

The included crack images were processed from the uploaded versions so the checkerboard backgrounds are transparent. The original uploaded files are also included in `source_uploaded_originals/` as backups.

## Stages

| Stage | Asset | Default role |
|---:|---|---|
| 0 | none | clean screen |
| 1 | `FourthWall_01_HairlineFracture` | faint hairline fracture |
| 2 | `FourthWall_02_RealityCrack` | light radial impact |
| 3 | `FourthWall_03_ScreenShatter` | large spiderweb fracture |
| 4 | `FourthWall_04_FullBreach` | full-screen shattered breach |

The default crack mode is **hybrid**: stages 1–3 stack, and stage 4 becomes the full breach overlay. You can switch to **replace** or **stack** in plugin parameters or with the `Set Crack Mode` command.

## Main plugin commands

| Command | Purpose |
|---|---|
| Set Crack Stage | Set stage 0–4 with fade support |
| Escalate Crack | Increase the current stage |
| Reduce Crack Stage | Decrease the current stage |
| Clear Crack | Fade out all crack overlays |
| Pulse Crack | Brief zoom/opacity pulse |
| Flash Crack | Safe screen flash, disabled by accessibility setting |
| Lock / Unlock Crack Stage | Prevent or allow stage changes |
| Lock / Unlock Input | Block or restore player input for a chosen frame count |
| Lock / Unlock Breach Meter | Prevent or allow breach meter changes |
| Register Custom Sequence | Save a custom sequence under a reusable name |
| Set Crack Mode | Use replace, stack, or hybrid mode |
| Run Break Sequence | Run a staged preset or custom JSON sequence |
| Add / Set Breach Meter | Control the 0–100 breach meter |
| Repair Screen | Heal one stage or clear all cracks |
| Glitch Next Message | Corrupt the next message line(s) |
| Glitch Speaker Name | Corrupt the next speaker name(s) |
| Play 4th Wall Break | One command for stage, text, type, breach, and tracking |
| Set Random Subtle Events | Toggle random small break events |
| Set Accessibility Overrides | Reduce flashing, shake, flicker, stage 4, or opacity |
| Debug Action | Print state, test stages, test pulse, test sequence, clear, reset memory |
| Force Sync | Immediately sync configured variables and switches |

## Built-in sequences

Use the `Run Break Sequence` command or script calls:

```js
FourthWallBreaks.runSequence("Subtle Warning");
FourthWallBreaks.runSequence("Reality Fracture");
FourthWallBreaks.runSequence("Full Breach");
FourthWallBreaks.runSequence("Boss Break");
FourthWallBreaks.runSequence("Player Spotted");
FourthWallBreaks.runSequence("System Failure");
```

Sequence step actions supported:

```text
stage
escalate
reduce
clear
pulse
flash
glitch
speaker
message
breach
commonEvent
lockInput
unlockInput
```

## Common script calls

```js
FourthWallBreaks.setStage(2);
FourthWallBreaks.escalate();
FourthWallBreaks.reduce();
FourthWallBreaks.clear();
FourthWallBreaks.pulse(60, 0.5);
FourthWallBreaks.flash(24, 160);
FourthWallBreaks.lock();
FourthWallBreaks.unlock();
FourthWallBreaks.setMode("stack");
FourthWallBreaks.addBreach(10);
FourthWallBreaks.setBreach(75);
FourthWallBreaks.lockBreach();
FourthWallBreaks.unlockBreach();
FourthWallBreaks.lockInput(60);
FourthWallBreaks.unlockInput();
FourthWallBreaks.registerSequence("Custom Warning", "[{\"time\":0,\"action\":\"stage\",\"stage\":2}]");
FourthWallBreaks.repair("oneStage", 60);
FourthWallBreaks.glitchNextMessage(0.25, 1);
FourthWallBreaks.glitchSpeakerName(0.35, 1);
```

## Message tokens

`Play 4th Wall Break` message text and sequence `message` steps support these tokens:

```text
{player}
{saves}
{loads}
{deaths}
{menus}
{stage}
{breach}
```

Example:

```text
You loaded this world {loads} times, {player}.
```

## Note tags

Supported on maps, events, enemies, skills/items, actors, and page comments where applicable.

```text
<FWBStage: 2>
<FourthWallStage: 3>
<FWBPulse>
<FWBPulse: 60,0.5>
<FWBFlash>
<FWBSequence: Reality Fracture>
<FWBBreach: 10>
<FWBGlitch: 0.25>
<FWBCommonEvent: 12>
<FWBForbiddenRoom>
<FWBMapEnterStage: 2>
<FWBMapEnterSequence: Reality Fracture>
```

Enemy/battle-specific note tags:

```text
<FWBOnAppearStage: 2>
<FWBStage90: 1>
<FWBStage75: 2>
<FWBStage50: 3>
<FWBStage25: 4>
<FWBStage10: 4>
<FWBSkillCrack: 2>
<FWBSkillPulse>
<FWBDeathCrack: 3>
```

Region note tags on maps:

```text
<FWBRegion13Stage: 2>
<FWBRegion13Pulse>
<FWBRegion13Clear>
<FWBRegion13Breach: 10>
<FWBRegion13Sequence: Boss Break>
<FWBRegion13Glitch: 0.25>
<FWBRegion13CommonEvent: 5>
```

You can also use `RegionRulesJson` in plugin parameters, for example:

```json
[
  {"regionId":13,"action":"stage","stage":2},
  {"regionId":14,"action":"pulse","duration":60,"intensity":0.5},
  {"regionId":15,"action":"clear"}
]
```

## Breach meter

The breach meter runs from 0 to 100. By default it is bound to crack stages:

| Breach | Stage |
|---:|---:|
| 0–24 | 0 |
| 25–49 | 1 |
| 50–74 | 2 |
| 75–94 | 3 |
| 95–100 | 4 |

The thresholds are editable in plugin parameters. The breach meter can also be locked so scripted stage locks are not bypassed by breach changes.

## Persistence and hooks

The plugin can keep cracks visible across maps, battles, menus, and save/load scenes. It can also sync the current stage, breach meter, total break count, active crack state, and full breach state into game variables and switches.

Common-event hooks are available for stage 1, stage 2, stage 3, stage 4, and clear.

## Player behavior tracking

The plugin tracks:

```text
save count
load count
death/game-over count
menu openings
idle frames
repeated event interactions
map visits
seen break IDs
highest stage reached
total break count
```

These values can be referenced through message tokens or used through your own event logic via synced variables/switches.

## Accessibility

Accessibility options can be set globally in plugin parameters or during gameplay with `Set Accessibility Overrides`:

```text
Reduce flashing
Reduce screen shake
Disable flicker
Disable full-screen stage 4
Cap max overlay opacity
Disable audio distortion flag
```

## Debugging

Enable `DebugMode` or `DebugOverlay` in plugin parameters, or use `Debug Action` commands. The debug overlay shows the stage, breach meter, crack mode, lock state, number of active overlays, and current sequence.

## Custom stage profile example

Use `StageProfilesJson` in plugin parameters to override stage behavior:

```json
[
  {"stage":1,"opacity":70,"fadeIn":60,"shake":0},
  {"stage":2,"opacity":145,"fadeIn":35,"shake":2,"blendMode":"normal"},
  {"stage":3,"opacity":190,"shake":4,"blendMode":"screen","chromatic":true,"chromaticOffset":2},
  {"stage":4,"opacity":235,"shake":7,"staticNoise":0.05,"scanlines":0.16}
]
```

Optional sound keys per stage:

```json
[{"stage":3,"se":"GlassBreak","volume":80,"pitch":96,"pan":0}]
```

Place sound files in your normal RPG Maker SE folder and reference the file name without extension.
