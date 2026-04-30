# FourthWallBreaks Development Plan

## Purpose

FourthWallBreaks is being expanded from a staged screen-crack effect plugin into a full psychological 4th-wall break engine for RPG Maker MZ. The goal is to support visual escalation, player-behavior awareness, entity presence, conditional sequences, UI corruption, input manipulation, battle interruptions, persistent memory, fake system events, audio corruption, and developer debugging tools.

This plan keeps the work structured so new features do not turn the plugin into an unstable pile of one-off effects.

---

## Design Rules

1. Preserve compatibility with existing v4.x projects.
2. Never corrupt real save data, local files, or player systems.
3. All dangerous-looking effects must be safe illusions inside RPG Maker.
4. Every new feature must be controllable through script calls, plugin commands, or note tags where appropriate.
5. Accessibility overrides must remain respected by all new visual, audio, and input systems.
6. Performance must stay safe for long RPG Maker sessions.
7. Any feature that runs every frame must have guards, dirty flags, caching, or cooldowns.
8. Debug tools must expose enough runtime state for game designers to understand why an effect triggered.

---

## Phase 1 — Core Architecture Foundation

### 1.1 Central Runtime State

Create a cleaner internal runtime state model that all systems read from and write to.

Target state categories:

```js
{
  stage: 0,
  breachMeter: 0,
  presence: 0,
  narrativeState: "neutral",
  inputLockFrames: 0,
  breachLocked: false,
  controlDistortion: {},
  memory: {},
  sessionFlags: {},
  triggerCooldowns: {},
  activeEffects: {},
  _syncDirty: false
}
```

Acceptance criteria:

- Existing save data migrates safely.
- Old `stage`, `breachMeter`, `trackers`, and `accessibility` values survive migration.
- State changes mark `_syncDirty` instead of forcing variable/switch sync immediately.
- Public helper remains available through `FourthWallBreaks.state()`.

### 1.2 Event Bus

Add a lightweight event bus so systems can react to state changes without hardcoding direct calls everywhere.

Proposed API:

```js
FourthWallBreaks.on("stageChanged", handler);
FourthWallBreaks.off("stageChanged", handler);
FourthWallBreaks.emit("stageChanged", payload);
```

Initial events:

```text
stageChanged
breachChanged
presenceChanged
sequenceStarted
sequenceEnded
breakMomentPlayed
inputLocked
inputUnlocked
mapEntered
battleStarted
battleEnded
```

Acceptance criteria:

- Internal systems use events where useful.
- Existing direct script calls still work.
- Event handlers cannot crash the plugin; exceptions are caught and logged in debug mode.

### 1.3 Condition Engine

Add a controlled condition evaluator for triggers and conditional sequences.

Example conditions:

```text
stage >= 3
breach > 70 && saves > 5
presence >= 50 && memory.ignored_warning
menus >= 10
idle > 3000
```

Supported values:

```text
stage
breach
presence
saves
loads
deaths
menus
idle
highestStage
totalBreaks
narrativeState
memory.KEY
flag.KEY
```

Supported operators:

```text
>, >=, <, <=, ==, !=, &&, ||, !
```

Acceptance criteria:

- No use of unsafe raw `eval`.
- Invalid conditions fail safely and return false.
- Debug mode logs condition parse failures.

---

## Phase 2 — Presence System

### 2.1 Presence Meter

Presence represents how aware or hostile the 4th-wall entity is.

Proposed API:

```js
FourthWallBreaks.setPresence(50);
FourthWallBreaks.addPresence(10);
FourthWallBreaks.getPresence();
FourthWallBreaks.clearPresence();
```

Presence tiers:

| Presence | Tier | Behavior |
|---:|---|---|
| 0–24 | Dormant | Ambient cracks and rare subtle events |
| 25–49 | Aware | More pulses, text glitches, menu flickers |
| 50–74 | Interactive | Direct callouts, conditional messages, stronger overlays |
| 75–100 | Hostile | Input distortion, battle breaks, fake system events |

Acceptance criteria:

- Presence can optionally bind to crack stage or breach meter.
- Presence changes can trigger common events.
- Presence supports variable sync.
- Presence respects accessibility settings indirectly by modifying safe intensity only.

### 2.2 Presence Decay

Optional decay prevents presence from staying high forever unless the designer wants that.

Settings:

```text
PresenceDecayEnabled
PresenceDecayFrames
PresenceDecayAmount
PresenceDecayFloor
```

Acceptance criteria:

- Decay runs on cooldown, not every frame calculation-heavy logic.
- Designers can disable decay.
- Decay never drops below configured floor.

---

## Phase 3 — Conditional Sequences

### 3.1 Sequence Step Conditions

Extend sequence steps with optional logic fields.

Example:

```json
{
  "time": 60,
  "if": "presence > 50 && saves > 3",
  "chance": 0.5,
  "once": true,
  "cooldown": 600,
  "action": "message",
  "speaker": "???",
  "text": "You keep trying."
}
```

Supported fields:

```text
if
chance
once
cooldown
id
```

Acceptance criteria:

- Existing simple sequences still work.
- Invalid steps are skipped safely.
- `once` persists if requested by designer.
- Cooldowns are frame-based and saved where appropriate.

### 3.2 Reusable Runtime Sequences

Add reusable custom sequence registration.

API:

```js
FourthWallBreaks.registerSequence("Watcher Warning", jsonOrArray);
FourthWallBreaks.unregisterSequence("Watcher Warning");
FourthWallBreaks.hasSequence("Watcher Warning");
```

Acceptance criteria:

- Registered sequences can be run by plugin command and script call.
- Bad JSON fails safely.
- Built-in sequence names cannot be accidentally destroyed unless explicitly allowed.

---

## Phase 4 — Trigger Engine

### 4.1 Dynamic Trigger Rules

Add declarative triggers that watch player behavior and fire actions.

Example note tags:

```text
<FWBTrigger: saves > 5 -> sequence: Player Spotted>
<FWBTrigger: idle > 3000 -> message: Still there?>
<FWBTrigger: presence >= 75 -> commonEvent: 12>
```

Trigger fields:

```text
condition
action
cooldown
once
scope
```

Trigger scopes:

```text
global
map
battle
event
region
```

Acceptance criteria:

- Triggers are parsed once where possible.
- Triggers do not run expensive parsing every frame.
- Trigger firing is visible in debug overlay.

### 4.2 Trigger Actions

Initial actions:

```text
stage
sequence
message
breach
presence
pulse
flash
glitch
commonEvent
lockInput
setNarrativeState
```

---

## Phase 5 — Input and Control Distortion

### 5.1 Input Lock Expansion

Current input lock should be formalized as a standalone system.

API:

```js
FourthWallBreaks.lockInput(60);
FourthWallBreaks.unlockInput();
FourthWallBreaks.isInputLocked();
```

Acceptance criteria:

- Plugin command support exists.
- Sequence step support exists.
- Accessibility can disable or cap input manipulation.

### 5.2 Control Distortion

Add temporary safe control interference.

API:

```js
FourthWallBreaks.setControlDistortion({
  invertX: true,
  invertY: false,
  delayFrames: 6,
  drift: 0.1,
  randomInputs: false,
  duration: 180
});
FourthWallBreaks.clearControlDistortion();
```

Modes:

```text
invert movement
movement delay
small drift
random blocked inputs
forced single step
```

Acceptance criteria:

- Can be disabled globally for accessibility.
- Does not permanently alter keybinds.
- Does not interfere with text input scenes.
- Does not trigger during save/load scenes.

---

## Phase 6 — UI Corruption and Fake System Layer

### 6.1 UI Corruption Engine

Expand existing menu corruption into a dedicated system.

Effects:

```text
glyph swaps
command name flicker
slight window offset
cursor jump
fake disabled command flicker
opacity flutter
```

API:

```js
FourthWallBreaks.setUiCorruption(level);
FourthWallBreaks.clearUiCorruption();
```

Acceptance criteria:

- Works with standard RPG Maker windows.
- Fails gracefully with custom plugin windows.
- Does not make menus unusable unless designer explicitly allows severe mode.

### 6.2 Fake System Messages

Add safe fake system prompts.

API:

```js
FourthWallBreaks.fakeSystemMessage("File integrity compromised.");
FourthWallBreaks.fakeSaveFailure();
FourthWallBreaks.fakeOptionChange("Volume", "???");
```

Acceptance criteria:

- All messages are in-game illusions.
- No real save file operation is blocked unless the designer intentionally uses event logic.
- Accessibility and debug mode can identify fake messages as plugin-generated.

---

## Phase 7 — Memory and Narrative State

### 7.1 Memory API

Add key-value memory helpers.

API:

```js
FourthWallBreaks.memory.set("ignored_warning", true);
FourthWallBreaks.memory.get("ignored_warning");
FourthWallBreaks.memory.add("warnings_seen", 1);
FourthWallBreaks.memory.clear("ignored_warning");
```

Memory scopes:

```text
session
save
global plugin state inside save data
```

Acceptance criteria:

- Memory is serialized safely.
- Memory values are limited to simple JSON-safe types.
- Memory can be used in conditions and message tokens.

### 7.2 Narrative State

Add a designer-controlled narrative mode.

API:

```js
FourthWallBreaks.setNarrativeState("neutral");
FourthWallBreaks.getNarrativeState();
```

Suggested states:

```text
neutral
curious
aware
hostile
bargaining
silent
```

Acceptance criteria:

- Narrative state can affect random subtle events and sequence selection.
- Narrative state can be used in conditions.
- State can sync to variable if configured.

---

## Phase 8 — Battle Integration

### 8.1 Enemy Awareness

Enemies can react to the player, not just party characters.

Note tags:

```text
<FWBAwareEnemy>
<FWBAwarenessStage: 3>
<FWBAwarenessMessage: You are not supposed to be here.>
```

Acceptance criteria:

- Enemy awareness can fire once per enemy/troop.
- Bosses can trigger custom sequences at HP thresholds.
- Existing HP threshold logic remains compatible.

### 8.2 Battle Break Effects

Safe battle illusions:

```text
fake damage popup
fake heal popup
turn order flicker
enemy command interruption
battle log corruption
```

API:

```js
FourthWallBreaks.fakeDamage(target, amount);
FourthWallBreaks.fakeHeal(target, amount);
FourthWallBreaks.corruptBattleLog(amount);
```

Acceptance criteria:

- Fake effects do not alter real HP unless explicitly requested by separate event/script logic.
- Battle log corruption respects accessibility and debug settings.

---

## Phase 9 — Audio Corruption

### 9.1 Audio Distortion Flags

Add controlled audio illusions where RPG Maker APIs allow it.

Effects:

```text
pitch drift
volume flutter
brief dropout
wrong SE substitution
low-health style pulse
```

API:

```js
FourthWallBreaks.setAudioCorruption({
  pitchDrift: 0.04,
  volumeFlutter: 0.1,
  dropoutChance: 0.02,
  duration: 300
});
FourthWallBreaks.clearAudioCorruption();
```

Acceptance criteria:

- Global `DisableAudioDistortion` blocks all audio corruption.
- Audio changes are temporary and reversible.
- Does not permanently change BGM/BGS settings.

---

## Phase 10 — Visual Distortion Upgrade

### 10.1 Screen Distortion Layer

Add non-shader fallback first, then optional shader-like behavior where possible.

Effects:

```text
screen breathing
edge warp illusion
slight zoom wobble
ripple pulse
chromatic offset scaling
```

Acceptance criteria:

- Works without custom shader dependency.
- Heavy effects can be disabled.
- Existing crack overlays still render correctly.

### 10.2 Stage Profile Expansion

Add profile fields:

```text
chromaticOffset
breathAmount
breathSpeed
warpAmount
uiCorruption
presenceGain
controlDistortion
```

Acceptance criteria:

- `StageProfilesJson` can override new fields.
- Missing fields use safe defaults.

---

## Phase 11 — Meta Events

### 11.1 Fake Crash / Reboot Sequence

Add a safe fake crash flow.

Steps:

```text
fade to black
show fake error text
pause input briefly
restore scene
apply configured memory flag or stage change
```

API:

```js
FourthWallBreaks.fakeCrash({
  message: "Runtime breach detected.",
  duration: 180,
  returnStage: 2
});
```

Acceptance criteria:

- Does not close the game.
- Does not corrupt files.
- Can be disabled by accessibility or plugin parameter.

### 11.2 Real-Time Awareness

Optional use of local date/time for dialogue.

API:

```js
FourthWallBreaks.realTime.hour();
FourthWallBreaks.realTime.isLateNight();
```

Acceptance criteria:

- Designer can disable real-time awareness.
- Does not transmit or collect data.
- Used only for local in-game illusions.

---

## Phase 12 — Developer Tools

### 12.1 Debug Inspector Expansion

Debug overlay should show:

```text
stage
breach
presence
narrative state
input lock frames
breach lock state
active sequence
active triggers
last fired trigger
sync dirty state
active corruption systems
```

Acceptance criteria:

- Overlay remains lightweight.
- Can be toggled at runtime.
- Does not appear in production unless enabled.

### 12.2 Sequence Validator

Validate custom sequence JSON before running.

Checks:

```text
valid JSON
array format
recognized action names
valid numeric fields
safe condition strings
missing required values
```

API:

```js
FourthWallBreaks.validateSequence(jsonOrArray);
```

Acceptance criteria:

- Returns structured errors.
- Debug mode logs errors clearly.
- Bad sequences do not crash gameplay.

---

## Suggested Implementation Order

1. Central state cleanup and migration.
2. Event bus.
3. Dirty sync flag.
4. Condition engine.
5. Presence meter.
6. Conditional sequences.
7. Runtime sequence registry.
8. Trigger engine.
9. Input distortion.
10. UI corruption.
11. Memory and narrative state.
12. Battle break effects.
13. Audio corruption.
14. Visual distortion expansion.
15. Fake crash and real-time awareness.
16. Debug inspector and validators.

---

## Version Roadmap

### v4.1.x

- Correctness fixes
- Documentation consistency
- Input lock commands
- Breach lock commands
- Region note tag expansion
- Runtime sequence registration
- Dirty sync optimization
- Scanline caching

### v4.2.0

- Event bus
- Condition engine
- Presence system
- Conditional sequence steps

### v4.3.0

- Trigger engine
- Memory API
- Narrative state API
- Expanded debug inspector

### v4.4.0

- Input distortion
- UI corruption engine
- Fake system messages

### v4.5.0

- Battle break effects
- Enemy awareness system
- Audio corruption layer

### v4.6.0

- Visual distortion expansion
- Fake crash sequence
- Real-time awareness
- Sequence validator

---

## Non-Negotiable Safety Boundaries

The plugin may simulate:

```text
save errors
file corruption
system messages
crashes
UI failure
player observation
input interference
```

The plugin must never:

```text
modify real files outside RPG Maker save data
break real saves intentionally
access personal data
collect analytics without explicit developer setup
trap the player in inaccessible menus
make flashing unavoidable
make input distortion impossible to disable
```

---

## Final Target

FourthWallBreaks should become a reusable RPG Maker MZ framework for games that want meta-horror, psychological escalation, entity awareness, reality-breaking presentation, and player-behavior-driven narrative moments.

The finished system should feel like the game is watching the player, but it must remain safe, configurable, performant, and designer-friendly.
