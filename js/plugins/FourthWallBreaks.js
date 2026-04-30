/*:
 * @target MZ
 * @plugindesc v4.9.0 Feature-packed staged 4th-wall break engine with Phases 7-9 memory/narrative expansion, battle break effects, audio corruption, trigger engine, control distortion, UI corruption, presence tiers, event bus, condition engine, staged cracks, breach meter, debug, and accessibility.
 * @author DocDamage
 * @url https://github.com/DocDamage/4th-wall-break-plugin
 *
 * @help
 * FourthWallBreaks.js
 * Place this file in: js/plugins/FourthWallBreaks.js
 * Place the crack images in: img/pictures/
 *
 * Default staged crack assets used by this package:
 *   FourthWall_01_HairlineFracture
 *   FourthWall_02_RealityCrack
 *   FourthWall_03_ScreenShatter
 *   FourthWall_04_FullBreach
 *
 * Core stage ladder:
 *   0 = clean screen
 *   1 = hairline fracture
 *   2 = reality crack
 *   3 = screen shatter
 *   4 = full breach
 *
 * Useful script calls:
 *   FourthWallBreaks.setStage(2)
 *   FourthWallBreaks.escalate()
 *   FourthWallBreaks.clear()
 *   FourthWallBreaks.pulse(60, 0.5)
 *   FourthWallBreaks.runSequence("Reality Fracture")
 *   FourthWallBreaks.addBreach(10)
 *   FourthWallBreaks.lockInput(60)
 *   FourthWallBreaks.unlockInput()
 *   FourthWallBreaks.lockBreach()
 *   FourthWallBreaks.unlockBreach()
 *   FourthWallBreaks.registerSequence("My Sequence", "[...]")
 *   FourthWallBreaks.setPresence(50)
 *   FourthWallBreaks.addPresence(10)
 *   FourthWallBreaks.getPresenceTier()
 *   FourthWallBreaks.setPresenceDecay(true, 1, 900, 0)
 *   FourthWallBreaks.validateSequence("[...]")
 *   FourthWallBreaks.queueSequence("Boss Break")
 *   FourthWallBreaks.pauseSequence()
 *   FourthWallBreaks.resumeSequence()
 *   FourthWallBreaks.stopSequence()
 *   FourthWallBreaks.memory.set("ignored_warning", true)
 *   FourthWallBreaks.setMemory("seen_face", true)
 *   FourthWallBreaks.fakeDamage(0, 9999)
 *   FourthWallBreaks.corruptBattleLog(0.25, 3)
 *   FourthWallBreaks.setAudioCorruption({ pitchDrift: 0.08, volumeFlutter: 0.15, duration: 300 })
 *   FourthWallBreaks.glitchNextMessage(0.25, 1)
 *
 * Built-in sequence names:
 *   Subtle Warning
 *   Reality Fracture
 *   Full Breach
 *   Boss Break
 *   Player Spotted
 *   System Failure
 *
 * Note tags supported on maps, events, enemies, skills, states, actors/classes:
 *   <FWBStage: 2>
 *   <FourthWallStage: 3>
 *   <FWBPulse>
 *   <FWBPulse: 60,0.5>
 *   <FWBFlash>
 *   <FWBSequence: Reality Fracture>
 *   <FWBBreach: 10>
 *   <FWBGlitch: 0.25>
 *   <FWBPresence: 50>
 *   <FWBAddPresence: 10>
 *   <FWBNarrativeState: hostile>
 *   <FWBMemory: ignored_warning=true>
 *   <FWBMemoryAdd: warnings_seen,1>
 *   <FWBFlag: player_watched>
 *   <FWBAudioCorruption: pitchDrift=0.08,volumeFlutter=0.15,duration=300>
 *   <FWBCommonEvent: 12>
 *   <FWBForbiddenRoom>
 *   <FWBMapEnterStage: 2>
 *   <FWBMapEnterSequence: Reality Fracture>
 *   <FWBOnAppearStage: 2>        enemy note
 *   <FWBAwareEnemy>               enemy note; marks enemy as player-aware
 *   <FWBAwarenessStage: 3>        enemy awareness crack stage
 *   <FWBAwarenessMessage: You are not supposed to be here.>
 *   <FWBAwarenessPresence: 10>
 *   <FWBStage90: 1>              enemy HP <= 90%
 *   <FWBStage75: 2>              enemy HP <= 75%
 *   <FWBStage50: 3>              enemy HP <= 50%
 *   <FWBStage25: 4>              enemy HP <= 25%
 *   <FWBStage10: 4>              enemy HP <= 10%
 *   <FWBSkillCrack: 2>           skill/item note
 *   <FWBSkillPulse>
 *   <FWBDeathCrack: 3>           actor/enemy note
 *   <FWBRegion13Stage: 2>        map note; triggers on region 13
 *   <FWBRegion13Pulse>
 *   <FWBRegion13Clear>
 *   <FWBRegion13Breach: 10>
 *   <FWBRegion13Sequence: Boss Break>
 *   <FWBRegion13Glitch: 0.25>
 *   <FWBRegion13CommonEvent: 5>
 *
 * Message tokens supported in Play 4th Wall Break and sequence message steps:
 *   {player} {saves} {loads} {deaths} {menus} {stage} {breach} {presence} {presenceTier} {narrative}
 *   {memory:key} {flag:key}
 *
 * Custom sequence step actions:
 *   stage, escalate, reduce, clear, pulse, flash, glitch, speaker, message,
 *   breach, presence, commonEvent, lockInput, unlockInput, narrative, memory,
 *   memoryAdd, clearMemory, flag, clearFlag, fakeDamage, fakeHeal, battleLog,
 *   audioCorruption, clearAudioCorruption, wait, emit, sequence, stopSequence
 *
 * Conditional sequence fields:
 *   if, unless, chance, chancePercent, once, cooldown, cooldownScope, id
 *   once values: true/save, session, sequence
 *   cooldownScope values: save, session, sequence
 *
 * Safe save/load illusions only. This plugin does not alter real save files except
 * for normal RPG Maker saved game data containing its own state.
 *
 * Compatibility notes:
 *   - Designed for RPG Maker MZ.
 *   - Uses aliases instead of overwriting most core methods.
 *   - If another plugin draws its own command windows, menu corruption may not affect it.
 *   - Disable heavy effects through plugin parameters or Set Accessibility command.
 *
 * @param Stage1Image
 * @text Stage 1 Image
 * @type file
 * @dir img/pictures
 * @default FourthWall_01_HairlineFracture
 *
 * @param Stage2Image
 * @text Stage 2 Image
 * @type file
 * @dir img/pictures
 * @default FourthWall_02_RealityCrack
 *
 * @param Stage3Image
 * @text Stage 3 Image
 * @type file
 * @dir img/pictures
 * @default FourthWall_03_ScreenShatter
 *
 * @param Stage4Image
 * @text Stage 4 Image
 * @type file
 * @dir img/pictures
 * @default FourthWall_04_FullBreach
 *
 * @param DefaultCrackMode
 * @text Default Crack Mode
 * @type select
 * @option replace
 * @option stack
 * @option hybrid
 * @default hybrid
 *
 * @param OverlayLayer
 * @text Overlay Layer
 * @type select
 * @option top
 * @option belowWindows
 * @option belowPictures
 * @default top
 *
 * @param PersistOnMap
 * @type boolean
 * @default true
 *
 * @param PersistInBattle
 * @type boolean
 * @default true
 *
 * @param PersistInMenu
 * @type boolean
 * @default true
 *
 * @param PersistInSaveLoad
 * @type boolean
 * @default true
 *
 * @param ClearAfterBattle
 * @type boolean
 * @default false
 *
 * @param BindBreachToStage
 * @type boolean
 * @default true
 *
 * @param BreachStage1
 * @text Breach Stage 1 Threshold
 * @type number
 * @default 25
 *
 * @param BreachStage2
 * @text Breach Stage 2 Threshold
 * @type number
 * @default 50
 *
 * @param BreachStage3
 * @text Breach Stage 3 Threshold
 * @type number
 * @default 75
 *
 * @param BreachStage4
 * @text Breach Stage 4 Threshold
 * @type number
 * @default 95
 *
 * @param StageVariableId
 * @text Current Stage Variable
 * @type variable
 * @default 0
 *
 * @param BreachVariableId
 * @text Breach Meter Variable
 * @type variable
 * @default 0
 *
 * @param TotalBreaksVariableId
 * @text Total Breaks Variable
 * @type variable
 * @default 0
 *
 * @param PresenceVariableId
 * @text Presence Meter Variable
 * @type variable
 * @default 0
 *
 * @param PresenceTierVariableId
 * @text Presence Tier Variable
 * @type variable
 * @default 0
 * @desc 0 Dormant, 1 Aware, 2 Interactive, 3 Hostile.
 *
 * @param BindPresenceToStage
 * @text Bind Presence To Stage
 * @type boolean
 * @default false
 *
 * @param PresenceStageMode
 * @text Presence Stage Binding Mode
 * @type select
 * @option minimum
 * @option exact
 * @option off
 * @default minimum
 *
 * @param BindPresenceToBreach
 * @text Bind Presence To Breach
 * @type boolean
 * @default false
 *
 * @param PresenceToBreachMultiplier
 * @text Presence To Breach Multiplier
 * @type number
 * @decimals 2
 * @default 1
 *
 * @param PresenceStage1
 * @text Presence Stage 1 Threshold
 * @type number
 * @default 25
 *
 * @param PresenceStage2
 * @text Presence Stage 2 Threshold
 * @type number
 * @default 50
 *
 * @param PresenceStage3
 * @text Presence Stage 3 Threshold
 * @type number
 * @default 75
 *
 * @param PresenceStage4
 * @text Presence Stage 4 Threshold
 * @type number
 * @default 95
 *
 * @param PresenceDormantCommonEvent
 * @text Presence Dormant Common Event
 * @type common_event
 * @default 0
 *
 * @param PresenceAwareCommonEvent
 * @text Presence Aware Common Event
 * @type common_event
 * @default 0
 *
 * @param PresenceInteractiveCommonEvent
 * @text Presence Interactive Common Event
 * @type common_event
 * @default 0
 *
 * @param PresenceHostileCommonEvent
 * @text Presence Hostile Common Event
 * @type common_event
 * @default 0
 *
 * @param PresenceDecayEnabled
 * @text Presence Decay Enabled
 * @type boolean
 * @default false
 *
 * @param PresenceDecayFrames
 * @text Presence Decay Frames
 * @type number
 * @default 900
 *
 * @param PresenceDecayAmount
 * @text Presence Decay Amount
 * @type number
 * @default 1
 *
 * @param PresenceDecayFloor
 * @text Presence Decay Floor
 * @type number
 * @default 0
 *
 * @param ActiveSwitchId
 * @text Active Crack Switch
 * @type switch
 * @default 0
 *
 * @param FullBreachSwitchId
 * @text Full Breach Switch
 * @type switch
 * @default 0
 *
 * @param Stage1CommonEvent
 * @type common_event
 * @default 0
 *
 * @param Stage2CommonEvent
 * @type common_event
 * @default 0
 *
 * @param Stage3CommonEvent
 * @type common_event
 * @default 0
 *
 * @param Stage4CommonEvent
 * @type common_event
 * @default 0
 *
 * @param ClearCommonEvent
 * @type common_event
 * @default 0
 *
 * @param RandomSubtleEnabled
 * @type boolean
 * @default false
 *
 * @param RandomMinCooldownFrames
 * @type number
 * @default 900
 *
 * @param RandomMaxCooldownFrames
 * @type number
 * @default 3600
 *
 * @param RandomStageMax
 * @text Random Max Stage
 * @type number
 * @min 1
 * @max 4
 * @default 1
 *
 * @param IdleTriggerFrames
 * @type number
 * @default 3600
 *
 * @param IdleTriggerStage
 * @type number
 * @min 0
 * @max 4
 * @default 1
 *
 * @param RepeatedInteractionThreshold
 * @type number
 * @default 5
 *
 * @param RepeatedInteractionStage
 * @type number
 * @min 0
 * @max 4
 * @default 1
 *
 * @param RegionRulesJson
 * @text Region Rules JSON
 * @type note
 * @default []
 * @desc Example: [{"regionId":13,"action":"stage","stage":2},{"regionId":14,"action":"sequence","sequenceName":"Boss Break"},{"regionId":15,"action":"commonEvent","id":5}]
 *
 * @param StageProfilesJson
 * @text Stage Profiles Override JSON
 * @type note
 * @default []
 * @desc Optional array of overrides. Example: [{"stage":2,"opacity":160,"shake":3,"blendMode":"screen"}]
 *
 * @param ReduceFlashing
 * @type boolean
 * @default false
 *
 * @param ReduceScreenShake
 * @type boolean
 * @default false
 *
 * @param DisableFlicker
 * @type boolean
 * @default false
 *
 * @param DisableAudioDistortion
 * @type boolean
 * @default false
 *
 * @param DisableStage4
 * @text Disable Full-Screen Stage 4
 * @type boolean
 * @default false
 *
 * @param MaxOverlayOpacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param MenuCorruptionStage
 * @type number
 * @min 0
 * @max 4
 * @default 3
 *
 * @param SaveLoadCorruptionStage
 * @type number
 * @min 0
 * @max 4
 * @default 3
 *
 * @param DisableControlDistortion
 * @text Disable Control Distortion
 * @type boolean
 * @default false
 *
 * @param MaxUiCorruptionLevel
 * @text Max UI Corruption Level
 * @type number
 * @min 0
 * @max 4
 * @default 4
 *
 * @param FakeSystemEnabled
 * @text Fake System Messages Enabled
 * @type boolean
 * @default true
 *
 * @param NarrativeStateVariableId
 * @text Narrative State Variable
 * @type variable
 * @default 0
 * @desc Stores the current narrative state string.
 *
 * @param BattleBreakEnabled
 * @text Battle Break Effects Enabled
 * @type boolean
 * @default true
 *
 * @param AudioCorruptionEnabled
 * @text Audio Corruption Enabled
 * @type boolean
 * @default true
 *
 * @param AudioCorruptionMaxPitchDrift
 * @text Max Audio Pitch Drift
 * @type number
 * @decimals 2
 * @default 0.12
 *
 * @param AudioCorruptionMaxVolumeFlutter
 * @text Max Audio Volume Flutter
 * @type number
 * @decimals 2
 * @default 0.30
 *
 * @param AudioCorruptionMaxDropoutChance
 * @text Max Audio Dropout Chance
 * @type number
 * @decimals 2
 * @default 0.25
 *
 * @param DebugMode
 * @type boolean
 * @default false
 *
 * @param DebugOverlay
 * @type boolean
 * @default false
 *
 * @command SetCrackStage
 * @text Set Crack Stage
 * @arg stage
 * @type number
 * @min 0
 * @max 4
 * @default 1
 * @arg fadeFrames
 * @type number
 * @default 45
 * @arg force
 * @type boolean
 * @default false
 *
 * @command EscalateCrack
 * @text Escalate Crack
 * @arg amount
 * @type number
 * @default 1
 * @arg fadeFrames
 * @type number
 * @default 35
 *
 * @command ReduceCrackStage
 * @text Reduce Crack Stage
 * @arg amount
 * @type number
 * @default 1
 * @arg fadeFrames
 * @type number
 * @default 45
 *
 * @command ClearCracks
 * @text Clear Crack
 * @arg fadeFrames
 * @type number
 * @default 60
 *
 * @command PulseCrack
 * @text Pulse Crack
 * @arg duration
 * @type number
 * @default 60
 * @arg intensity
 * @type number
 * @decimals 2
 * @default 0.5
 *
 * @command FlashCrack
 * @text Flash Crack
 * @arg duration
 * @type number
 * @default 24
 * @arg opacity
 * @type number
 * @min 0
 * @max 255
 * @default 160
 *
 * @command LockCrackStage
 * @text Lock Crack Stage
 *
 * @command UnlockCrackStage
 * @text Unlock Crack Stage
 *
 * @command SetCrackMode
 * @text Set Crack Mode
 * @arg mode
 * @type select
 * @option replace
 * @option stack
 * @option hybrid
 * @default hybrid
 *

 * @command LockInput
 * @text Lock Input
 * @arg frames
 * @type number
 * @min 1
 * @default 60
 *
 * @command UnlockInput
 * @text Unlock Input
 *
 * @command LockBreachMeter
 * @text Lock Breach Meter
 *
 * @command UnlockBreachMeter
 * @text Unlock Breach Meter
 *
 * @command RegisterSequence
 * @text Register Custom Sequence
 * @arg sequenceName
 * @type string
 * @default Custom Break
 * @arg customJson
 * @type note
 * @default []
 *
 * @command QueueBreakSequence
 * @text Queue Break Sequence
 * @arg sequenceName
 * @type string
 * @default Reality Fracture
 * @arg customJson
 * @type note
 * @default
 *
 * @command PauseSequence
 * @text Pause Active Sequence
 *
 * @command ResumeSequence
 * @text Resume Active Sequence
 *
 * @command StopSequence
 * @text Stop Active Sequence
 * @arg clearQueue
 * @type boolean
 * @default false
 *
 * @command ClearSequenceMemory
 * @text Clear Sequence Memory
 * @arg prefix
 * @type string
 * @default
 *
 * @command ValidateSequence
 * @text Validate Sequence JSON
 * @arg customJson
 * @type note
 * @default []
 *
 * @command RunBreakSequence
 * @text Run Break Sequence
 * @arg sequenceName
 * @type select
 * @option Subtle Warning
 * @option Reality Fracture
 * @option Full Breach
 * @option Boss Break
 * @option Player Spotted
 * @option System Failure
 * @default Reality Fracture
 * @arg customJson
 * @type note
 * @default
 *
 * @command AddBreachMeter
 * @text Add Breach Meter
 * @arg amount
 * @type number
 * @min -100
 * @max 100
 * @default 10
 *
 * @command SetBreachMeter
 * @text Set Breach Meter
 * @arg value
 * @type number
 * @min 0
 * @max 100
 * @default 50
 *
 * @command RepairScreen
 * @text Repair Screen
 * @arg mode
 * @type select
 * @option oneStage
 * @option clear
 * @default oneStage
 * @arg fadeFrames
 * @type number
 * @default 60
 *
 * @command GlitchNextMessage
 * @text Glitch Next Message
 * @arg amount
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.2
 * @arg lines
 * @type number
 * @default 1
 * @arg symbols
 * @type string
 * @default @#$%&?!<>/\\[]{}=+*0123456789
 *
 * @command GlitchSpeakerName
 * @text Glitch Speaker Name
 * @arg amount
 * @type number
 * @decimals 2
 * @default 0.35
 * @arg uses
 * @type number
 * @default 1
 *
 * @command PlayBreakMoment
 * @text Play 4th Wall Break
 * @arg breakId
 * @type string
 * @default
 * @arg severity
 * @type number
 * @min 0
 * @max 4
 * @default 1
 * @arg type
 * @type select
 * @option stare
 * @option whisper
 * @option dialogue
 * @option battleInterrupt
 * @option saveAware
 * @option menuAware
 * @option deathBreak
 * @option bossBreach
 * @option randomSubtle
 * @default dialogue
 * @arg speakerName
 * @type string
 * @default
 * @arg messageText
 * @type multiline_string
 * @default
 * @arg faceEventId
 * @type number
 * @default 0
 * @arg addBreach
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * @arg addPresence
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * @arg oneShot
 * @type boolean
 * @default false
 *
 * @command SetPresence
 * @text Set Presence
 * @arg value
 * @type number
 * @min 0
 * @max 100
 * @default 50
 *
 * @command AddPresence
 * @text Add Presence
 * @arg amount
 * @type number
 * @min -100
 * @max 100
 * @default 10
 *
 * @command ClearPresence
 * @text Clear Presence
 *
 * @command SetPresenceDecay
 * @text Set Presence Decay
 * @arg enabled
 * @type boolean
 * @default true
 * @arg amount
 * @type number
 * @default 1
 * @arg frames
 * @type number
 * @default 900
 * @arg floor
 * @type number
 * @default 0
 *
 * @command SetNarrativeState
 * @text Set Narrative State
 * @arg stateName
 * @type string
 * @default neutral
 *
 * @command SetRandomSubtle
 * @text Set Random Subtle Events
 * @arg enabled
 * @type boolean
 * @default true
 *
 * @command SetAccessibility
 * @text Set Accessibility Overrides
 * @arg reduceFlashing
 * @type boolean
 * @default false
 * @arg reduceScreenShake
 * @type boolean
 * @default false
 * @arg disableFlicker
 * @type boolean
 * @default false
 * @arg disableStage4
 * @type boolean
 * @default false
 * @arg maxOverlayOpacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @command RegisterTrigger
 * @text Register Trigger
 * @arg triggerId
 * @type string
 * @default
 * @arg condition
 * @type string
 * @default presence GTE 75
 * @arg action
 * @type select
 * @option stage
 * @option sequence
 * @option message
 * @option breach
 * @option presence
 * @option pulse
 * @option flash
 * @option glitch
 * @option commonEvent
 * @option lockInput
 * @option setNarrativeState
 * @option uiCorruption
 * @option fakeSystemMessage
 * @default sequence
 * @arg value
 * @type string
 * @default System Failure
 * @arg cooldown
 * @type number
 * @default 0
 * @arg once
 * @type boolean
 * @default false
 * @arg scope
 * @type select
 * @option global
 * @option map
 * @option battle
 * @option menu
 * @option file
 * @default global
 *
 * @command ClearTriggers
 * @text Clear Triggers
 * @arg scope
 * @type string
 * @default
 *
 * @command SetControlDistortion
 * @text Set Control Distortion
 * @arg duration
 * @type number
 * @default 180
 * @arg invertX
 * @type boolean
 * @default false
 * @arg invertY
 * @type boolean
 * @default false
 * @arg driftChance
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0
 * @arg randomBlockChance
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0
 * @arg delayFrames
 * @type number
 * @min 0
 * @default 0
 * @arg forceDirection
 * @type number
 * @min 0
 * @max 8
 * @default 0
 *
 * @command ClearControlDistortion
 * @text Clear Control Distortion
 *
 * @command SetUiCorruption
 * @text Set UI Corruption
 * @arg level
 * @type number
 * @min 0
 * @max 4
 * @default 1
 * @arg duration
 * @type number
 * @default 0
 *
 * @command ClearUiCorruption
 * @text Clear UI Corruption
 *
 * @command FakeSystemMessage
 * @text Fake System Message
 * @arg text
 * @type multiline_string
 * @default Runtime integrity warning.
 * @arg speaker
 * @type string
 * @default SYSTEM
 *
 * @command FakeSaveFailure
 * @text Fake Save Failure
 * @arg text
 * @type multiline_string
 * @default Save failed. File integrity compromised.
 *
 * @command FakeOptionChange
 * @text Fake Option Change
 * @arg optionName
 * @type string
 * @default Volume
 * @arg fakeValue
 * @type string
 * @default ???
 *
 * @command SetMemory
 * @text Set Memory Value
 * @arg key
 * @type string
 * @default key
 * @arg value
 * @type string
 * @default true
 *
 * @command AddMemory
 * @text Add Memory Value
 * @arg key
 * @type string
 * @default counter
 * @arg amount
 * @type number
 * @default 1
 *
 * @command ClearMemory
 * @text Clear Memory Value
 * @arg key
 * @type string
 * @default
 *
 * @command SetFlag
 * @text Set Flag
 * @arg key
 * @type string
 * @default flag
 * @arg value
 * @type boolean
 * @default true
 *
 * @command ClearFlag
 * @text Clear Flag
 * @arg key
 * @type string
 * @default flag
 *
 * @command FakeBattleDamage
 * @text Fake Battle Damage
 * @arg targetIndex
 * @type number
 * @default 0
 * @arg amount
 * @type number
 * @default 9999
 * @arg text
 * @type string
 * @default
 *
 * @command FakeBattleHeal
 * @text Fake Battle Heal
 * @arg targetIndex
 * @type number
 * @default 0
 * @arg amount
 * @type number
 * @default 9999
 * @arg text
 * @type string
 * @default
 *
 * @command CorruptBattleLog
 * @text Corrupt Battle Log
 * @arg amount
 * @type number
 * @decimals 2
 * @default 0.25
 * @arg lines
 * @type number
 * @default 3
 *
 * @command SetAudioCorruption
 * @text Set Audio Corruption
 * @arg pitchDrift
 * @type number
 * @decimals 2
 * @default 0.06
 * @arg volumeFlutter
 * @type number
 * @decimals 2
 * @default 0.12
 * @arg dropoutChance
 * @type number
 * @decimals 2
 * @default 0
 * @arg wrongSeChance
 * @type number
 * @decimals 2
 * @default 0
 * @arg duration
 * @type number
 * @default 300
 *
 * @command ClearAudioCorruption
 * @text Clear Audio Corruption
 *
 * @command DebugAction
 * @text Debug Action
 * @arg action
 * @type select
 * @option printState
 * @option testStage1
 * @option testStage2
 * @option testStage3
 * @option testStage4
 * @option testPulse
 * @option testSequence
 * @option clear
 * @option resetMemory
 * @default printState
 *
 * @command ForceSync
 * @text Sync Variables/Switches Now
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "FourthWallBreaks";
    const VERSION = "4.9.0";
    const params = PluginManager.parameters(PLUGIN_NAME) || {};
    const root = (typeof window !== "undefined") ? window : globalThis;
    const FWB = root.FourthWallBreaks = root.FourthWallBreaks || {};

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    function pString(name, def) {
        const value = params[name];
        return value !== undefined && value !== null && value !== "" ? String(value) : def;
    }

    function pNumber(name, def) {
        const value = Number(params[name]);
        return Number.isFinite(value) ? value : def;
    }

    function pBool(name, def) {
        const value = params[name];
        if (value === undefined || value === null || value === "") return !!def;
        return String(value).toLowerCase() === "true";
    }

    function argString(args, name, def) {
        const value = args ? args[name] : undefined;
        return value !== undefined && value !== null && value !== "" ? String(value) : def;
    }

    function argNumber(args, name, def) {
        const value = Number(args ? args[name] : undefined);
        return Number.isFinite(value) ? value : def;
    }

    function argBool(args, name, def) {
        const value = args ? args[name] : undefined;
        if (value === undefined || value === null || value === "") return !!def;
        return String(value).toLowerCase() === "true";
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    function randomInt(min, max) {
        return Math.floor(randomRange(min, max + 1));
    }

    function tryParseJson(value, def) {
        if (value === undefined || value === null || value === "") return def;
        try {
            let parsed = JSON.parse(String(value));
            if (typeof parsed === "string") parsed = JSON.parse(parsed);
            return parsed;
        } catch (e) {
            console.warn(`[${PLUGIN_NAME}] Could not parse JSON parameter:`, value, e);
            return def;
        }
    }

    function parseJsonParam(name, def) {
        return tryParseJson(params[name], def);
    }

    function logDebug() {
        if (!Settings.debugMode) return;
        console.log.apply(console, [`[${PLUGIN_NAME}]`].concat(Array.prototype.slice.call(arguments)));
    }

    function currentSceneName() {
        const scene = SceneManager && SceneManager._scene;
        return scene && scene.constructor ? scene.constructor.name : "";
    }

    function safeReserveCommonEvent(id) {
        id = Number(id || 0);
        if (id > 0 && root.$gameTemp && $gameTemp.reserveCommonEvent) {
            $gameTemp.reserveCommonEvent(id);
        }
    }

    function noteText(obj) {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        return String(obj.note || "");
    }

    function escapeRegExp(text) {
        return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function noteValue(note, names) {
        note = String(note || "");
        names = Array.isArray(names) ? names : [names];
        const pattern = names.map(escapeRegExp).join("|");
        const re = new RegExp(`<\\s*(?:${pattern})\\s*:\\s*([^>]+)>`, "i");
        const match = re.exec(note);
        return match ? String(match[1]).trim() : null;
    }

    function noteFlag(note, names) {
        note = String(note || "");
        names = Array.isArray(names) ? names : [names];
        const pattern = names.map(escapeRegExp).join("|");
        const re = new RegExp(`<\\s*(?:${pattern})\\s*>`, "i");
        return re.test(note);
    }

    function pageCommentText(event) {
        if (!event || !event.page || !event.page()) return "";
        const page = event.page();
        if (!page || !Array.isArray(page.list)) return "";
        return page.list
            .filter(cmd => cmd && (cmd.code === 108 || cmd.code === 408))
            .map(cmd => String(cmd.parameters && cmd.parameters[0] || ""))
            .join("\n");
    }

    function removePictureExtension(name) {
        return String(name || "").replace(/\.png$/i, "");
    }

    function profileBlendMode(value) {
        const v = String(value || "normal").toLowerCase();
        const blend = root.PIXI && PIXI.BLEND_MODES ? PIXI.BLEND_MODES : null;
        if (!blend) return 0;
        if (v === "add" || v === "additive") return blend.ADD;
        if (v === "screen") return blend.SCREEN !== undefined ? blend.SCREEN : blend.ADD;
        if (v === "multiply") return blend.MULTIPLY !== undefined ? blend.MULTIPLY : blend.NORMAL;
        if (v === "overlay") return blend.OVERLAY !== undefined ? blend.OVERLAY : blend.NORMAL;
        return blend.NORMAL;
    }

    function fitSpriteToScreen(sprite, cover) {
        if (!sprite || !sprite.bitmap || !sprite.bitmap.isReady || !sprite.bitmap.isReady()) return;
        const bw = Math.max(1, sprite.bitmap.width || 1);
        const bh = Math.max(1, sprite.bitmap.height || 1);
        const sx = Graphics.width / bw;
        const sy = Graphics.height / bh;
        const scale = cover ? Math.max(sx, sy) : Math.min(sx, sy);
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }

    function sceneKind(scene) {
        const name = scene && scene.constructor ? scene.constructor.name : "";
        if (name === "Scene_Map") return "map";
        if (name === "Scene_Battle") return "battle";
        if (/Scene_(Save|Load|File)/.test(name)) return "file";
        if (/Scene_(Menu|Item|Skill|Equip|Status|Options|GameEnd|Shop|Name)/.test(name)) return "menu";
        return "other";
    }

    // -------------------------------------------------------------------------
    // Settings and defaults
    // -------------------------------------------------------------------------

    const DEFAULT_PROFILES = {
        1: {
            stage: 1,
            name: "Hairline Fracture",
            image: "FourthWall_01_HairlineFracture",
            opacity: 85,
            fadeIn: 45,
            fadeOut: 60,
            blendMode: "normal",
            shake: 0,
            shakeDuration: 0,
            flicker: 0.025,
            flashOpacity: 0,
            flashDuration: 0,
            scale: 1.0,
            randomScale: 0.02,
            randomRotation: 0.01,
            randomOffset: 8,
            randomFlip: true,
            chromatic: false,
            chromaticOffset: 2,
            presenceGain: 1,
            scanlines: 0,
            staticNoise: 0,
            inputLock: 0,
            messageGlitch: 0,
            se: "",
            volume: 70,
            pitch: 100,
            pan: 0
        },
        2: {
            stage: 2,
            name: "Reality Crack",
            image: "FourthWall_02_RealityCrack",
            opacity: 145,
            fadeIn: 35,
            fadeOut: 55,
            blendMode: "normal",
            shake: 1.5,
            shakeDuration: 18,
            flicker: 0.045,
            flashOpacity: 60,
            flashDuration: 14,
            scale: 1.0,
            randomScale: 0.035,
            randomRotation: 0.02,
            randomOffset: 12,
            randomFlip: true,
            chromatic: false,
            chromaticOffset: 2,
            presenceGain: 2,
            scanlines: 0,
            staticNoise: 0.01,
            inputLock: 0,
            messageGlitch: 0.03,
            se: "",
            volume: 75,
            pitch: 100,
            pan: 0
        },
        3: {
            stage: 3,
            name: "Screen Shatter",
            image: "FourthWall_03_ScreenShatter",
            opacity: 190,
            fadeIn: 30,
            fadeOut: 60,
            blendMode: "screen",
            shake: 4,
            shakeDuration: 28,
            flicker: 0.075,
            flashOpacity: 110,
            flashDuration: 18,
            scale: 1.0,
            randomScale: 0.04,
            randomRotation: 0.025,
            randomOffset: 16,
            randomFlip: true,
            chromatic: true,
            chromaticOffset: 2,
            presenceGain: 4,
            scanlines: 0.08,
            staticNoise: 0.025,
            inputLock: 0,
            messageGlitch: 0.12,
            se: "",
            volume: 80,
            pitch: 96,
            pan: 0
        },
        4: {
            stage: 4,
            name: "Full Breach",
            image: "FourthWall_04_FullBreach",
            opacity: 235,
            fadeIn: 20,
            fadeOut: 90,
            blendMode: "screen",
            shake: 7,
            shakeDuration: 42,
            flicker: 0.12,
            flashOpacity: 190,
            flashDuration: 26,
            scale: 1.0,
            randomScale: 0.02,
            randomRotation: 0.015,
            randomOffset: 8,
            randomFlip: false,
            chromatic: true,
            chromaticOffset: 2,
            presenceGain: 8,
            scanlines: 0.16,
            staticNoise: 0.045,
            inputLock: 10,
            messageGlitch: 0.25,
            se: "",
            volume: 90,
            pitch: 90,
            pan: 0
        }
    };

    const Settings = {
        stageImages: {
            1: removePictureExtension(pString("Stage1Image", "FourthWall_01_HairlineFracture")),
            2: removePictureExtension(pString("Stage2Image", "FourthWall_02_RealityCrack")),
            3: removePictureExtension(pString("Stage3Image", "FourthWall_03_ScreenShatter")),
            4: removePictureExtension(pString("Stage4Image", "FourthWall_04_FullBreach"))
        },
        defaultCrackMode: pString("DefaultCrackMode", "hybrid").toLowerCase(),
        overlayLayer: pString("OverlayLayer", "top"),
        persistOnMap: pBool("PersistOnMap", true),
        persistInBattle: pBool("PersistInBattle", true),
        persistInMenu: pBool("PersistInMenu", true),
        persistInSaveLoad: pBool("PersistInSaveLoad", true),
        clearAfterBattle: pBool("ClearAfterBattle", false),
        bindBreachToStage: pBool("BindBreachToStage", true),
        breachThresholds: {
            1: pNumber("BreachStage1", 25),
            2: pNumber("BreachStage2", 50),
            3: pNumber("BreachStage3", 75),
            4: pNumber("BreachStage4", 95)
        },
        stageVariableId: pNumber("StageVariableId", 0),
        breachVariableId: pNumber("BreachVariableId", 0),
        totalBreaksVariableId: pNumber("TotalBreaksVariableId", 0),
        presenceVariableId: pNumber("PresenceVariableId", 0),
        presenceTierVariableId: pNumber("PresenceTierVariableId", 0),
        bindPresenceToStage: pBool("BindPresenceToStage", false),
        presenceStageMode: pString("PresenceStageMode", "minimum").toLowerCase(),
        bindPresenceToBreach: pBool("BindPresenceToBreach", false),
        presenceToBreachMultiplier: pNumber("PresenceToBreachMultiplier", 1),
        presenceThresholds: {
            1: pNumber("PresenceStage1", 25),
            2: pNumber("PresenceStage2", 50),
            3: pNumber("PresenceStage3", 75),
            4: pNumber("PresenceStage4", 95)
        },
        presenceCommonEvents: {
            dormant: pNumber("PresenceDormantCommonEvent", 0),
            aware: pNumber("PresenceAwareCommonEvent", 0),
            interactive: pNumber("PresenceInteractiveCommonEvent", 0),
            hostile: pNumber("PresenceHostileCommonEvent", 0)
        },
        presenceDecayEnabled: pBool("PresenceDecayEnabled", false),
        presenceDecayFrames: pNumber("PresenceDecayFrames", 900),
        presenceDecayAmount: pNumber("PresenceDecayAmount", 1),
        presenceDecayFloor: pNumber("PresenceDecayFloor", 0),
        activeSwitchId: pNumber("ActiveSwitchId", 0),
        fullBreachSwitchId: pNumber("FullBreachSwitchId", 0),
        commonEvents: {
            1: pNumber("Stage1CommonEvent", 0),
            2: pNumber("Stage2CommonEvent", 0),
            3: pNumber("Stage3CommonEvent", 0),
            4: pNumber("Stage4CommonEvent", 0),
            clear: pNumber("ClearCommonEvent", 0)
        },
        randomSubtleEnabled: pBool("RandomSubtleEnabled", false),
        randomMinCooldownFrames: pNumber("RandomMinCooldownFrames", 900),
        randomMaxCooldownFrames: pNumber("RandomMaxCooldownFrames", 3600),
        randomStageMax: clamp(pNumber("RandomStageMax", 1), 1, 4),
        idleTriggerFrames: pNumber("IdleTriggerFrames", 3600),
        idleTriggerStage: clamp(pNumber("IdleTriggerStage", 1), 0, 4),
        repeatedInteractionThreshold: pNumber("RepeatedInteractionThreshold", 5),
        repeatedInteractionStage: clamp(pNumber("RepeatedInteractionStage", 1), 0, 4),
        regionRules: parseJsonParam("RegionRulesJson", []),
        stageOverrides: parseJsonParam("StageProfilesJson", []),
        reduceFlashing: pBool("ReduceFlashing", false),
        reduceScreenShake: pBool("ReduceScreenShake", false),
        disableFlicker: pBool("DisableFlicker", false),
        disableAudioDistortion: pBool("DisableAudioDistortion", false),
        disableStage4: pBool("DisableStage4", false),
        maxOverlayOpacity: clamp(pNumber("MaxOverlayOpacity", 255), 0, 255),
        menuCorruptionStage: clamp(pNumber("MenuCorruptionStage", 3), 0, 4),
        saveLoadCorruptionStage: clamp(pNumber("SaveLoadCorruptionStage", 3), 0, 4),
        disableControlDistortion: pBool("DisableControlDistortion", false),
        maxUiCorruptionLevel: clamp(pNumber("MaxUiCorruptionLevel", 4), 0, 4),
        fakeSystemEnabled: pBool("FakeSystemEnabled", true),
        narrativeStateVariableId: pNumber("NarrativeStateVariableId", 0),
        battleBreakEnabled: pBool("BattleBreakEnabled", true),
        audioCorruptionEnabled: pBool("AudioCorruptionEnabled", true),
        audioCorruptionMaxPitchDrift: clamp(pNumber("AudioCorruptionMaxPitchDrift", 0.12), 0, 1),
        audioCorruptionMaxVolumeFlutter: clamp(pNumber("AudioCorruptionMaxVolumeFlutter", 0.30), 0, 1),
        audioCorruptionMaxDropoutChance: clamp(pNumber("AudioCorruptionMaxDropoutChance", 0.25), 0, 1),
        debugMode: pBool("DebugMode", false),
        debugOverlay: pBool("DebugOverlay", false)
    };

    const Profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
    for (let stage = 1; stage <= 4; stage++) {
        Profiles[stage].image = Settings.stageImages[stage] || Profiles[stage].image;
    }
    if (Array.isArray(Settings.stageOverrides)) {
        Settings.stageOverrides.forEach(override => {
            if (!override) return;
            const stage = clamp(Number(override.stage || override.id || 0), 1, 4);
            Profiles[stage] = Object.assign(Profiles[stage], override);
            if (override.image) Profiles[stage].image = removePictureExtension(override.image);
        });
    }


    // -------------------------------------------------------------------------
    // Phase 1 Core Architecture: Event Bus and Condition Engine
    // -------------------------------------------------------------------------

    const EventBus = {};

    FWB.on = function(eventName, handler) {
        eventName = String(eventName || "");
        if (!eventName || typeof handler !== "function") return handler;
        EventBus[eventName] = EventBus[eventName] || [];
        if (!EventBus[eventName].includes(handler)) EventBus[eventName].push(handler);
        return handler;
    };

    FWB.off = function(eventName, handler) {
        eventName = String(eventName || "");
        if (!EventBus[eventName]) return;
        EventBus[eventName] = EventBus[eventName].filter(fn => fn !== handler);
    };

    FWB.emit = function(eventName, payload) {
        eventName = String(eventName || "");
        const handlers = EventBus[eventName] || [];
        handlers.slice().forEach(handler => {
            try {
                handler(payload || {}, state());
            } catch (e) {
                if (Settings && Settings.debugMode) console.warn(`[${PLUGIN_NAME}] event handler failed: ${eventName}`, e);
            }
        });
    };

    function conditionContext() {
        const s = state();
        return {
            stage: Number(s.stage || 0),
            breach: Number(s.breachMeter || 0),
            breachMeter: Number(s.breachMeter || 0),
            presence: Number(s.presence || 0),
            saves: Number(s.trackers && s.trackers.saveCount || 0),
            loads: Number(s.trackers && s.trackers.loadCount || 0),
            deaths: Number(s.trackers && s.trackers.deathCount || 0),
            menus: Number(s.trackers && s.trackers.menuOpenCount || 0),
            idle: Number(s.trackers && s.trackers.idleFrames || 0),
            highestStage: Number(s.highestStage || 0),
            totalBreaks: Number(s.totalBreaks || 0),
            narrativeState: String(s.narrativeState || "neutral"),
            memory: s.memory || {},
            flag: s.flags || {},
            flags: s.flags || {}
        };
    }

    function resolveConditionValue(path, ctx) {
        path = String(path || "").trim();
        if (/^[-+]?\d+(?:\.\d+)?$/.test(path)) return Number(path);
        if (/^(true|false)$/i.test(path)) return /^true$/i.test(path);
        const quoted = /^(["'])(.*)\1$/.exec(path);
        if (quoted) return quoted[2];
        const parts = path.split(".");
        let value = ctx;
        for (let i = 0; i < parts.length; i++) {
            const key = parts[i];
            if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return undefined;
            value = value ? value[key] : undefined;
        }
        return value;
    }

    function evalSimpleCondition(expr, ctx) {
        expr = String(expr || "").trim();
        if (!expr) return true;
        if (expr[0] === "!") return !evalSimpleCondition(expr.slice(1), ctx);
        const match = /^(.*?)\s*(>=|<=|==|!=|>|<)\s*(.*?)$/.exec(expr);
        if (!match) return !!resolveConditionValue(expr, ctx);
        const left = resolveConditionValue(match[1], ctx);
        const right = resolveConditionValue(match[3], ctx);
        switch (match[2]) {
            case ">=": return Number(left) >= Number(right);
            case "<=": return Number(left) <= Number(right);
            case ">": return Number(left) > Number(right);
            case "<": return Number(left) < Number(right);
            case "==": return String(left) === String(right);
            case "!=": return String(left) !== String(right);
            default: return false;
        }
    }

    function normalizeConditionOperators(condition) {
        return String(condition || "")
            .replace(/\bGTE\b/gi, ">=")
            .replace(/\bLTE\b/gi, "<=")
            .replace(/\bGT\b/gi, ">")
            .replace(/\bLT\b/gi, "<")
            .replace(/\bEQ\b/gi, "==")
            .replace(/\bNEQ?\b/gi, "!=")
            .replace(/\bAND\b/gi, "&&")
            .replace(/\bOR\b/gi, "||");
    }

    FWB.evalCondition = function(condition) {
        condition = normalizeConditionOperators(String(condition || "").trim());
        if (!condition) return true;
        if (!/^[A-Za-z0-9_ .!<>=&|+\-"']+$/.test(condition)) {
            logDebug("unsafe condition rejected", condition);
            return false;
        }
        const ctx = conditionContext();
        try {
            return condition.split(/\s*\|\|\s*/).some(orPart => {
                return orPart.split(/\s*&&\s*/).every(andPart => evalSimpleCondition(andPart, ctx));
            });
        } catch (e) {
            logDebug("condition failed", condition, e);
            return false;
        }
    };

    const SEQUENCES = {
        "Subtle Warning": [
            { time: 0, action: "pulse", duration: 30, intensity: 0.2 },
            { time: 12, action: "stage", stage: 1, fadeFrames: 45 },
            { time: 54, action: "glitch", amount: 0.08, lines: 1 }
        ],
        "Reality Fracture": [
            { time: 0, action: "stage", stage: 1, fadeFrames: 45 },
            { time: 90, action: "pulse", duration: 42, intensity: 0.35 },
            { time: 150, action: "stage", stage: 2, fadeFrames: 35 },
            { time: 240, action: "flash", duration: 16, opacity: 110 },
            { time: 300, action: "stage", stage: 3, fadeFrames: 30 },
            { time: 350, action: "glitch", amount: 0.18, lines: 1 }
        ],
        "Full Breach": [
            { time: 0, action: "stage", stage: 1, fadeFrames: 25 },
            { time: 40, action: "stage", stage: 2, fadeFrames: 25 },
            { time: 90, action: "stage", stage: 3, fadeFrames: 25 },
            { time: 130, action: "pulse", duration: 60, intensity: 0.75 },
            { time: 160, action: "stage", stage: 4, fadeFrames: 20 },
            { time: 161, action: "flash", duration: 24, opacity: 210 },
            { time: 190, action: "glitch", amount: 0.35, lines: 2 }
        ],
        "Boss Break": [
            { time: 0, action: "stage", stage: 2, fadeFrames: 30 },
            { time: 60, action: "pulse", duration: 50, intensity: 0.45 },
            { time: 120, action: "stage", stage: 3, fadeFrames: 30 },
            { time: 180, action: "flash", duration: 20, opacity: 160 },
            { time: 210, action: "stage", stage: 4, fadeFrames: 20 }
        ],
        "Player Spotted": [
            { time: 0, action: "flash", duration: 10, opacity: 120 },
            { time: 5, action: "stage", stage: 1, fadeFrames: 20 },
            { time: 30, action: "pulse", duration: 40, intensity: 0.35 },
            { time: 70, action: "glitch", amount: 0.12, lines: 1 }
        ],
        "System Failure": [
            { time: 0, action: "stage", stage: 2, fadeFrames: 15 },
            { time: 15, action: "flash", duration: 8, opacity: 90 },
            { time: 45, action: "stage", stage: 0, fadeFrames: 8 },
            { time: 70, action: "stage", stage: 3, fadeFrames: 12 },
            { time: 95, action: "pulse", duration: 70, intensity: 0.85 },
            { time: 135, action: "stage", stage: 4, fadeFrames: 20 },
            { time: 170, action: "glitch", amount: 0.4, lines: 3 }
        ]
    };

    // -------------------------------------------------------------------------
    // Presence helpers
    // -------------------------------------------------------------------------

    function presenceTierLevel(value) {
        value = Number(value || 0);
        if (value >= Settings.presenceThresholds[3]) return 3;
        if (value >= Settings.presenceThresholds[2]) return 2;
        if (value >= Settings.presenceThresholds[1]) return 1;
        return 0;
    }

    function presenceTierName(value) {
        const level = presenceTierLevel(value);
        if (level >= 3) return "hostile";
        if (level >= 2) return "interactive";
        if (level >= 1) return "aware";
        return "dormant";
    }

    function stageFromPresence(value) {
        value = Number(value || 0);
        if (value >= Settings.presenceThresholds[4]) return 4;
        if (value >= Settings.presenceThresholds[3]) return 3;
        if (value >= Settings.presenceThresholds[2]) return 2;
        if (value >= Settings.presenceThresholds[1]) return 1;
        return 0;
    }

    function applyPresenceBindings(previousPresence, options) {
        const s = state();
        options = options || {};
        if (options.suppressPresenceBindings) return;
        if (Settings.bindPresenceToBreach) {
            const breachValue = clamp(Number(s.presence || 0) * Number(Settings.presenceToBreachMultiplier || 1), 0, 100);
            FWB.setBreach(breachValue, Object.assign({ count: false, source: "presence", force: options.forceBreach }, options));
        }
        if (Settings.bindPresenceToStage && Settings.presenceStageMode !== "off") {
            const targetStage = visibleStage(stageFromPresence(s.presence));
            if (Settings.presenceStageMode === "exact") {
                FWB.setStage(targetStage, { fadeFrames: options.fadeFrames || 35, count: false, source: "presence", suppressPresenceGain: true });
            } else if (targetStage > Number(s.stage || 0)) {
                FWB.setStage(targetStage, { fadeFrames: options.fadeFrames || 35, count: false, source: "presence", suppressPresenceGain: true });
            }
        }
    }

    function updatePresenceTier(previousPresence, options) {
        const s = state();
        const previousTier = String(s.presenceTier || presenceTierName(previousPresence));
        const nextTier = presenceTierName(s.presence);
        s.presenceTier = nextTier;
        if (previousTier !== nextTier) {
            safeReserveCommonEvent(Settings.presenceCommonEvents[nextTier]);
            FWB.emit("presenceTierChanged", { previousTier: previousTier, presenceTier: nextTier, presence: s.presence, options: options || {} });
        }
    }

    function presenceIntensity(multiplier) {
        return clamp((Number(state().presence || 0) / 100) * Number(multiplier || 1), 0, 1);
    }

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    function defaultState() {
        return {
            version: VERSION,
            stage: 0,
            targetStage: 0,
            mode: Settings.defaultCrackMode,
            locked: false,
            breachLocked: false,
            _syncDirty: true,
            cracks: [],
            nextCrackId: 1,
            breachMeter: 0,
            presence: 0,
            presenceTier: "dormant",
            presenceDecayCounter: 0,
            presenceDecayEnabled: Settings.presenceDecayEnabled,
            presenceDecayFrames: Settings.presenceDecayFrames,
            presenceDecayAmount: Settings.presenceDecayAmount,
            presenceDecayFloor: Settings.presenceDecayFloor,
            narrativeState: "neutral",
            narrativeHistory: [],
            memory: {},
            sessionMemory: {},
            flags: {},
            battleBreaks: { awareEnemies: {}, fakeLogLines: [], corruptLogAmount: 0, corruptLogLines: 0 },
            audioCorruption: { enabled: false, remaining: 0, pitchDrift: 0, volumeFlutter: 0, dropoutChance: 0, wrongSeChance: 0, sePool: [] },
            triggerRules: [],
            triggerOnce: {},
            triggerCooldowns: {},
            sessionTriggerOnce: {},
            sessionTriggerCooldowns: {},
            nextTriggerId: 1,
            lastTriggerId: "",
            controlDistortion: {
                enabled: false,
                remaining: 0,
                invertX: false,
                invertY: false,
                driftChance: 0,
                randomBlockChance: 0,
                delayFrames: 0,
                forceDirection: 0
            },
            controlDistortionQueue: [],
            uiCorruptionLevel: 0,
            uiCorruptionFrames: 0,
            fakeOptionOverrides: {},
            fakeSystemMessages: [],
            bindBreachToStage: Settings.bindBreachToStage,
            seenBreakIds: [],
            totalBreaks: 0,
            highestStage: 0,
            lastBreakId: "",
            characterSuspicion: {},
            trackers: {
                saveCount: 0,
                loadCount: 0,
                deathCount: 0,
                menuOpenCount: 0,
                idleFrames: 0,
                interactionCounts: {},
                mapVisits: {}
            },
            sequence: null,
            sequenceQueue: [],
            sequencePaused: false,
            sequenceMemory: { once: {}, cooldowns: {} },
            sequenceHistory: [],
            pulse: null,
            inputLockFrames: 0,
            textGlitchNext: null,
            speakerGlitchNext: null,
            randomSubtleEnabled: Settings.randomSubtleEnabled,
            randomCooldown: randomInt(Settings.randomMinCooldownFrames, Settings.randomMaxCooldownFrames),
            runtimeShakeFrames: 0,
            runtimeShakePower: 0,
            lastRegionId: 0,
            lastMapId: 0,
            processedTriggers: {},
            triggerCooldowns: {},
            accessibility: {
                reduceFlashing: Settings.reduceFlashing,
                reduceScreenShake: Settings.reduceScreenShake,
                disableFlicker: Settings.disableFlicker,
                disableAudioDistortion: Settings.disableAudioDistortion,
                disableStage4: Settings.disableStage4,
                maxOverlayOpacity: Settings.maxOverlayOpacity
            }
        };
    }

    const fallbackState = defaultState();

    function migrateState(s) {
        const def = defaultState();
        if (!s || typeof s !== "object") return def;
        Object.keys(def).forEach(key => {
            if (s[key] === undefined) s[key] = def[key];
        });
        s.version = VERSION;
        s.trackers = Object.assign(def.trackers, s.trackers || {});
        s.accessibility = Object.assign(def.accessibility, s.accessibility || {});
        if (!Array.isArray(s.cracks)) s.cracks = [];
        if (!Array.isArray(s.seenBreakIds)) s.seenBreakIds = [];
        if (!s.processedTriggers || typeof s.processedTriggers !== "object") s.processedTriggers = {};
        if (!Array.isArray(s.triggerRules)) s.triggerRules = [];
        if (!s.triggerOnce || typeof s.triggerOnce !== "object") s.triggerOnce = {};
        if (!s.triggerCooldowns || typeof s.triggerCooldowns !== "object") s.triggerCooldowns = {};
        if (!s.sessionTriggerOnce || typeof s.sessionTriggerOnce !== "object") s.sessionTriggerOnce = {};
        if (!s.sessionTriggerCooldowns || typeof s.sessionTriggerCooldowns !== "object") s.sessionTriggerCooldowns = {};
        if (!s.controlDistortion || typeof s.controlDistortion !== "object") s.controlDistortion = def.controlDistortion;
        if (!Array.isArray(s.controlDistortionQueue)) s.controlDistortionQueue = [];
        if (!s.fakeOptionOverrides || typeof s.fakeOptionOverrides !== "object") s.fakeOptionOverrides = {};
        if (!Array.isArray(s.fakeSystemMessages)) s.fakeSystemMessages = [];
        if (!s.triggerCooldowns || typeof s.triggerCooldowns !== "object") s.triggerCooldowns = {};
        if (!s.memory || typeof s.memory !== "object") s.memory = {};
        if (!s.sessionMemory || typeof s.sessionMemory !== "object") s.sessionMemory = {};
        if (!s.flags || typeof s.flags !== "object") s.flags = {};
        if (!Array.isArray(s.narrativeHistory)) s.narrativeHistory = [];
        if (!s.battleBreaks || typeof s.battleBreaks !== "object") s.battleBreaks = { awareEnemies: {}, fakeLogLines: [], corruptLogAmount: 0, corruptLogLines: 0 };
        if (!s.battleBreaks.awareEnemies || typeof s.battleBreaks.awareEnemies !== "object") s.battleBreaks.awareEnemies = {};
        if (!Array.isArray(s.battleBreaks.fakeLogLines)) s.battleBreaks.fakeLogLines = [];
        if (!s.audioCorruption || typeof s.audioCorruption !== "object") s.audioCorruption = defaultState().audioCorruption;
        if (!Array.isArray(s.sequenceQueue)) s.sequenceQueue = [];
        if (typeof s.sequencePaused !== "boolean") s.sequencePaused = false;
        if (!s.sequenceMemory || typeof s.sequenceMemory !== "object") s.sequenceMemory = { once: {}, cooldowns: {} };
        if (!s.sequenceMemory.once || typeof s.sequenceMemory.once !== "object") s.sequenceMemory.once = {};
        if (!s.sequenceMemory.cooldowns || typeof s.sequenceMemory.cooldowns !== "object") s.sequenceMemory.cooldowns = {};
        if (!Array.isArray(s.sequenceHistory)) s.sequenceHistory = [];
        if (!Number.isFinite(Number(s.presence))) s.presence = 0;
        if (!s.presenceTier) s.presenceTier = presenceTierName(s.presence);
        if (!Number.isFinite(Number(s.presenceDecayCounter))) s.presenceDecayCounter = 0;
        if (s.presenceDecayEnabled === undefined) s.presenceDecayEnabled = Settings.presenceDecayEnabled;
        if (!Number.isFinite(Number(s.presenceDecayFrames))) s.presenceDecayFrames = Settings.presenceDecayFrames;
        if (!Number.isFinite(Number(s.presenceDecayAmount))) s.presenceDecayAmount = Settings.presenceDecayAmount;
        if (!Number.isFinite(Number(s.presenceDecayFloor))) s.presenceDecayFloor = Settings.presenceDecayFloor;
        if (!s.narrativeState) s.narrativeState = "neutral";
        if (!Number.isFinite(Number(s.nextCrackId))) s.nextCrackId = 1;
        return s;
    }

    function state() {
        if (root.$gameSystem) {
            if (!$gameSystem._fourthWallBreaks) $gameSystem._fourthWallBreaks = defaultState();
            $gameSystem._fourthWallBreaks = migrateState($gameSystem._fourthWallBreaks);
            return $gameSystem._fourthWallBreaks;
        }
        return migrateState(fallbackState);
    }

    function access() {
        return state().accessibility || defaultState().accessibility;
    }

    function profile(stage) {
        stage = clamp(Number(stage || 0), 1, 4);
        return Profiles[stage] || Profiles[1];
    }

    function visibleStage(stage) {
        stage = clamp(Math.round(Number(stage || 0)), 0, 4);
        if (access().disableStage4 && stage > 3) return 3;
        return stage;
    }

    function maxOpacity(value) {
        return clamp(value, 0, access().maxOverlayOpacity !== undefined ? access().maxOverlayOpacity : 255);
    }

    function markSyncDirty() {
        state()._syncDirty = true;
    }

    function syncVariablesAndSwitches(force) {
        const s = state();
        if (!force && !s._syncDirty) return;
        s._syncDirty = false;

        if (root.$gameVariables) {
            if (Settings.stageVariableId > 0) $gameVariables.setValue(Settings.stageVariableId, s.stage);
            if (Settings.breachVariableId > 0) $gameVariables.setValue(Settings.breachVariableId, Math.round(s.breachMeter));
            if (Settings.totalBreaksVariableId > 0) $gameVariables.setValue(Settings.totalBreaksVariableId, s.totalBreaks);
            if (Settings.presenceVariableId > 0) $gameVariables.setValue(Settings.presenceVariableId, Math.round(s.presence || 0));
            if (Settings.presenceTierVariableId > 0) $gameVariables.setValue(Settings.presenceTierVariableId, presenceTierLevel(s.presence));
            if (Settings.narrativeStateVariableId > 0) $gameVariables.setValue(Settings.narrativeStateVariableId, String(s.narrativeState || "neutral"));
        }
        if (root.$gameSwitches) {
            if (Settings.activeSwitchId > 0) $gameSwitches.setValue(Settings.activeSwitchId, s.stage > 0);
            if (Settings.fullBreachSwitchId > 0) $gameSwitches.setValue(Settings.fullBreachSwitchId, s.stage >= 4);
        }
    }

    function rememberTrigger(key) {
        const s = state();
        if (s.processedTriggers[key]) return false;
        s.processedTriggers[key] = true;
        return true;
    }

    function clearTriggerPrefix(prefix) {
        const s = state();
        Object.keys(s.processedTriggers).forEach(key => {
            if (key.indexOf(prefix) === 0) delete s.processedTriggers[key];
        });
    }

    // -------------------------------------------------------------------------
    // Crack transitions
    // -------------------------------------------------------------------------

    function makeTransform(stage, randomize) {
        const p = profile(stage);
        const doRandom = randomize !== false;
        const rot = doRandom ? randomRange(-p.randomRotation, p.randomRotation) : 0;
        const offset = doRandom ? Number(p.randomOffset || 0) : 0;
        const scaleRand = doRandom ? Number(p.randomScale || 0) : 0;
        const flip = doRandom && p.randomFlip;
        return {
            rotation: rot,
            offsetX: randomRange(-offset, offset),
            offsetY: randomRange(-offset, offset),
            scale: Number(p.scale || 1) + randomRange(-scaleRand, scaleRand),
            flipX: flip ? Math.random() < 0.5 : false,
            flipY: flip ? Math.random() < 0.15 : false
        };
    }

    function makeCrack(stage, fadeFrames, options) {
        const s = state();
        const p = profile(stage);
        const transform = makeTransform(stage, options && options.randomize);
        const target = maxOpacity(Number((options && options.opacity) || p.opacity || 180));
        return {
            id: s.nextCrackId++,
            stage: stage,
            image: removePictureExtension((options && options.image) || p.image),
            opacity: 0,
            targetOpacity: target,
            fadeSpeed: Math.max(1, target / Math.max(1, Number(fadeFrames || p.fadeIn || 30))),
            removing: false,
            age: 0,
            blendMode: p.blendMode || "normal",
            rotation: transform.rotation,
            offsetX: transform.offsetX,
            offsetY: transform.offsetY,
            scale: transform.scale,
            flipX: transform.flipX,
            flipY: transform.flipY,
            chromatic: !!p.chromatic,
            flicker: Number(p.flicker || 0)
        };
    }

    function fadeOutCrack(crack, frames) {
        if (!crack) return;
        crack.targetOpacity = 0;
        crack.fadeSpeed = Math.max(1, Number(crack.opacity || 0) / Math.max(1, Number(frames || profile(crack.stage).fadeOut || 45)));
        crack.removing = true;
    }

    function stageOpacity(stage) {
        return maxOpacity(Number(profile(stage).opacity || 180));
    }

    function updateStackedCracks(newStage, fadeFrames, options) {
        const s = state();
        const mode = String(s.mode || Settings.defaultCrackMode || "replace").toLowerCase();
        const fade = Number(fadeFrames || profile(newStage || 1).fadeIn || 30);
        if (newStage <= 0) {
            s.cracks.forEach(crack => fadeOutCrack(crack, fade));
            return;
        }

        if (mode === "replace" || (mode === "hybrid" && newStage >= 4)) {
            s.cracks.forEach(crack => fadeOutCrack(crack, fade));
            s.cracks.push(makeCrack(newStage, fade, options));
            return;
        }

        // stack and hybrid stages 1-3: keep lower-stage cracks alive.
        for (let stage = 1; stage <= newStage; stage++) {
            let existing = s.cracks.find(crack => crack.stage === stage && !crack.removing);
            if (!existing) {
                s.cracks.push(makeCrack(stage, fade, options));
            } else {
                existing.targetOpacity = stageOpacity(stage);
                existing.fadeSpeed = Math.max(1, Math.abs(existing.targetOpacity - existing.opacity) / Math.max(1, fade));
                existing.removing = false;
            }
        }
        s.cracks.forEach(crack => {
            if (crack.stage > newStage) fadeOutCrack(crack, fade);
        });
    }

    function fireStageEffects(stage, previousStage, options) {
        const s = state();
        const p = stage > 0 ? profile(stage) : null;
        const fade = Number(options && options.fadeFrames || (p ? p.fadeIn : 30));

        if (stage > 0 && p) {
            if (p.se && options && options.sound !== false && root.AudioManager) {
                AudioManager.playSe({ name: p.se, volume: Number(p.volume || 80), pitch: Number(p.pitch || 100), pan: Number(p.pan || 0) });
            }
            if (!access().reduceScreenShake && Number(p.shake || 0) > 0) {
                const power = Number(p.shake || 0);
                const duration = Number(p.shakeDuration || 20);
                if (root.$gameScreen && $gameScreen.startShake) {
                    $gameScreen.startShake(power, 6, duration);
                }
                s.runtimeShakePower = Math.max(s.runtimeShakePower || 0, power);
                s.runtimeShakeFrames = Math.max(s.runtimeShakeFrames || 0, duration);
            }
            if (!access().reduceFlashing && Number(p.flashOpacity || 0) > 0 && options && options.flash !== false) {
                if (root.$gameScreen && $gameScreen.startFlash) {
                    $gameScreen.startFlash([255, 255, 255, Number(p.flashOpacity || 0)], Number(p.flashDuration || 16));
                }
            }
            if (Number(p.messageGlitch || 0) > 0 && options && options.glitchOnStage) {
                FWB.glitchNextMessage(Number(p.messageGlitch), 1);
            }
            if (Number(p.inputLock || 0) > 0) {
                s.inputLockFrames = Math.max(s.inputLockFrames || 0, Number(p.inputLock || 0));
            }
        }

        if (stage === 0 && previousStage > 0) {
            safeReserveCommonEvent(Settings.commonEvents.clear);
        } else if (stage > 0 && stage !== previousStage) {
            safeReserveCommonEvent(Settings.commonEvents[stage]);
        }
        markSyncDirty();
        logDebug("stage", previousStage, "->", stage, "fade", fade);
    }

    FWB.setStage = function(stage, options) {
        options = options || {};
        const s = state();
        if (s.locked && !options.force) return s.stage;
        stage = visibleStage(stage);
        const previous = s.stage || 0;
        s.targetStage = stage;
        s.stage = stage;
        if (stage > 0) {
            s.highestStage = Math.max(s.highestStage || 0, stage);
            if (options.count !== false && stage !== previous) s.totalBreaks += 1;
        }
        updateStackedCracks(stage, options.fadeFrames, options);
        fireStageEffects(stage, previous, options);
        if (stage > previous && !options.suppressPresenceGain && options.source !== "presence") {
            const gain = Number(profile(stage).presenceGain || 0);
            if (gain > 0) FWB.addPresence(gain, { source: "stage", suppressPresenceBindings: true });
        }
        if (stage !== previous) FWB.emit("stageChanged", { previousStage: previous, stage: stage, options: options });
        return s.stage;
    };

    FWB.escalate = function(amount, options) {
        const s = state();
        return FWB.setStage((s.stage || 0) + Number(amount || 1), options || {});
    };

    FWB.reduce = function(amount, options) {
        const s = state();
        return FWB.setStage((s.stage || 0) - Number(amount || 1), options || {});
    };

    FWB.clear = function(options) {
        options = options || {};
        return FWB.setStage(0, Object.assign({ fadeFrames: 60 }, options));
    };

    FWB.repair = function(mode, fadeFrames) {
        mode = String(mode || "oneStage");
        if (mode === "clear") return FWB.clear({ fadeFrames: fadeFrames || 60 });
        return FWB.reduce(1, { fadeFrames: fadeFrames || 60 });
    };

    FWB.pulse = function(duration, intensity) {
        const s = state();
        duration = Math.max(1, Number(duration || 60));
        intensity = Math.max(0, Number(intensity || 0.5));
        s.pulse = { duration: duration, remaining: duration, intensity: intensity };
        return s.pulse;
    };

    FWB.flash = function(duration, opacity) {
        if (access().reduceFlashing) return;
        if (root.$gameScreen && $gameScreen.startFlash) {
            $gameScreen.startFlash([255, 255, 255, clamp(Number(opacity || 160), 0, 255)], Math.max(1, Number(duration || 24)));
        }
    };

    FWB.lock = function() {
        state().locked = true;
        markSyncDirty();
    };

    FWB.unlock = function() {
        state().locked = false;
        markSyncDirty();
    };

    FWB.lockInput = function(frames) {
        const s = state();
        s.inputLockFrames = Math.max(s.inputLockFrames || 0, Math.max(1, Number(frames || 60)));
        FWB.emit("inputLocked", { frames: s.inputLockFrames });
    };

    FWB.unlockInput = function() {
        state().inputLockFrames = 0;
        FWB.emit("inputUnlocked", {});
    };

    FWB.lockBreach = function() {
        state().breachLocked = true;
        markSyncDirty();
    };

    FWB.unlockBreach = function() {
        state().breachLocked = false;
        markSyncDirty();
    };

    FWB.setMode = function(mode) {
        mode = String(mode || "hybrid").toLowerCase();
        if (!["replace", "stack", "hybrid"].includes(mode)) mode = "hybrid";
        state().mode = mode;
        markSyncDirty();
    };

    FWB.setRandomSubtle = function(enabled) {
        const s = state();
        s.randomSubtleEnabled = !!enabled;
        s.randomCooldown = randomInt(Settings.randomMinCooldownFrames, Settings.randomMaxCooldownFrames);
        markSyncDirty();
    };

    FWB.setAccessibility = function(options) {
        const s = state();
        s.accessibility = Object.assign(s.accessibility || {}, options || {});
        if (s.accessibility.maxOverlayOpacity !== undefined) {
            s.accessibility.maxOverlayOpacity = clamp(Number(s.accessibility.maxOverlayOpacity), 0, 255);
        }
        // Re-clamp existing crack targets.
        s.cracks.forEach(crack => {
            crack.targetOpacity = maxOpacity(crack.targetOpacity);
            crack.opacity = maxOpacity(crack.opacity);
        });
        markSyncDirty();
    };

    // -------------------------------------------------------------------------
    // Breach meter
    // -------------------------------------------------------------------------

    function stageFromBreach(value) {
        value = Number(value || 0);
        if (value >= Settings.breachThresholds[4]) return 4;
        if (value >= Settings.breachThresholds[3]) return 3;
        if (value >= Settings.breachThresholds[2]) return 2;
        if (value >= Settings.breachThresholds[1]) return 1;
        return 0;
    }

    FWB.setBreach = function(value, options) {
        const s = state();
        if (s.breachLocked && !(options && options.force)) return s.breachMeter;
        const previousBreach = Number(s.breachMeter || 0);
        s.breachMeter = clamp(Number(value || 0), 0, 100);
        if (s.bindBreachToStage) {
            const stage = stageFromBreach(s.breachMeter);
            FWB.setStage(stage, Object.assign({ count: false }, options || {}));
        }
        markSyncDirty();
        if (previousBreach !== s.breachMeter) FWB.emit("breachChanged", { previousBreach: previousBreach, breach: s.breachMeter, options: options || {} });
        return s.breachMeter;
    };

    FWB.addBreach = function(amount, options) {
        const s = state();
        return FWB.setBreach((s.breachMeter || 0) + Number(amount || 0), options || {});
    };



    // -------------------------------------------------------------------------
    // Presence and Narrative State
    // -------------------------------------------------------------------------

    FWB.setPresence = function(value, options) {
        const s = state();
        options = options || {};
        const previousPresence = Number(s.presence || 0);
        s.presence = clamp(Number(value || 0), 0, 100);
        updatePresenceTier(previousPresence, options);
        applyPresenceBindings(previousPresence, options);
        markSyncDirty();
        if (previousPresence !== s.presence) {
            FWB.emit("presenceChanged", {
                previousPresence: previousPresence,
                presence: s.presence,
                previousTier: presenceTierName(previousPresence),
                presenceTier: s.presenceTier,
                options: options
            });
        }
        return s.presence;
    };

    FWB.addPresence = function(amount, options) {
        const s = state();
        return FWB.setPresence((s.presence || 0) + Number(amount || 0), options || {});
    };

    FWB.getPresence = function() {
        return Number(state().presence || 0);
    };

    FWB.getPresenceTier = function(value) {
        return presenceTierName(value !== undefined ? value : state().presence);
    };

    FWB.getPresenceTierLevel = function(value) {
        return presenceTierLevel(value !== undefined ? value : state().presence);
    };

    FWB.clearPresence = function() {
        return FWB.setPresence(0);
    };

    FWB.setPresenceDecay = function(enabled, amount, frames, floor) {
        const s = state();
        s.presenceDecayEnabled = !!enabled;
        if (amount !== undefined) s.presenceDecayAmount = Math.max(0, Number(amount || 0));
        if (frames !== undefined) s.presenceDecayFrames = Math.max(1, Number(frames || 1));
        if (floor !== undefined) s.presenceDecayFloor = clamp(Number(floor || 0), 0, 100);
        s.presenceDecayCounter = 0;
        markSyncDirty();
        FWB.emit("presenceDecayChanged", { enabled: s.presenceDecayEnabled, amount: s.presenceDecayAmount, frames: s.presenceDecayFrames, floor: s.presenceDecayFloor });
        return { enabled: s.presenceDecayEnabled, amount: s.presenceDecayAmount, frames: s.presenceDecayFrames, floor: s.presenceDecayFloor };
    };

    FWB.setNarrativeState = function(value) {
        const s = state();
        const previousState = String(s.narrativeState || "neutral");
        s.narrativeState = String(value || "neutral");
        s.narrativeHistory = s.narrativeHistory || [];
        if (previousState !== s.narrativeState) {
            s.narrativeHistory.push({ from: previousState, to: s.narrativeState, frame: root.Graphics && Graphics.frameCount || 0 });
            if (s.narrativeHistory.length > 50) s.narrativeHistory.shift();
        }
        markSyncDirty();
        if (previousState !== s.narrativeState) FWB.emit("narrativeStateChanged", { previousState: previousState, narrativeState: s.narrativeState });
        return s.narrativeState;
    };

    FWB.getNarrativeState = function() {
        return String(state().narrativeState || "neutral");
    };

    function coerceMemoryValue(value) {
        if (typeof value !== "string") return value;
        const text = value.trim();
        if (/^(true|false)$/i.test(text)) return /^true$/i.test(text);
        if (/^null$/i.test(text)) return null;
        if (text !== "" && Number.isFinite(Number(text))) return Number(text);
        return value;
    }

    function memoryStore(scope) {
        const s = state();
        return String(scope || "save").toLowerCase() === "session" ? (s.sessionMemory || (s.sessionMemory = {})) : (s.memory || (s.memory = {}));
    }

    FWB.memory = {
        set: function(key, value, scope) {
            const store = memoryStore(scope);
            store[String(key || "")] = coerceMemoryValue(value);
            markSyncDirty();
            FWB.emit("memoryChanged", { key: String(key || ""), value: store[String(key || "")], scope: scope || "save" });
            return store[String(key || "")];
        },
        get: function(key, def, scope) {
            const store = memoryStore(scope);
            key = String(key || "");
            return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : def;
        },
        has: function(key, scope) {
            const store = memoryStore(scope);
            return Object.prototype.hasOwnProperty.call(store, String(key || ""));
        },
        add: function(key, amount, scope) {
            const current = Number(this.get(key, 0, scope) || 0);
            return this.set(key, current + Number(amount || 1), scope);
        },
        toggle: function(key, scope) {
            return this.set(key, !this.get(key, false, scope), scope);
        },
        clear: function(key, scope) {
            const store = memoryStore(scope);
            if (key) delete store[String(key || "")];
            else Object.keys(store).forEach(k => delete store[k]);
            markSyncDirty();
        },
        all: function(scope) {
            return Object.assign({}, memoryStore(scope));
        }
    };

    FWB.setMemory = function(key, value, scope) { return FWB.memory.set(key, value, scope); };
    FWB.addMemory = function(key, amount, scope) { return FWB.memory.add(key, amount, scope); };
    FWB.clearMemory = function(key, scope) { return FWB.memory.clear(key, scope); };
    FWB.setFlag = function(key, value) {
        const s = state();
        s.flags[String(key || "")] = value === undefined ? true : !!value;
        markSyncDirty();
        FWB.emit("flagChanged", { key: String(key || ""), value: s.flags[String(key || "")] });
        return s.flags[String(key || "")];
    };
    FWB.clearFlag = function(key) {
        const s = state();
        if (key) delete s.flags[String(key)];
        else s.flags = {};
        markSyncDirty();
    };

    // -------------------------------------------------------------------------
    // Phase 4 Trigger Engine
    // -------------------------------------------------------------------------

    function stableHash(text) {
        text = String(text || "");
        let hash = 0;
        for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
        return Math.abs(hash).toString(36);
    }

    function triggerId(rule) {
        return String(rule.id || rule.triggerId || `trigger_${stableHash(JSON.stringify(rule))}`);
    }

    function normalizeTriggerRule(rule, sourceKey, defaultScope) {
        if (!rule || typeof rule !== "object") return null;
        const normalized = Object.assign({}, rule);
        normalized.id = triggerId(Object.assign({ sourceKey: sourceKey }, normalized));
        normalized.condition = String(normalized.condition || normalized.if || "true");
        normalized.action = String(normalized.action || "sequence");
        normalized.value = normalized.value !== undefined ? normalized.value : (normalized.sequenceName || normalized.message || normalized.stage || normalized.amount || "");
        normalized.scope = String(normalized.scope || defaultScope || "global").toLowerCase();
        normalized.sourceKey = String(sourceKey || normalized.sourceKey || "");
        normalized.cooldown = Math.max(0, Number(normalized.cooldown || 0));
        const onceRaw = normalized.once;
        const onceText = String(onceRaw || "").toLowerCase();
        normalized.once = onceRaw === true || onceText === "true" || onceText === "save";
        normalized.sessionOnce = onceText === "session";
        return normalized;
    }

    FWB.registerTrigger = function(rule) {
        const s = state();
        const normalized = normalizeTriggerRule(rule, rule && rule.sourceKey, rule && rule.scope);
        if (!normalized) return null;
        const index = s.triggerRules.findIndex(existing => String(existing.id) === String(normalized.id));
        if (index >= 0) s.triggerRules[index] = normalized;
        else s.triggerRules.push(normalized);
        markSyncDirty();
        FWB.emit("triggerRegistered", { trigger: normalized });
        return normalized.id;
    };

    FWB.clearTriggers = function(scopeOrPrefix) {
        const s = state();
        const query = String(scopeOrPrefix || "");
        if (!query) {
            s.triggerRules = [];
        } else {
            s.triggerRules = s.triggerRules.filter(rule => String(rule.scope || "") !== query && String(rule.id || "").indexOf(query) !== 0 && String(rule.sourceKey || "").indexOf(query) !== 0);
        }
        markSyncDirty();
    };

    function triggerScopeMatches(rule, scene) {
        const scope = String(rule.scope || "global").toLowerCase();
        const kind = sceneKind(scene || (root.SceneManager && SceneManager._scene));
        if (scope === "global" || scope === "save" || scope === "session") return true;
        if (scope === "map") return kind === "map";
        if (scope === "battle") return kind === "battle";
        if (scope === "menu") return kind === "menu";
        if (scope === "file") return kind === "file";
        return true;
    }

    function runTriggerAction(rule) {
        const action = String(rule.action || "sequence").toLowerCase();
        const value = rule.value;
        switch (action) {
            case "stage":
            case "setstage":
                FWB.setStage(Number(value || rule.stage || 1), { fadeFrames: rule.fadeFrames || 35, source: "trigger:" + rule.id });
                break;
            case "sequence":
            case "runsequence":
                FWB.runSequence(String(value || rule.sequenceName || "Reality Fracture"));
                break;
            case "message":
                if (root.$gameMessage) {
                    if (rule.speaker && $gameMessage.setSpeakerName) $gameMessage.setSpeakerName(tokenReplace(rule.speaker));
                    $gameMessage.add(tokenReplace(value || rule.text || ""));
                }
                break;
            case "breach":
                FWB.addBreach(Number(value || rule.amount || 0));
                break;
            case "presence":
                FWB.addPresence(Number(value || rule.amount || 0));
                break;
            case "pulse":
                FWB.pulse(Number(rule.duration || 60), Number(value || rule.intensity || 0.5));
                break;
            case "flash":
                FWB.flash(Number(rule.duration || 24), Number(value || rule.opacity || 160));
                break;
            case "glitch":
                FWB.glitchNextMessage(Number(value || rule.amount || 0.2), Number(rule.lines || 1));
                break;
            case "commonevent":
                safeReserveCommonEvent(Number(value || rule.idValue || rule.commonEventId || 0));
                break;
            case "lockinput":
                FWB.lockInput(Number(value || rule.frames || 60));
                break;
            case "setnarrativestate":
            case "narrative":
                FWB.setNarrativeState(String(value || rule.state || "neutral"));
                break;
            case "uicorruption":
                FWB.setUiCorruption(Number(value || rule.level || 1), Number(rule.duration || 0));
                break;
            case "fakesystemmessage":
                FWB.fakeSystemMessage(String(value || rule.text || "Runtime integrity warning."), String(rule.speaker || "SYSTEM"));
                break;
        }
        state().lastTriggerId = String(rule.id || "");
        FWB.emit("triggerFired", { trigger: rule });
    }

    function updateTriggers(scene) {
        const s = state();
        if (!Array.isArray(s.triggerRules) || s.triggerRules.length <= 0) return;
        const now = root.Graphics && Graphics.frameCount ? Graphics.frameCount : 0;
        s.triggerRules.slice().forEach(rule => {
            if (!triggerScopeMatches(rule, scene)) return;
            const id = String(rule.id || "");
            if (rule.once && s.triggerOnce[id]) return;
            if (rule.sessionOnce && s.sessionTriggerOnce[id]) return;
            if (rule.cooldown > 0) {
                const last = Number(s.triggerCooldowns[id] || s.sessionTriggerCooldowns[id] || -999999999);
                if (now - last < rule.cooldown) return;
            }
            if (!FWB.evalCondition(rule.condition)) return;
            if (rule.once) s.triggerOnce[id] = true;
            if (rule.sessionOnce) s.sessionTriggerOnce[id] = true;
            if (rule.cooldown > 0) {
                if (String(rule.cooldownScope || "save").toLowerCase() === "session") s.sessionTriggerCooldowns[id] = now;
                else s.triggerCooldowns[id] = now;
            }
            runTriggerAction(rule);
            markSyncDirty();
        });
    }

    function parseTriggerOptions(parts) {
        const options = {};
        parts.forEach(part => {
            const m = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/.exec(part);
            if (m) options[m[1]] = m[2];
        });
        return options;
    }

    function parseTriggerTagContent(content, sourceKey, defaultScope) {
        const split = String(content || "").split(/\s*->\s*/);
        if (split.length < 2) return;
        const condition = split[0].trim();
        const rightParts = split.slice(1).join("->").split("|");
        const actionPart = rightParts.shift() || "";
        const options = parseTriggerOptions(rightParts);
        const actionMatch = /^\s*([A-Za-z0-9_]+)\s*[:=]\s*(.*?)\s*$/.exec(actionPart);
        const action = actionMatch ? actionMatch[1] : String(options.action || "sequence");
        const value = actionMatch ? actionMatch[2] : String(options.value || "");
        FWB.registerTrigger(Object.assign(options, {
            id: options.id || `${sourceKey || "note"}_${stableHash(content)}`,
            condition: condition,
            action: action,
            value: value,
            scope: options.scope || defaultScope || "global",
            sourceKey: sourceKey
        }));
    }

    function parseTriggerTags(note, sourceKey, defaultScope) {
        note = String(note || "");
        const re = /<\s*FWBTrigger\s*:\s*([^>]+)>/gi;
        let match;
        while ((match = re.exec(note))) {
            parseTriggerTagContent(match[1], sourceKey, defaultScope);
        }
    }

    // -------------------------------------------------------------------------
    // Phase 5 Control Distortion
    // -------------------------------------------------------------------------

    let fwbOriginalExecuteMove = null;
    let fwbApplyingDelayedMove = false;

    FWB.setControlDistortion = function(options) {
        const s = state();
        if (Settings.disableControlDistortion || access().disableStage4) return false;
        options = options || {};
        s.controlDistortion = {
            enabled: true,
            remaining: Math.max(1, Number(options.duration || options.frames || 180)),
            invertX: !!options.invertX,
            invertY: !!options.invertY,
            driftChance: clamp(Number(options.driftChance !== undefined ? options.driftChance : options.drift || 0), 0, 1),
            randomBlockChance: clamp(Number(options.randomBlockChance || options.blockChance || 0), 0, 1),
            delayFrames: Math.max(0, Number(options.delayFrames || 0)),
            forceDirection: Number(options.forceDirection || 0)
        };
        s.controlDistortionQueue = [];
        markSyncDirty();
        FWB.emit("controlDistortionStarted", { controlDistortion: s.controlDistortion });
        return true;
    };

    FWB.clearControlDistortion = function() {
        const s = state();
        s.controlDistortion = Object.assign({}, defaultState().controlDistortion);
        s.controlDistortionQueue = [];
        markSyncDirty();
        FWB.emit("controlDistortionCleared", {});
    };

    FWB.getControlDistortion = function() {
        return Object.assign({}, state().controlDistortion || {});
    };

    function isControlDistortionActive() {
        const s = state();
        const d = s.controlDistortion || {};
        return !!d.enabled && Number(d.remaining || 0) > 0 && !Settings.disableControlDistortion;
    }

    function distortDirection(direction) {
        const d = state().controlDistortion || {};
        direction = Number(direction || 0);
        if (d.forceDirection && [2,4,6,8].includes(Number(d.forceDirection))) direction = Number(d.forceDirection);
        if (d.invertX) {
            if (direction === 4) direction = 6;
            else if (direction === 6) direction = 4;
        }
        if (d.invertY) {
            if (direction === 2) direction = 8;
            else if (direction === 8) direction = 2;
        }
        if (Number(d.driftChance || 0) > 0 && Math.random() < Number(d.driftChance || 0)) {
            direction = [2,4,6,8][randomInt(0, 3)];
        }
        return direction;
    }

    function updateControlDistortion(scene) {
        const s = state();
        const d = s.controlDistortion || {};
        if (!d.enabled) return;
        if (Number(d.remaining || 0) > 0) d.remaining -= 1;
        if (Number(d.remaining || 0) <= 0) {
            FWB.clearControlDistortion();
            return;
        }
        if (Array.isArray(s.controlDistortionQueue) && s.controlDistortionQueue.length && fwbOriginalExecuteMove && root.$gamePlayer) {
            s.controlDistortionQueue.forEach(item => item.frames -= 1);
            const ready = s.controlDistortionQueue.filter(item => item.frames <= 0);
            s.controlDistortionQueue = s.controlDistortionQueue.filter(item => item.frames > 0);
            ready.forEach(item => {
                fwbApplyingDelayedMove = true;
                try { fwbOriginalExecuteMove.call($gamePlayer, item.direction); }
                finally { fwbApplyingDelayedMove = false; }
            });
        }
    }

    // -------------------------------------------------------------------------
    // Phase 6 UI Corruption and Fake System Layer
    // -------------------------------------------------------------------------

    FWB.setUiCorruption = function(level, duration) {
        const s = state();
        s.uiCorruptionLevel = clamp(Number(level || 0), 0, Settings.maxUiCorruptionLevel);
        s.uiCorruptionFrames = Math.max(0, Number(duration || 0));
        markSyncDirty();
        FWB.emit("uiCorruptionChanged", { level: s.uiCorruptionLevel, duration: s.uiCorruptionFrames });
        return s.uiCorruptionLevel;
    };

    FWB.clearUiCorruption = function() {
        const s = state();
        s.uiCorruptionLevel = 0;
        s.uiCorruptionFrames = 0;
        markSyncDirty();
        FWB.emit("uiCorruptionChanged", { level: 0 });
    };

    function uiCorruptionLevel() {
        const s = state();
        return clamp(Number(s.uiCorruptionLevel || 0), 0, Settings.maxUiCorruptionLevel);
    }

    function updateUiCorruption(scene) {
        const s = state();
        if (Number(s.uiCorruptionFrames || 0) > 0) {
            s.uiCorruptionFrames -= 1;
            if (s.uiCorruptionFrames <= 0) FWB.clearUiCorruption();
        }
    }

    FWB.fakeSystemMessage = function(text, speaker) {
        if (!Settings.fakeSystemEnabled) return false;
        const s = state();
        const payload = { text: tokenReplace(text || "Runtime integrity warning."), speaker: tokenReplace(speaker || "SYSTEM") };
        s.fakeSystemMessages.push(payload);
        if (root.$gameMessage) {
            if (payload.speaker && $gameMessage.setSpeakerName) $gameMessage.setSpeakerName(payload.speaker);
            $gameMessage.add(payload.text);
        }
        FWB.emit("fakeSystemMessage", payload);
        return true;
    };

    FWB.fakeSaveFailure = function(text) {
        return FWB.fakeSystemMessage(text || "Save failed. File integrity compromised.", "SYSTEM");
    };

    FWB.fakeOptionChange = function(optionName, fakeValue) {
        const s = state();
        s.fakeOptionOverrides[String(optionName || "")] = String(fakeValue || "???");
        markSyncDirty();
        FWB.emit("fakeOptionChanged", { optionName: optionName, fakeValue: fakeValue });
    };

    FWB.clearFakeOptionChange = function(optionName) {
        const s = state();
        if (optionName) delete s.fakeOptionOverrides[String(optionName)];
        else s.fakeOptionOverrides = {};
        markSyncDirty();
    };


    // -------------------------------------------------------------------------
    // Phase 7 Memory and Narrative Expansion
    // -------------------------------------------------------------------------

    function parseMemoryPair(value) {
        const text = String(value || "");
        const eq = text.indexOf("=");
        if (eq >= 0) return { key: text.slice(0, eq).trim(), value: coerceMemoryValue(text.slice(eq + 1).trim()) };
        const comma = text.indexOf(",");
        if (comma >= 0) return { key: text.slice(0, comma).trim(), value: coerceMemoryValue(text.slice(comma + 1).trim()) };
        return { key: text.trim(), value: true };
    }

    FWB.getNarrativeHistory = function() {
        return JSON.parse(JSON.stringify(state().narrativeHistory || []));
    };

    FWB.clearNarrativeHistory = function() {
        state().narrativeHistory = [];
        markSyncDirty();
    };

    // -------------------------------------------------------------------------
    // Phase 8 Battle Break Effects and Enemy Awareness
    // -------------------------------------------------------------------------

    function battleLogWindow() {
        const scene = root.SceneManager && SceneManager._scene;
        return scene && scene._logWindow ? scene._logWindow : (root.BattleManager && BattleManager._logWindow ? BattleManager._logWindow : null);
    }

    function battleMembers() {
        const members = [];
        if (root.$gameTroop && $gameTroop.members) members.push.apply(members, $gameTroop.members());
        if (root.$gameParty && $gameParty.battleMembers) members.push.apply(members, $gameParty.battleMembers());
        return members;
    }

    function battleTargetByIndex(index) {
        const members = battleMembers();
        return members[clamp(Number(index || 0), 0, Math.max(0, members.length - 1))] || null;
    }

    function battlerDisplayName(target) {
        if (!target) return "Target";
        if (target.name) return target.name();
        return "Target";
    }

    function pushBattleLog(text) {
        const line = tokenReplace(text || "");
        const log = battleLogWindow();
        if (log && log.push) log.push("addText", line);
        else if (root.$gameMessage) $gameMessage.add(line);
        FWB.emit("battleLogLine", { text: line });
        return line;
    }

    FWB.fakeDamage = function(targetOrIndex, amount, text) {
        if (!Settings.battleBreakEnabled) return false;
        const target = typeof targetOrIndex === "number" ? battleTargetByIndex(targetOrIndex) : targetOrIndex;
        const line = text || `${battlerDisplayName(target)} took ${Number(amount || 0)} damage!`;
        pushBattleLog(line);
        FWB.emit("fakeDamage", { target: target, amount: Number(amount || 0), text: line });
        return true;
    };

    FWB.fakeHeal = function(targetOrIndex, amount, text) {
        if (!Settings.battleBreakEnabled) return false;
        const target = typeof targetOrIndex === "number" ? battleTargetByIndex(targetOrIndex) : targetOrIndex;
        const line = text || `${battlerDisplayName(target)} recovered ${Number(amount || 0)} HP!`;
        pushBattleLog(line);
        FWB.emit("fakeHeal", { target: target, amount: Number(amount || 0), text: line });
        return true;
    };

    FWB.corruptBattleLog = function(amount, lines) {
        const s = state();
        s.battleBreaks = s.battleBreaks || {};
        s.battleBreaks.corruptLogAmount = clamp(Number(amount || 0.25), 0, 1);
        s.battleBreaks.corruptLogLines = Math.max(1, Number(lines || 3));
        markSyncDirty();
        FWB.emit("battleLogCorruptionSet", { amount: s.battleBreaks.corruptLogAmount, lines: s.battleBreaks.corruptLogLines });
    };

    function maybeCorruptBattleLogText(text) {
        const s = state();
        const b = s.battleBreaks || {};
        if (!Settings.battleBreakEnabled || !b.corruptLogLines || access().disableFlicker) return text;
        b.corruptLogLines -= 1;
        const amount = clamp(Number(b.corruptLogAmount || 0.25), 0, 1);
        return glitchText(text, amount, DEFAULT_SYMBOLS);
    }

    function runEnemyAwareness(enemy, data, note) {
        if (!Settings.battleBreakEnabled || !enemy || !data) return;
        if (!noteFlag(note, ["FWBAwareEnemy", "FourthWallAwareEnemy"]) && noteValue(note, ["FWBAwarenessStage", "FourthWallAwarenessStage"]) === null && noteValue(note, ["FWBAwarenessMessage", "FourthWallAwarenessMessage"]) === null) return;
        const s = state();
        s.battleBreaks = s.battleBreaks || { awareEnemies: {} };
        s.battleBreaks.awareEnemies = s.battleBreaks.awareEnemies || {};
        const key = `aware_${root.$gameTroop ? $gameTroop.troopId() : 0}_${enemy.index ? enemy.index() : 0}_${data.id || 0}`;
        if (s.battleBreaks.awareEnemies[key]) return;
        s.battleBreaks.awareEnemies[key] = true;
        const stage = noteValue(note, ["FWBAwarenessStage", "FourthWallAwarenessStage"]);
        if (stage !== null) FWB.setStage(Number(stage), { fadeFrames: 30, source: "enemyAwareness", glitchOnStage: true });
        const presence = noteValue(note, ["FWBAwarenessPresence", "FourthWallAwarenessPresence"]);
        if (presence !== null) FWB.addPresence(Number(presence), { source: "enemyAwareness" });
        const message = noteValue(note, ["FWBAwarenessMessage", "FourthWallAwarenessMessage"]);
        if (message !== null) pushBattleLog(String(message));
        FWB.emit("enemyAwareness", { enemy: enemy, data: data, key: key });
        markSyncDirty();
    }

    // -------------------------------------------------------------------------
    // Phase 9 Audio Corruption Layer
    // -------------------------------------------------------------------------

    const FWB_AUDIO_FALLBACK_SE = ["Cursor", "Cancel", "Decision", "Buzzer", "Damage1", "Damage2", "Equip1", "Load", "Save"];

    FWB.setAudioCorruption = function(options) {
        const s = state();
        if (!Settings.audioCorruptionEnabled || access().disableAudioDistortion) return false;
        options = options || {};
        s.audioCorruption = {
            enabled: true,
            remaining: Math.max(1, Number(options.duration || options.frames || 300)),
            pitchDrift: clamp(Number(options.pitchDrift || 0), 0, Settings.audioCorruptionMaxPitchDrift),
            volumeFlutter: clamp(Number(options.volumeFlutter || 0), 0, Settings.audioCorruptionMaxVolumeFlutter),
            dropoutChance: clamp(Number(options.dropoutChance || 0), 0, Settings.audioCorruptionMaxDropoutChance),
            wrongSeChance: clamp(Number(options.wrongSeChance || 0), 0, 1),
            sePool: Array.isArray(options.sePool) ? options.sePool.slice() : FWB_AUDIO_FALLBACK_SE.slice()
        };
        markSyncDirty();
        FWB.emit("audioCorruptionStarted", { audioCorruption: Object.assign({}, s.audioCorruption) });
        return true;
    };

    FWB.clearAudioCorruption = function() {
        const s = state();
        s.audioCorruption = defaultState().audioCorruption;
        markSyncDirty();
        FWB.emit("audioCorruptionCleared", {});
    };

    FWB.getAudioCorruption = function() {
        return Object.assign({}, state().audioCorruption || {});
    };

    function isAudioCorruptionActive() {
        const a = state().audioCorruption || {};
        return !!a.enabled && Number(a.remaining || 0) > 0 && Settings.audioCorruptionEnabled && !access().disableAudioDistortion;
    }

    function corruptAudioPayload(payload, type) {
        if (!payload || !isAudioCorruptionActive()) return payload;
        const a = state().audioCorruption || {};
        if (Number(a.dropoutChance || 0) > 0 && Math.random() < Number(a.dropoutChance || 0)) return null;
        const next = Object.assign({}, payload);
        if (type === "se" && Number(a.wrongSeChance || 0) > 0 && Math.random() < Number(a.wrongSeChance || 0)) {
            const pool = Array.isArray(a.sePool) && a.sePool.length ? a.sePool : FWB_AUDIO_FALLBACK_SE;
            next.name = pool[randomInt(0, pool.length - 1)] || next.name;
        }
        if (Number(a.pitchDrift || 0) > 0) {
            const drift = randomRange(-Number(a.pitchDrift), Number(a.pitchDrift));
            next.pitch = clamp(Number(next.pitch || 100) * (1 + drift), 50, 150);
        }
        if (Number(a.volumeFlutter || 0) > 0) {
            const flutter = randomRange(-Number(a.volumeFlutter), Number(a.volumeFlutter));
            next.volume = clamp(Number(next.volume || 90) * (1 + flutter), 0, 100);
        }
        return next;
    }

    function updateAudioCorruption(scene) {
        const s = state();
        const a = s.audioCorruption || {};
        if (!a.enabled) return;
        if (Number(a.remaining || 0) > 0) a.remaining -= 1;
        if (Number(a.remaining || 0) <= 0) FWB.clearAudioCorruption();
    }

    function parseKeyValueOptions(text) {
        const opts = {};
        String(text || "").split(",").forEach(pair => {
            const parts = pair.split("=");
            const key = String(parts[0] || "").trim();
            const raw = String(parts.slice(1).join("=") || "true").trim();
            if (!key) return;
            if (/^(true|false)$/i.test(raw)) opts[key] = /^true$/i.test(raw);
            else if (Number.isFinite(Number(raw))) opts[key] = Number(raw);
            else if (key === "sePool") opts[key] = raw.split(/[|;]/).map(x => x.trim()).filter(Boolean);
            else opts[key] = raw;
        });
        return opts;
    }

    // -------------------------------------------------------------------------
    // Glitch text and messages
    // -------------------------------------------------------------------------

    const DEFAULT_SYMBOLS = "@#$%&?!<>/\\[]{}=+*0123456789";

    function glitchText(text, amount, symbols) {
        text = String(text || "");
        amount = clamp(Number(amount || 0), 0, 1);
        symbols = String(symbols || DEFAULT_SYMBOLS);
        if (amount <= 0 || symbols.length <= 0) return text;
        let result = "";
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            // Preserve RPG Maker escape control sequences like \V[1], \N[1], \C[2].
            if (ch === "\\") {
                let j = i + 1;
                if (j < text.length) {
                    result += ch + text[j];
                    j++;
                    if (text[j] === "[") {
                        while (j < text.length) {
                            result += text[j];
                            if (text[j] === "]") break;
                            j++;
                        }
                    }
                    i = j;
                    continue;
                }
            }
            if (/\s/.test(ch)) {
                result += ch;
            } else if (Math.random() < amount) {
                result += symbols[randomInt(0, symbols.length - 1)];
            } else {
                result += ch;
            }
        }
        return result;
    }

    FWB.glitchText = glitchText;

    FWB.glitchNextMessage = function(amount, lines, symbols) {
        const s = state();
        s.textGlitchNext = {
            amount: clamp(Number(amount || 0.2), 0, 1),
            lines: Math.max(1, Number(lines || 1)),
            symbols: String(symbols || DEFAULT_SYMBOLS)
        };
    };

    FWB.glitchSpeakerName = function(amount, uses, symbols) {
        const s = state();
        s.speakerGlitchNext = {
            amount: clamp(Number(amount || 0.35), 0, 1),
            uses: Math.max(1, Number(uses || 1)),
            symbols: String(symbols || DEFAULT_SYMBOLS)
        };
    };

    function tokenReplace(text) {
        const s = state();
        const leader = root.$gameParty && $gameParty.leader ? $gameParty.leader() : null;
        const playerName = leader && leader.name ? leader.name() : "Player";
        return String(text || "")
            .replace(/\{player\}/gi, playerName)
            .replace(/\{saves\}/gi, String(s.trackers.saveCount || 0))
            .replace(/\{loads\}/gi, String(s.trackers.loadCount || 0))
            .replace(/\{deaths\}/gi, String(s.trackers.deathCount || 0))
            .replace(/\{menus\}/gi, String(s.trackers.menuOpenCount || 0))
            .replace(/\{stage\}/gi, String(s.stage || 0))
            .replace(/\{breach\}/gi, String(Math.round(s.breachMeter || 0)))
            .replace(/\{presence\}/gi, String(Math.round(s.presence || 0)))
            .replace(/\{presenceTier\}/gi, String(s.presenceTier || presenceTierName(s.presence)))
            .replace(/\{narrative\}/gi, String(s.narrativeState || "neutral"))
            .replace(/\{memory:([^}]+)\}/gi, function(_, key) { return String(FWB.memory.get(String(key).trim(), "")); })
            .replace(/\{flag:([^}]+)\}/gi, function(_, key) { return String(!!(s.flags && s.flags[String(key).trim()])); });
    }

    FWB.playBreakMoment = function(options) {
        options = options || {};
        const s = state();
        const breakId = String(options.breakId || "");
        if (breakId && options.oneShot && s.seenBreakIds.includes(breakId)) return false;
        if (breakId && !s.seenBreakIds.includes(breakId)) s.seenBreakIds.push(breakId);
        if (breakId) s.lastBreakId = breakId;

        const type = String(options.type || "dialogue");
        let severity = visibleStage(Number(options.severity || 1));
        if (type === "bossBreach") severity = Math.max(severity, 4);
        if (type === "randomSubtle") severity = Math.min(severity, Settings.randomStageMax);
        FWB.setStage(severity, { fadeFrames: options.fadeFrames || undefined, glitchOnStage: true });
        if (Number(options.addBreach || 0) !== 0) FWB.addBreach(Number(options.addBreach || 0), { count: false });
        if (Number(options.addPresence || 0) !== 0) FWB.addPresence(Number(options.addPresence || 0), { source: "breakMoment" });

        if (type === "stare" && root.$gameMap && Number(options.faceEventId || 0) > 0) {
            const ev = $gameMap.event(Number(options.faceEventId));
            if (ev && ev.turnTowardPlayer) ev.turnTowardPlayer();
        }
        if (type === "whisper") FWB.pulse(45, 0.25);
        if (type === "deathBreak") FWB.addBreach(5, { count: false });
        if (type === "bossBreach") FWB.pulse(90, 0.85);

        const msg = tokenReplace(options.messageText || options.message || "");
        if (msg && root.$gameMessage) {
            const speaker = tokenReplace(options.speakerName || options.speaker || "");
            if (speaker && $gameMessage.setSpeakerName) $gameMessage.setSpeakerName(speaker);
            $gameMessage.add(msg);
        }
        markSyncDirty();
        return true;
    };

    // -------------------------------------------------------------------------
    // Sequences
    // -------------------------------------------------------------------------

    const SEQUENCE_ACTIONS = [
        "stage", "setstage", "escalate", "reduce", "clear", "pulse", "flash", "glitch", "speaker", "message",
        "breach", "commonevent", "lockinput", "unlockinput", "presence", "narrative", "setnarrativestate",
        "memory", "memoryadd", "clearmemory", "flag", "clearflag", "fakedamage", "fakeheal", "battlelog", "corruptbattlelog",
        "audiocorruption", "clearaudiocorruption", "wait", "emit", "sequence", "runsequence", "stopsequence"
    ];

    const SESSION_SEQUENCE_ONCE = {};
    const SESSION_SEQUENCE_COOLDOWNS = {};

    function normalizeSequenceInput(input) {
        if (Array.isArray(input)) return JSON.parse(JSON.stringify(input));
        if (typeof input === "string") return tryParseJson(input, null);
        return null;
    }

    function normalizeSequenceSteps(steps) {
        if (!Array.isArray(steps)) return [];
        return JSON.parse(JSON.stringify(steps)).sort((a, b) => Number(a.time || 0) - Number(b.time || 0));
    }

    function sequenceStepKey(step, sequenceName, index) {
        const explicit = String(step && (step.id || step.name || step.key) || "").trim();
        if (explicit) return explicit;
        return `${sequenceName || "Sequence"}:${index || 0}:${Number(step && step.time || 0)}:${String(step && step.action || "stage")}`;
    }

    function validateConditionField(value, label, errors, index) {
        if (value === undefined || value === null || value === "") return;
        const text = String(value);
        if (!/^[A-Za-z0-9_ .!<>=&|+\-"']+$/.test(text)) {
            errors.push(`Step ${index}: ${label} contains unsupported characters.`);
        }
    }

    FWB.validateSequence = function(jsonOrArray) {
        const errors = [];
        const warnings = [];
        const steps = normalizeSequenceInput(jsonOrArray);
        if (!Array.isArray(steps)) {
            return { ok: false, errors: ["Sequence must be a JSON array of step objects."], warnings: [], steps: [] };
        }
        const actionMap = SEQUENCE_ACTIONS.map(a => a.toLowerCase());
        steps.forEach((step, index) => {
            if (!step || typeof step !== "object" || Array.isArray(step)) {
                errors.push(`Step ${index}: must be an object.`);
                return;
            }
            const action = String(step.action || "stage");
            const actionKey = action.toLowerCase();
            if (!actionMap.includes(actionKey)) {
                errors.push(`Step ${index}: unknown action '${action}'.`);
            }
            const time = Number(step.time || 0);
            if (!Number.isFinite(time) || time < 0) errors.push(`Step ${index}: time must be a number >= 0.`);
            validateConditionField(step.if, "if", errors, index);
            validateConditionField(step.unless, "unless", errors, index);
            if (step.chance !== undefined) {
                const chance = Number(step.chance);
                if (!Number.isFinite(chance) || chance < 0 || chance > 1) errors.push(`Step ${index}: chance must be between 0 and 1.`);
            }
            if (step.chancePercent !== undefined) {
                const chancePercent = Number(step.chancePercent);
                if (!Number.isFinite(chancePercent) || chancePercent < 0 || chancePercent > 100) errors.push(`Step ${index}: chancePercent must be between 0 and 100.`);
            }
            if (step.cooldown !== undefined) {
                const cooldown = Number(step.cooldown);
                if (!Number.isFinite(cooldown) || cooldown < 0) errors.push(`Step ${index}: cooldown must be a number >= 0.`);
            }
            if ((step.once || step.cooldown) && !(step.id || step.name || step.key)) {
                warnings.push(`Step ${index}: once/cooldown has no id; an auto key will be used.`);
            }
            if (actionKey === "message" && !step.text) warnings.push(`Step ${index}: message action has no text.`);
            if (actionKey === "commonevent" && !(step.id || step.commonEventId || step.eventId || step.ce)) warnings.push(`Step ${index}: commonEvent action has no id/commonEventId.`);
        });
        return { ok: errors.length === 0, errors: errors, warnings: warnings, steps: normalizeSequenceSteps(steps) };
    };

    function logSequenceValidation(result, name) {
        if (!Settings.debugMode || !result) return;
        if (result.errors && result.errors.length) console.warn(`[${PLUGIN_NAME}] sequence validation errors for ${name}:`, result.errors);
        if (result.warnings && result.warnings.length) console.warn(`[${PLUGIN_NAME}] sequence validation warnings for ${name}:`, result.warnings);
    }

    FWB.registerSequence = function(name, customJson) {
        const sequenceName = String(name || "").trim();
        const result = FWB.validateSequence(customJson);
        logSequenceValidation(result, sequenceName || "Custom");
        if (!sequenceName || !result.ok) return false;
        SEQUENCES[sequenceName] = result.steps;
        FWB.emit("sequenceRegistered", { name: sequenceName, steps: result.steps });
        return true;
    };

    FWB.unregisterSequence = function(name) {
        const sequenceName = String(name || "").trim();
        if (!sequenceName || !SEQUENCES[sequenceName]) return false;
        delete SEQUENCES[sequenceName];
        FWB.emit("sequenceUnregistered", { name: sequenceName });
        return true;
    };

    FWB.hasSequence = function(name) {
        return !!SEQUENCES[String(name || "")];
    };

    FWB.listSequences = function() {
        return Object.keys(SEQUENCES).sort();
    };

    function makeSequenceRuntime(name, steps) {
        return {
            name: String(name || "Custom"),
            frame: 0,
            index: 0,
            waitFrames: 0,
            loopCount: 0,
            localOnce: {},
            localCooldowns: {},
            steps: normalizeSequenceSteps(steps)
        };
    }

    FWB.runSequence = function(name, customJson, options) {
        options = options || {};
        const s = state();
        let steps = null;
        if (customJson) steps = normalizeSequenceInput(customJson);
        if (!Array.isArray(steps)) steps = SEQUENCES[String(name || "Reality Fracture")];
        if (!Array.isArray(steps)) steps = SEQUENCES["Reality Fracture"];
        const result = FWB.validateSequence(steps);
        logSequenceValidation(result, String(name || "Custom"));
        if (!result.ok) return false;
        const runtime = makeSequenceRuntime(name || "Custom", result.steps);
        const mode = String(options.mode || "replace").toLowerCase();
        if (mode === "queue" && s.sequence) {
            s.sequenceQueue = s.sequenceQueue || [];
            s.sequenceQueue.push(runtime);
            FWB.emit("sequenceQueued", { name: runtime.name, queueLength: s.sequenceQueue.length });
            return true;
        }
        s.sequence = runtime;
        s.sequencePaused = false;
        logDebug("sequence", s.sequence.name, s.sequence.steps);
        FWB.emit("sequenceStarted", { name: s.sequence.name, steps: s.sequence.steps });
        return true;
    };

    FWB.queueSequence = function(name, customJson) {
        return FWB.runSequence(name, customJson, { mode: "queue" });
    };

    FWB.pauseSequence = function() {
        const s = state();
        if (!s.sequence) return false;
        s.sequencePaused = true;
        FWB.emit("sequencePaused", { name: s.sequence.name });
        return true;
    };

    FWB.resumeSequence = function() {
        const s = state();
        if (!s.sequence) return false;
        s.sequencePaused = false;
        FWB.emit("sequenceResumed", { name: s.sequence.name });
        return true;
    };

    FWB.stopSequence = function(clearQueue) {
        const s = state();
        const old = s.sequence ? s.sequence.name : "";
        s.sequence = null;
        s.sequencePaused = false;
        if (clearQueue) s.sequenceQueue = [];
        FWB.emit("sequenceStopped", { name: old, clearQueue: !!clearQueue });
        return !!old;
    };

    FWB.clearSequenceMemory = function(prefix) {
        const s = state();
        s.sequenceMemory = s.sequenceMemory || { once: {}, cooldowns: {} };
        s.sequenceMemory.once = s.sequenceMemory.once || {};
        s.sequenceMemory.cooldowns = s.sequenceMemory.cooldowns || {};
        const pfx = String(prefix || "");
        Object.keys(s.sequenceMemory.once).forEach(key => { if (!pfx || key.indexOf(pfx) === 0) delete s.sequenceMemory.once[key]; });
        Object.keys(s.sequenceMemory.cooldowns).forEach(key => { if (!pfx || key.indexOf(pfx) === 0) delete s.sequenceMemory.cooldowns[key]; });
        Object.keys(SESSION_SEQUENCE_ONCE).forEach(key => { if (!pfx || key.indexOf(pfx) === 0) delete SESSION_SEQUENCE_ONCE[key]; });
        Object.keys(SESSION_SEQUENCE_COOLDOWNS).forEach(key => { if (!pfx || key.indexOf(pfx) === 0) delete SESSION_SEQUENCE_COOLDOWNS[key]; });
        markSyncDirty();
        FWB.emit("sequenceMemoryCleared", { prefix: pfx });
    };

    FWB.isSequenceRunning = function() {
        return !!state().sequence;
    };

    FWB.currentSequence = function() {
        const seq = state().sequence;
        return seq ? JSON.parse(JSON.stringify(seq)) : null;
    };

    function sequenceOnceStore(scope, runtime) {
        const s = state();
        s.sequenceMemory = s.sequenceMemory || { once: {}, cooldowns: {} };
        if (scope === "session") return SESSION_SEQUENCE_ONCE;
        if (scope === "sequence") return runtime.localOnce || (runtime.localOnce = {});
        return s.sequenceMemory.once || (s.sequenceMemory.once = {});
    }

    function sequenceCooldownStore(scope, runtime) {
        const s = state();
        s.sequenceMemory = s.sequenceMemory || { once: {}, cooldowns: {} };
        if (scope === "session") return SESSION_SEQUENCE_COOLDOWNS;
        if (scope === "sequence") return runtime.localCooldowns || (runtime.localCooldowns = {});
        return s.sequenceMemory.cooldowns || (s.sequenceMemory.cooldowns = {});
    }

    function shouldExecuteSequenceStep(step, runtime, index) {
        if (!step) return false;
        const key = sequenceStepKey(step, runtime.name, index);
        if (step.if && !FWB.evalCondition(step.if)) return false;
        if (step.unless && FWB.evalCondition(step.unless)) return false;
        if (step.chance !== undefined && Math.random() > clamp(Number(step.chance), 0, 1)) return false;
        if (step.chancePercent !== undefined && Math.random() * 100 > clamp(Number(step.chancePercent), 0, 100)) return false;
        if (step.once) {
            let onceScope = String(step.once === true ? "save" : step.once).toLowerCase();
            if (!["save", "session", "sequence", "true"].includes(onceScope)) onceScope = "save";
            if (onceScope === "true") onceScope = "save";
            const store = sequenceOnceStore(onceScope, runtime);
            if (store[key]) return false;
            store[key] = true;
        }
        if (step.cooldown) {
            const scope = String(step.cooldownScope || "save").toLowerCase();
            const store = sequenceCooldownStore(scope, runtime);
            const now = root.Graphics && Graphics.frameCount ? Graphics.frameCount : 0;
            const last = Number(store[key] || -999999999);
            if (now - last < Number(step.cooldown)) return false;
            store[key] = now;
        }
        return true;
    }

    function executeSequenceStep(step, runtime, index) {
        if (!step || !runtime) return;
        if (!shouldExecuteSequenceStep(step, runtime, index)) return;
        const action = String(step.action || "stage").toLowerCase();
        switch (action) {
            case "stage":
            case "setstage":
                FWB.setStage(Number(step.stage || 0), { fadeFrames: step.fadeFrames, force: !!step.force, glitchOnStage: !!step.glitchOnStage });
                break;
            case "escalate":
                FWB.escalate(Number(step.amount || 1), { fadeFrames: step.fadeFrames });
                break;
            case "reduce":
                FWB.reduce(Number(step.amount || 1), { fadeFrames: step.fadeFrames });
                break;
            case "clear":
                FWB.clear({ fadeFrames: step.fadeFrames || 45 });
                break;
            case "pulse":
                FWB.pulse(Number(step.duration || 60), Number(step.intensity || 0.5));
                break;
            case "flash":
                FWB.flash(Number(step.duration || 24), Number(step.opacity || 160));
                break;
            case "glitch":
                FWB.glitchNextMessage(Number(step.amount || 0.2), Number(step.lines || 1), step.symbols);
                break;
            case "speaker":
                FWB.glitchSpeakerName(Number(step.amount || 0.35), Number(step.uses || 1), step.symbols);
                break;
            case "message":
                if (root.$gameMessage && step.text) {
                    if (step.speaker && $gameMessage.setSpeakerName) $gameMessage.setSpeakerName(tokenReplace(step.speaker));
                    $gameMessage.add(tokenReplace(step.text));
                }
                break;
            case "breach":
                FWB.addBreach(Number(step.amount || 0), { fadeFrames: step.fadeFrames });
                break;
            case "presence":
                if (step.value !== undefined) FWB.setPresence(Number(step.value));
                else FWB.addPresence(Number(step.amount || 0));
                break;
            case "commonevent":
                safeReserveCommonEvent(Number(step.commonEventId || step.eventId || step.ce || step.id || 0));
                break;
            case "lockinput":
                FWB.lockInput(Number(step.frames || step.duration || 60));
                break;
            case "unlockinput":
                FWB.unlockInput();
                break;
            case "narrative":
            case "setnarrativestate":
                FWB.setNarrativeState(String(step.value || step.state || "neutral"));
                break;
            case "memory":
                if (step.key) FWB.memory.set(step.key, step.value, step.scope);
                break;
            case "memoryadd":
                if (step.key) FWB.memory.add(step.key, Number(step.amount || step.value || 1), step.scope);
                break;
            case "clearmemory":
                FWB.memory.clear(step.key || "", step.scope);
                break;
            case "flag":
                if (step.key) FWB.setFlag(step.key, step.value !== undefined ? step.value : true);
                break;
            case "clearflag":
                FWB.clearFlag(step.key || "");
                break;
            case "fakedamage":
                FWB.fakeDamage(Number(step.targetIndex || step.target || 0), Number(step.amount || 9999), step.text);
                break;
            case "fakeheal":
                FWB.fakeHeal(Number(step.targetIndex || step.target || 0), Number(step.amount || 9999), step.text);
                break;
            case "battlelog":
                pushBattleLog(String(step.text || step.value || ""));
                break;
            case "corruptbattlelog":
                FWB.corruptBattleLog(Number(step.amount || 0.25), Number(step.lines || 3));
                break;
            case "audiocorruption":
                FWB.setAudioCorruption(step);
                break;
            case "clearaudiocorruption":
                FWB.clearAudioCorruption();
                break;
            case "wait":
                runtime.waitFrames = Math.max(runtime.waitFrames || 0, Number(step.frames || step.duration || 30));
                break;
            case "emit":
                FWB.emit(String(step.eventName || step.name || "sequenceEvent"), step.payload || { sequence: runtime.name, step: sequenceStepKey(step, runtime.name, index) });
                break;
            case "sequence":
            case "runsequence":
                FWB.runSequence(String(step.sequenceName || step.name || "Reality Fracture"), step.customJson || "", { mode: String(step.mode || "replace") });
                break;
            case "trigger":
            case "registertrigger":
                FWB.registerTrigger(step.rule || step);
                break;
            case "controldistortion":
                FWB.setControlDistortion(step);
                break;
            case "clearcontroldistortion":
                FWB.clearControlDistortion();
                break;
            case "uicorruption":
                FWB.setUiCorruption(Number(step.level || step.value || 1), Number(step.duration || 0));
                break;
            case "clearuicorruption":
                FWB.clearUiCorruption();
                break;
            case "fakesystemmessage":
                FWB.fakeSystemMessage(String(step.text || step.value || "Runtime integrity warning."), String(step.speaker || "SYSTEM"));
                break;
            case "fakesavefailure":
                FWB.fakeSaveFailure(String(step.text || step.value || ""));
                break;
            case "stopsequence":
                FWB.stopSequence(!!step.clearQueue);
                break;
        }
        FWB.emit("sequenceStepExecuted", { sequence: runtime.name, step: step, index: index, action: action });
    }

    // -------------------------------------------------------------------------
    // Overlay rendering
    // -------------------------------------------------------------------------

    function shouldRenderInScene(scene) {
        if (!scene) return false;
        const kind = sceneKind(scene);
        if (kind === "map") return Settings.persistOnMap;
        if (kind === "battle") return Settings.persistInBattle;
        if (kind === "file") return Settings.persistInSaveLoad;
        if (kind === "menu") return Settings.persistInMenu;
        return true;
    }

    function addOverlayToLayer(scene, overlay) {
        if (!scene || !overlay) return;
        const layer = String(Settings.overlayLayer || "top");
        if (layer === "belowPictures" && scene._spriteset && scene._spriteset._pictureContainer) {
            const parent = scene._spriteset;
            const pictureContainer = scene._spriteset._pictureContainer;
            if (overlay.parent !== parent) {
                if (overlay.parent) overlay.parent.removeChild(overlay);
                const index = Math.max(0, parent.children.indexOf(pictureContainer));
                parent.addChildAt(overlay, index);
            }
            return;
        }
        if (layer === "belowWindows" && scene._windowLayer) {
            if (overlay.parent !== scene) {
                if (overlay.parent) overlay.parent.removeChild(overlay);
                const index = Math.max(0, scene.children.indexOf(scene._windowLayer));
                scene.addChildAt(overlay, index);
            } else {
                const targetIndex = Math.max(0, scene.children.indexOf(scene._windowLayer));
                const cur = scene.children.indexOf(overlay);
                if (cur > targetIndex) {
                    scene.removeChild(overlay);
                    scene.addChildAt(overlay, targetIndex);
                }
            }
            return;
        }
        if (overlay.parent !== scene) {
            if (overlay.parent) overlay.parent.removeChild(overlay);
            scene.addChild(overlay);
        } else if (scene.children[scene.children.length - 1] !== overlay) {
            scene.removeChild(overlay);
            scene.addChild(overlay);
        }
    }

    function makeOverlay(scene) {
        const overlay = new PIXI.Container();
        overlay.interactive = false;
        overlay._fwbDisplays = {};
        overlay._fwbStatic = new PIXI.Graphics();
        overlay._fwbScanlines = new PIXI.Graphics();
        overlay._fwbDebugText = null;
        overlay.addChild(overlay._fwbStatic);
        overlay.addChild(overlay._fwbScanlines);
        scene._fourthWallOverlay = overlay;
        addOverlayToLayer(scene, overlay);
        return overlay;
    }

    function ensureOverlay(scene) {
        if (!scene) return null;
        const overlay = scene._fourthWallOverlay || makeOverlay(scene);
        addOverlayToLayer(scene, overlay);
        return overlay;
    }

    function createCrackDisplay(crack) {
        const container = new PIXI.Container();
        container._fwbId = crack.id;
        container._fwbSprites = [];

        const main = new Sprite(ImageManager.loadPicture(crack.image));
        main.anchor.set(0.5, 0.5);
        main.blendMode = profileBlendMode(crack.blendMode);
        container.addChild(main);
        container._fwbSprites.push({ sprite: main, x: 0, y: 0, tint: null, alpha: 1 });

        if (crack.chromatic) {
            const red = new Sprite(ImageManager.loadPicture(crack.image));
            const blue = new Sprite(ImageManager.loadPicture(crack.image));
            red.anchor.set(0.5, 0.5);
            blue.anchor.set(0.5, 0.5);
            red.tint = 0xff7777;
            blue.tint = 0x77aaff;
            red.blendMode = profileBlendMode("screen");
            blue.blendMode = profileBlendMode("screen");
            container.addChild(red);
            container.addChild(blue);
            const offset = Number(profile(crack.stage).chromaticOffset || 2);
            container._fwbSprites.push({ sprite: red, x: -offset, y: 0, tint: 0xff7777, alpha: 0.25 });
            container._fwbSprites.push({ sprite: blue, x: offset, y: 0, tint: 0x77aaff, alpha: 0.25 });
        }
        return container;
    }

    function updateCrackDisplay(display, crack) {
        const baseX = Graphics.width / 2 + Number(crack.offsetX || 0);
        const baseY = Graphics.height / 2 + Number(crack.offsetY || 0);
        display.x = baseX;
        display.y = baseY;
        display.rotation = Number(crack.rotation || 0);
        display.scale.x = Number(crack.scale || 1) * (crack.flipX ? -1 : 1);
        display.scale.y = Number(crack.scale || 1) * (crack.flipY ? -1 : 1);
        let opacity = Number(crack.opacity || 0);
        if (!access().disableFlicker && Number(crack.flicker || 0) > 0) {
            const flicker = 1 + Math.sin((crack.age || 0) * 0.37) * Number(crack.flicker || 0) + randomRange(-Number(crack.flicker || 0), Number(crack.flicker || 0)) * 0.25;
            opacity *= clamp(flicker, 0.5, 1.4);
        }
        display.alpha = clamp(opacity / 255, 0, 1);
        display._fwbSprites.forEach(entry => {
            const sprite = entry.sprite;
            fitSpriteToScreen(sprite, true);
            sprite.x = entry.x || 0;
            sprite.y = entry.y || 0;
            sprite.alpha = entry.alpha;
        });
    }

    function highestActiveStage() {
        const s = state();
        let highest = s.stage || 0;
        s.cracks.forEach(crack => {
            if (Number(crack.opacity || 0) > 0) highest = Math.max(highest, crack.stage || 0);
        });
        return highest;
    }

    function updateStaticAndScanlines(overlay) {
        if (!overlay || !overlay._fwbStatic || !overlay._fwbScanlines) return;
        const stage = highestActiveStage();
        const p = stage > 0 ? profile(stage) : null;
        const staticAmount = p ? Number(p.staticNoise || 0) : 0;
        const scanAmount = p ? Number(p.scanlines || 0) : 0;

        overlay._fwbStatic.clear();
        if (stage <= 0 || access().disableFlicker) {
            overlay._fwbScanlines.clear();
            overlay._fwbScanlineCacheKey = "";
            return;
        }

        if (staticAmount > 0 && Graphics.frameCount % 3 === 0) {
            const count = Math.round(staticAmount * 140);
            for (let i = 0; i < count; i++) {
                const x = randomInt(0, Graphics.width);
                const y = randomInt(0, Graphics.height);
                const w = randomInt(2, 18);
                const h = randomInt(1, 3);
                overlay._fwbStatic.beginFill(0xffffff, randomRange(0.025, 0.11));
                overlay._fwbStatic.drawRect(x, y, w, h);
                overlay._fwbStatic.endFill();
            }
        }

        const scanlineKey = `${stage}:${scanAmount}:${Graphics.width}:${Graphics.height}`;
        if (overlay._fwbScanlineCacheKey !== scanlineKey) {
            overlay._fwbScanlines.clear();
            overlay._fwbScanlineCacheKey = scanlineKey;
            if (scanAmount > 0) {
                overlay._fwbScanlines.beginFill(0x000000, scanAmount * 0.35);
                for (let y = 0; y < Graphics.height; y += 6) {
                    overlay._fwbScanlines.drawRect(0, y, Graphics.width, 1);
                }
                overlay._fwbScanlines.endFill();
            }
        }
    }

    function updateDebugOverlay(overlay) {
        if (!Settings.debugOverlay || !overlay) {
            if (overlay && overlay._fwbDebugText) overlay._fwbDebugText.visible = false;
            return;
        }
        if (!overlay._fwbDebugText) {
            overlay._fwbDebugText = new PIXI.Text("", { fontFamily: "monospace", fontSize: 14, fill: 0xffffff, stroke: 0x000000, strokeThickness: 3 });
            overlay.addChild(overlay._fwbDebugText);
        }
        const s = state();
        overlay._fwbDebugText.visible = true;
        overlay._fwbDebugText.x = 8;
        overlay._fwbDebugText.y = 8;
        overlay._fwbDebugText.text = `FWB v${VERSION}\nStage: ${s.stage}  Breach: ${Math.round(s.breachMeter)}${s.breachLocked ? " LOCKED" : ""}  Presence: ${Math.round(s.presence || 0)} (${s.presenceTier || presenceTierName(s.presence)})\nNarrative: ${s.narrativeState || "neutral"}\nMode: ${s.mode}  Locked: ${s.locked}  Input: ${s.inputLockFrames || 0}\nCracks: ${s.cracks.length}\nSeq: ${s.sequence ? s.sequence.name : "none"}${s.sequencePaused ? " PAUSED" : ""}  Queue: ${(s.sequenceQueue || []).length}\nTriggers: ${(s.triggerRules || []).length} Last: ${s.lastTriggerId || "none"}\nUI: ${s.uiCorruptionLevel || 0}  Control: ${(s.controlDistortion && s.controlDistortion.enabled) ? s.controlDistortion.remaining : 0}`;
    }

    function updateOverlay(scene) {
        const overlay = ensureOverlay(scene);
        if (!overlay) return;
        const s = state();
        const shouldRender = shouldRenderInScene(scene);
        overlay.visible = shouldRender;
        if (!shouldRender) return;

        const activeIds = {};
        s.cracks.forEach(crack => {
            activeIds[crack.id] = true;
            let display = overlay._fwbDisplays[crack.id];
            if (!display) {
                display = createCrackDisplay(crack);
                overlay._fwbDisplays[crack.id] = display;
                overlay.addChild(display);
            }
            updateCrackDisplay(display, crack);
        });
        Object.keys(overlay._fwbDisplays).forEach(id => {
            if (!activeIds[id]) {
                const display = overlay._fwbDisplays[id];
                if (display && display.parent) display.parent.removeChild(display);
                delete overlay._fwbDisplays[id];
            }
        });

        const pulse = s.pulse;
        let pulseScale = 1;
        let pulseAlpha = 1;
        if (pulse && pulse.remaining > 0) {
            const t = 1 - pulse.remaining / Math.max(1, pulse.duration);
            const wave = Math.sin(t * Math.PI);
            pulseScale = 1 + wave * Number(pulse.intensity || 0) * 0.015;
            pulseAlpha = 1 + wave * Number(pulse.intensity || 0) * 0.1;
        }

        let shakeX = 0;
        let shakeY = 0;
        if (!access().reduceScreenShake && Number(s.runtimeShakeFrames || 0) > 0) {
            const power = Number(s.runtimeShakePower || 0);
            shakeX = randomRange(-power, power);
            shakeY = randomRange(-power, power);
        }
        overlay.x = shakeX;
        overlay.y = shakeY;
        overlay.scale.x = pulseScale;
        overlay.scale.y = pulseScale;
        overlay.alpha = clamp(pulseAlpha, 0.6, 1.25);

        updateStaticAndScanlines(overlay);
        updateDebugOverlay(overlay);
        if (overlay._fwbStatic) overlay.addChild(overlay._fwbStatic);
        if (overlay._fwbScanlines) overlay.addChild(overlay._fwbScanlines);
        if (overlay._fwbDebugText) overlay.addChild(overlay._fwbDebugText);
    }

    // -------------------------------------------------------------------------
    // Runtime update
    // -------------------------------------------------------------------------

    function updateCrackFades() {
        const s = state();
        s.cracks.forEach(crack => {
            crack.age = Number(crack.age || 0) + 1;
            const target = Number(crack.targetOpacity || 0);
            const speed = Math.max(1, Number(crack.fadeSpeed || 1));
            if (crack.opacity < target) {
                crack.opacity = Math.min(target, Number(crack.opacity || 0) + speed);
            } else if (crack.opacity > target) {
                crack.opacity = Math.max(target, Number(crack.opacity || 0) - speed);
            }
        });
        s.cracks = s.cracks.filter(crack => !(crack.removing && Number(crack.opacity || 0) <= 0));
    }

    function startNextQueuedSequence() {
        const s = state();
        if (s.sequence || !Array.isArray(s.sequenceQueue) || s.sequenceQueue.length <= 0) return false;
        s.sequence = s.sequenceQueue.shift();
        s.sequencePaused = false;
        FWB.emit("sequenceStarted", { name: s.sequence.name, steps: s.sequence.steps, queued: true });
        return true;
    }

    function finishSequence(runtime) {
        const s = state();
        const name = runtime ? runtime.name : "";
        s.sequenceHistory = s.sequenceHistory || [];
        s.sequenceHistory.push({ name: name, endedAt: root.Graphics && Graphics.frameCount ? Graphics.frameCount : 0 });
        if (s.sequenceHistory.length > 20) s.sequenceHistory.shift();
        s.sequence = null;
        s.sequencePaused = false;
        FWB.emit("sequenceEnded", { name: name });
        startNextQueuedSequence();
    }

    function updateSequence() {
        const s = state();
        if (!s.sequence) {
            startNextQueuedSequence();
            return;
        }
        if (s.sequencePaused) return;
        if (Number(s.sequence.waitFrames || 0) > 0) {
            s.sequence.waitFrames -= 1;
            return;
        }
        while (s.sequence && s.sequence.index < s.sequence.steps.length && Number(s.sequence.steps[s.sequence.index].time || 0) <= s.sequence.frame) {
            const runtime = s.sequence;
            const index = runtime.index;
            executeSequenceStep(runtime.steps[index], runtime, index);
            if (s.sequence !== runtime) return;
            runtime.index += 1;
            if (Number(runtime.waitFrames || 0) > 0) break;
        }
        if (!s.sequence) return;
        s.sequence.frame += 1;
        if (s.sequence.index >= s.sequence.steps.length) {
            finishSequence(s.sequence);
        }
    }

    function updatePulseAndShake() {
        const s = state();
        if (s.pulse && s.pulse.remaining > 0) s.pulse.remaining -= 1;
        if (s.pulse && s.pulse.remaining <= 0) s.pulse = null;
        if (Number(s.runtimeShakeFrames || 0) > 0) s.runtimeShakeFrames -= 1;
        if (Number(s.runtimeShakeFrames || 0) <= 0) s.runtimeShakePower = 0;
    }

    function updateInputLock() {
        const s = state();
        if (Number(s.inputLockFrames || 0) > 0) {
            s.inputLockFrames -= 1;
            if (root.Input && Input.clear) Input.clear();
            if (root.TouchInput && TouchInput.clear) TouchInput.clear();
        }
    }

    function anyInputActive() {
        if (root.TouchInput && TouchInput.isPressed && TouchInput.isPressed()) return true;
        if (!root.Input) return false;
        const keys = ["ok", "cancel", "menu", "shift", "up", "down", "left", "right", "pageup", "pagedown"];
        return keys.some(key => Input.isPressed && Input.isPressed(key));
    }

    function updateIdleTracking(scene) {
        if (!scene || sceneKind(scene) !== "map") return;
        const s = state();
        if (anyInputActive()) {
            s.trackers.idleFrames = 0;
            return;
        }
        s.trackers.idleFrames += 1;
        if (Settings.idleTriggerFrames > 0 && s.trackers.idleFrames === Settings.idleTriggerFrames && Settings.idleTriggerStage > 0) {
            FWB.playBreakMoment({ breakId: `idle_${$gameMap ? $gameMap.mapId() : 0}`, severity: Settings.idleTriggerStage, type: "randomSubtle", oneShot: false });
        }
    }

    function updateRandomSubtle(scene) {
        const s = state();
        if (!s.randomSubtleEnabled || sceneKind(scene) !== "map") return;
        if (root.$gameMap && $gameMap.isEventRunning && $gameMap.isEventRunning()) return;
        s.randomCooldown -= 1;
        if (s.randomCooldown > 0) return;

        const tierLevel = presenceTierLevel(s.presence);
        const minCooldown = Math.max(120, Settings.randomMinCooldownFrames - tierLevel * 180);
        const maxCooldown = Math.max(minCooldown + 60, Settings.randomMaxCooldownFrames - tierLevel * 420);
        s.randomCooldown = randomInt(minCooldown, maxCooldown);

        const presenceBoost = Math.floor(Number(s.presence || 0) / 30);
        const stage = clamp(randomInt(1, Settings.randomStageMax) + presenceBoost, 1, 4);
        const intensity = presenceIntensity(0.85);
        const roll = Math.random();

        if (tierLevel >= 3 && roll > 0.82) {
            FWB.runSequence("System Failure");
        } else if (tierLevel >= 2 && roll > 0.76) {
            FWB.runSequence("Player Spotted");
        } else if (roll < 0.34) {
            FWB.pulse(randomInt(25, 55 + tierLevel * 10), randomRange(0.15, 0.35 + intensity * 0.35));
        } else if (roll < 0.72) {
            FWB.setStage(stage, { fadeFrames: randomInt(20, 45), count: true, source: "presenceRandom" });
        } else if (roll < 0.88) {
            FWB.glitchNextMessage(randomRange(0.08, 0.12 + intensity * 0.22), tierLevel >= 2 ? 2 : 1);
        } else {
            FWB.flash(randomInt(6, 12 + tierLevel * 4), randomInt(50, 120 + tierLevel * 20));
        }
    }

    function updatePresenceDecay(scene) {
        const s = state();
        if (!s.presenceDecayEnabled) return;
        const frames = Math.max(1, Number(s.presenceDecayFrames || Settings.presenceDecayFrames || 900));
        s.presenceDecayCounter = Number(s.presenceDecayCounter || 0) + 1;
        if (s.presenceDecayCounter < frames) return;
        s.presenceDecayCounter = 0;
        const floor = clamp(Number(s.presenceDecayFloor || 0), 0, 100);
        if (Number(s.presence || 0) > floor) {
            FWB.setPresence(Math.max(floor, Number(s.presence || 0) - Math.max(0, Number(s.presenceDecayAmount || 1))), { source: "presenceDecay", fadeFrames: 45 });
        }
    }

    FWB.update = function(scene) {
        updatePresenceDecay(scene);
        updateSequence();
        updateTriggers(scene);
        updateCrackFades();
        updatePulseAndShake();
        updateControlDistortion(scene);
        updateInputLock();
        updateUiCorruption(scene);
        updateAudioCorruption(scene);
        updateRandomSubtle(scene);
        updateIdleTracking(scene);
        syncVariablesAndSwitches();
    };

    // -------------------------------------------------------------------------
    // Notetag processing
    // -------------------------------------------------------------------------

    function processGenericNote(note, sourceKey) {
        note = String(note || "");
        if (!note) return;
        const stage = noteValue(note, ["FWBStage", "FourthWallStage", "FourthWallCrack"]);
        if (stage !== null) FWB.setStage(Number(stage), { source: sourceKey });

        const breach = noteValue(note, ["FWBBreach", "FourthWallBreach"]);
        if (breach !== null) FWB.addBreach(Number(breach));

        const setPresence = noteValue(note, ["FWBPresence", "FourthWallPresence"]);
        if (setPresence !== null) FWB.setPresence(Number(setPresence), { source: sourceKey });
        const addPresence = noteValue(note, ["FWBAddPresence", "FourthWallAddPresence"]);
        if (addPresence !== null) FWB.addPresence(Number(addPresence), { source: sourceKey });

        const narrative = noteValue(note, ["FWBNarrativeState", "FourthWallNarrativeState"]);
        if (narrative !== null) FWB.setNarrativeState(String(narrative));
        const memory = noteValue(note, ["FWBMemory", "FourthWallMemory"]);
        if (memory !== null) { const pair = parseMemoryPair(memory); if (pair.key) FWB.memory.set(pair.key, pair.value); }
        const memoryAdd = noteValue(note, ["FWBMemoryAdd", "FourthWallMemoryAdd"]);
        if (memoryAdd !== null) { const pair = parseMemoryPair(memoryAdd); if (pair.key) FWB.memory.add(pair.key, Number(pair.value || 1)); }
        const flag = noteValue(note, ["FWBFlag", "FourthWallFlag"]);
        if (flag !== null) FWB.setFlag(String(flag), true);
        const audioCorruption = noteValue(note, ["FWBAudioCorruption", "FourthWallAudioCorruption"]);
        if (audioCorruption !== null) FWB.setAudioCorruption(parseKeyValueOptions(audioCorruption));

        const uiCorruption = noteValue(note, ["FWBSetUiCorruption", "FWBUiCorruption", "FourthWallUiCorruption"]);
        if (uiCorruption !== null) FWB.setUiCorruption(Number(uiCorruption), 0);

        const controlDistortion = noteValue(note, ["FWBControlDistortion", "FourthWallControlDistortion"]);
        if (controlDistortion !== null) {
            const opts = {};
            String(controlDistortion).split(",").forEach(pair => {
                const parts = pair.split("=");
                const key = String(parts[0] || "").trim();
                const raw = String(parts.slice(1).join("=") || "true").trim();
                if (!key) return;
                if (/^(true|false)$/i.test(raw)) opts[key] = /^true$/i.test(raw);
                else if (Number.isFinite(Number(raw))) opts[key] = Number(raw);
                else opts[key] = raw;
            });
            FWB.setControlDistortion(opts);
        }

        parseTriggerTags(note, sourceKey, "global");

        const pulse = noteValue(note, ["FWBPulse", "FourthWallPulse"]);
        if (pulse !== null) {
            const parts = pulse.split(",").map(v => v.trim());
            FWB.pulse(Number(parts[0] || 60), Number(parts[1] || 0.5));
        } else if (noteFlag(note, ["FWBPulse", "FourthWallPulse"])) {
            FWB.pulse(60, 0.5);
        }

        if (noteFlag(note, ["FWBFlash", "FourthWallFlash"])) FWB.flash(18, 140);

        const seq = noteValue(note, ["FWBSequence", "FourthWallSequence"]);
        if (seq) FWB.runSequence(seq);

        const glitch = noteValue(note, ["FWBGlitch", "FourthWallGlitch"]);
        if (glitch !== null) FWB.glitchNextMessage(Number(glitch), 1);

        const ce = noteValue(note, ["FWBCommonEvent", "FourthWallCommonEvent"]);
        if (ce !== null) safeReserveCommonEvent(Number(ce));
    }

    function parseRegionRulesFromMapNote(regionId) {
        if (!root.$dataMap) return [];
        const note = noteText($dataMap);
        const rules = [];
        const stage = noteValue(note, [`FWBRegion${regionId}Stage`, `FourthWallRegion${regionId}Stage`]);
        if (stage !== null) rules.push({ action: "stage", stage: Number(stage) });
        if (noteFlag(note, [`FWBRegion${regionId}Pulse`, `FourthWallRegion${regionId}Pulse`])) rules.push({ action: "pulse", duration: 60, intensity: 0.5 });
        if (noteFlag(note, [`FWBRegion${regionId}Clear`, `FourthWallRegion${regionId}Clear`])) rules.push({ action: "clear" });
        const breach = noteValue(note, [`FWBRegion${regionId}Breach`, `FourthWallRegion${regionId}Breach`]);
        if (breach !== null) rules.push({ action: "breach", amount: Number(breach) });
        const sequence = noteValue(note, [`FWBRegion${regionId}Sequence`, `FourthWallRegion${regionId}Sequence`]);
        if (sequence !== null) rules.push({ action: "sequence", sequenceName: String(sequence) });
        const glitch = noteValue(note, [`FWBRegion${regionId}Glitch`, `FourthWallRegion${regionId}Glitch`]);
        if (glitch !== null) rules.push({ action: "glitch", amount: Number(glitch), lines: 1 });
        const commonEvent = noteValue(note, [`FWBRegion${regionId}CommonEvent`, `FourthWallRegion${regionId}CommonEvent`]);
        if (commonEvent !== null) rules.push({ action: "commonEvent", id: Number(commonEvent) });
        return rules;
    }

    function runRegionRule(rule) {
        if (!rule) return;
        const action = String(rule.action || "stage").toLowerCase();
        if (action === "stage") FWB.setStage(Number(rule.stage || 1), { fadeFrames: rule.fadeFrames });
        else if (action === "pulse") FWB.pulse(Number(rule.duration || 60), Number(rule.intensity || 0.5));
        else if (action === "clear") FWB.clear({ fadeFrames: rule.fadeFrames || 45 });
        else if (action === "breach") FWB.addBreach(Number(rule.amount || 0));
        else if (action === "sequence") FWB.runSequence(String(rule.sequenceName || rule.name || "Reality Fracture"));
        else if (action === "glitch") FWB.glitchNextMessage(Number(rule.amount || 0.2), Number(rule.lines || 1));
        else if (action === "commonevent") safeReserveCommonEvent(Number(rule.id || rule.commonEventId || 0));
    }

    function onRegionChange(regionId) {
        const s = state();
        if (regionId === s.lastRegionId) return;
        s.lastRegionId = regionId;
        if (!regionId) return;
        if (Array.isArray(Settings.regionRules)) {
            Settings.regionRules.forEach(rule => {
                if (Number(rule.regionId || rule.region || 0) === Number(regionId)) runRegionRule(rule);
            });
        }
        parseRegionRulesFromMapNote(regionId).forEach(runRegionRule);
    }

    // -------------------------------------------------------------------------
    // Battle hooks
    // -------------------------------------------------------------------------

    function onEnemyAppear(enemy) {
        if (!enemy || !enemy.enemy) return;
        const data = enemy.enemy();
        const note = noteText(data);
        const stage = noteValue(note, ["FWBOnAppearStage", "FourthWallOnAppearStage"]);
        if (stage !== null) {
            const key = `enemyAppear_${root.$gameTroop ? $gameTroop.troopId() : 0}_${enemy.index ? enemy.index() : 0}_${stage}`;
            if (rememberTrigger(key)) FWB.setStage(Number(stage), { fadeFrames: 35 });
        }
        runEnemyAwareness(enemy, data, note);
        processGenericNote(note, `enemy_${data.id}`);
    }

    function checkBattleHpTriggers() {
        if (!root.$gameTroop || !$gameTroop.members) return;
        $gameTroop.members().forEach(enemy => {
            if (!enemy || !enemy.enemy || !enemy.isAlive || !enemy.isAlive()) return;
            const data = enemy.enemy();
            const note = noteText(data);
            [90, 75, 50, 25, 10].forEach(threshold => {
                const stage = noteValue(note, [`FWBStage${threshold}`, `FWBHP${threshold}`, `FourthWallStage${threshold}`]);
                if (stage === null) return;
                if (enemy.hpRate && enemy.hpRate() <= threshold / 100) {
                    const key = `enemyHp_${root.$gameTroop ? $gameTroop.troopId() : 0}_${enemy.index ? enemy.index() : 0}_${threshold}`;
                    if (rememberTrigger(key)) FWB.setStage(Number(stage), { fadeFrames: 30, glitchOnStage: true });
                }
            });
        });
    }

    function onUseItem(user, item) {
        if (!item) return;
        const note = noteText(item);
        const stage = noteValue(note, ["FWBSkillCrack", "FWBItemCrack", "FourthWallSkillCrack"]);
        if (stage !== null) FWB.setStage(Number(stage), { fadeFrames: 25, glitchOnStage: true });
        if (noteFlag(note, ["FWBSkillPulse", "FWBItemPulse", "FourthWallSkillPulse"])) FWB.pulse(50, 0.5);
        processGenericNote(note, `item_${item.id || 0}`);
    }

    function onBattlerDie(battler) {
        if (!battler) return;
        const s = state();
        if (battler.isActor && battler.isActor()) s.trackers.deathCount += 1;
        let data = null;
        if (battler.isActor && battler.isActor() && battler.actor) data = battler.actor();
        if (battler.isEnemy && battler.isEnemy() && battler.enemy) data = battler.enemy();
        const stage = noteValue(noteText(data), ["FWBDeathCrack", "FourthWallDeathCrack"]);
        if (stage !== null) FWB.setStage(Number(stage), { fadeFrames: 25, glitchOnStage: true });
        markSyncDirty();
    }

    // -------------------------------------------------------------------------
    // Menu and save corruption
    // -------------------------------------------------------------------------

    function canCorruptMenuText() {
        const s = state();
        const kind = sceneKind(SceneManager._scene);
        if (uiCorruptionLevel() > 0 && (kind === "menu" || kind === "file")) return true;
        if (kind === "file") return Settings.saveLoadCorruptionStage > 0 && s.stage >= Settings.saveLoadCorruptionStage;
        if (kind === "menu") return Settings.menuCorruptionStage > 0 && s.stage >= Settings.menuCorruptionStage;
        return false;
    }

    function maybeCorruptText(text, probability, amount) {
        if (!canCorruptMenuText() || access().disableFlicker) return text;
        const level = uiCorruptionLevel();
        probability = clamp(Number(probability || 0) + level * 0.08, 0, 1);
        amount = clamp(Number(amount || 0) + level * 0.04, 0, 1);
        if (Math.random() > probability) return text;
        return glitchText(text, amount, DEFAULT_SYMBOLS);
    }

    // -------------------------------------------------------------------------
    // Audio corruption aliases
    // -------------------------------------------------------------------------

    if (typeof AudioManager !== "undefined") {
        const _FWB_AudioManager_playSe = AudioManager.playSe;
        AudioManager.playSe = function(se) {
            const next = corruptAudioPayload(se, "se");
            if (!next) return;
            _FWB_AudioManager_playSe.call(this, next);
        };

        const _FWB_AudioManager_playBgm = AudioManager.playBgm;
        AudioManager.playBgm = function(bgm, pos) {
            const next = corruptAudioPayload(bgm, "bgm");
            if (!next) return;
            _FWB_AudioManager_playBgm.call(this, next, pos);
        };

        const _FWB_AudioManager_playBgs = AudioManager.playBgs;
        AudioManager.playBgs = function(bgs, pos) {
            const next = corruptAudioPayload(bgs, "bgs");
            if (!next) return;
            _FWB_AudioManager_playBgs.call(this, next, pos);
        };

        const _FWB_AudioManager_playMe = AudioManager.playMe;
        AudioManager.playMe = function(me) {
            const next = corruptAudioPayload(me, "me");
            if (!next) return;
            _FWB_AudioManager_playMe.call(this, next);
        };
    }

    // -------------------------------------------------------------------------
    // Core aliases
    // -------------------------------------------------------------------------

    if (typeof DataManager !== "undefined") {
        const _DataManager_createGameObjects = DataManager.createGameObjects;
        DataManager.createGameObjects = function() {
            _DataManager_createGameObjects.apply(this, arguments);
            if (root.$gameSystem) $gameSystem._fourthWallBreaks = defaultState();
        };

        const _DataManager_setupNewGame = DataManager.setupNewGame;
        DataManager.setupNewGame = function() {
            _DataManager_setupNewGame.apply(this, arguments);
            if (root.$gameSystem) $gameSystem._fourthWallBreaks = defaultState();
            markSyncDirty();
        };

        const _DataManager_saveGame = DataManager.saveGame;
        DataManager.saveGame = function(savefileId) {
            if (Settings.fakeSystemEnabled && state().fakeSaveFailureNext) {
                state().fakeSaveFailureNext = false;
                FWB.fakeSaveFailure();
            }
            const result = _DataManager_saveGame.apply(this, arguments);
            const mark = value => {
                if (value !== false) {
                    const s = state();
                    s.trackers.saveCount += 1;
                    markSyncDirty();
                }
                return value;
            };
            if (result && typeof result.then === "function") return result.then(mark);
            return mark(result);
        };

        const _DataManager_loadGame = DataManager.loadGame;
        DataManager.loadGame = function(savefileId) {
            const result = _DataManager_loadGame.apply(this, arguments);
            const mark = value => {
                if (value !== false) {
                    const s = state();
                    s.trackers.loadCount += 1;
                    markSyncDirty();
                }
                return value;
            };
            if (result && typeof result.then === "function") return result.then(mark);
            return mark(result);
        };
    }

    if (typeof Scene_Base !== "undefined") {
        const _Scene_Base_update = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function() {
            _Scene_Base_update.apply(this, arguments);
            FWB.update(this);
            updateOverlay(this);
        };
    }

    if (typeof Scene_Menu !== "undefined") {
        const _Scene_Menu_start = Scene_Menu.prototype.start;
        Scene_Menu.prototype.start = function() {
            _Scene_Menu_start.apply(this, arguments);
            const s = state();
            s.trackers.menuOpenCount += 1;
            const stage = noteValue(noteText(root.$dataSystem), ["FWBMenuOpenStage"]);
            if (stage !== null) FWB.setStage(Number(stage), { fadeFrames: 30 });
            markSyncDirty();
        };
    }

    if (typeof Scene_Gameover !== "undefined") {
        const _Scene_Gameover_start = Scene_Gameover.prototype.start;
        Scene_Gameover.prototype.start = function() {
            _Scene_Gameover_start.apply(this, arguments);
            const s = state();
            s.trackers.deathCount += 1;
            FWB.playBreakMoment({ breakId: `gameover_${s.trackers.deathCount}`, severity: Math.max(1, s.stage), type: "deathBreak", oneShot: false });
            markSyncDirty();
        };
    }

    if (typeof Game_Map !== "undefined") {
        const _Game_Map_setup = Game_Map.prototype.setup;
        Game_Map.prototype.setup = function(mapId) {
            _Game_Map_setup.apply(this, arguments);
            const s = state();
            s.lastRegionId = 0;
            s.lastMapId = mapId;
            clearTriggerPrefix("enemyAppear_");
            clearTriggerPrefix("enemyHp_");
            clearTriggerPrefix("mapNote_");
            clearTriggerPrefix(`region_${mapId}_`);
            const visits = s.trackers.mapVisits;
            visits[mapId] = (visits[mapId] || 0) + 1;
            FWB.emit("mapEntered", { mapId: mapId, visits: visits[mapId] });
            if (root.$dataMap) {
                const note = noteText($dataMap);
                processGenericNote(note, `map_${mapId}`);
                const enterStage = noteValue(note, ["FWBMapEnterStage", "FourthWallMapEnterStage"]);
                if (enterStage !== null) FWB.setStage(Number(enterStage), { fadeFrames: 35 });
                const enterSequence = noteValue(note, ["FWBMapEnterSequence", "FourthWallMapEnterSequence"]);
                if (enterSequence !== null) FWB.runSequence(String(enterSequence));
                if (noteFlag(note, ["FWBForbiddenRoom", "FourthWallForbiddenRoom"])) {
                    const key = `forbidden_${mapId}_${visits[mapId]}`;
                    if (visits[mapId] > 1 && rememberTrigger(key)) FWB.escalate(1, { fadeFrames: 35 });
                }
            }
        };
    }

    if (typeof Game_Player !== "undefined") {
        fwbOriginalExecuteMove = Game_Player.prototype.executeMove;
        if (Game_Player.prototype.executeMove) {
            const _Game_Player_executeMove = Game_Player.prototype.executeMove;
            Game_Player.prototype.executeMove = function(direction) {
                if (fwbApplyingDelayedMove || !isControlDistortionActive() || (root.$gameMessage && $gameMessage.isBusy && $gameMessage.isBusy())) {
                    _Game_Player_executeMove.call(this, direction);
                    return;
                }
                const d = state().controlDistortion || {};
                if (Number(d.randomBlockChance || 0) > 0 && Math.random() < Number(d.randomBlockChance || 0)) return;
                const distorted = distortDirection(direction);
                if (Number(d.delayFrames || 0) > 0) {
                    state().controlDistortionQueue.push({ direction: distorted, frames: Number(d.delayFrames || 0) });
                    return;
                }
                _Game_Player_executeMove.call(this, distorted);
            };
        }

        const _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
        Game_Player.prototype.updateNonmoving = function(wasTriggered, sceneActive) {
            _Game_Player_updateNonmoving.apply(this, arguments);
            if (this.regionId) onRegionChange(this.regionId());
        };
    }

    if (typeof Game_Event !== "undefined") {
        const _Game_Event_start = Game_Event.prototype.start;
        Game_Event.prototype.start = function() {
            const mapId = root.$gameMap && $gameMap.mapId ? $gameMap.mapId() : 0;
            const eventId = this.eventId ? this.eventId() : 0;
            const key = `${mapId}:${eventId}`;
            const s = state();
            s.trackers.interactionCounts[key] = (s.trackers.interactionCounts[key] || 0) + 1;
            if (Settings.repeatedInteractionThreshold > 0 && s.trackers.interactionCounts[key] === Settings.repeatedInteractionThreshold && Settings.repeatedInteractionStage > 0) {
                FWB.playBreakMoment({ breakId: `repeat_${key}_${s.trackers.interactionCounts[key]}`, severity: Settings.repeatedInteractionStage, type: "randomSubtle" });
            }
            const eventNote = this.event ? noteText(this.event()) : "";
            const commentNote = pageCommentText(this);
            processGenericNote(`${eventNote}\n${commentNote}`, `event_${key}`);
            _Game_Event_start.apply(this, arguments);
        };
    }

    if (typeof Game_Enemy !== "undefined") {
        const _Game_Enemy_setup = Game_Enemy.prototype.setup;
        Game_Enemy.prototype.setup = function(enemyId, x, y) {
            _Game_Enemy_setup.apply(this, arguments);
            onEnemyAppear(this);
        };
    }

    if (typeof Game_Battler !== "undefined") {
        const _Game_Battler_useItem = Game_Battler.prototype.useItem;
        Game_Battler.prototype.useItem = function(item) {
            _Game_Battler_useItem.apply(this, arguments);
            onUseItem(this, item);
        };
    }

    if (typeof Game_BattlerBase !== "undefined") {
        const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
        Game_BattlerBase.prototype.die = function() {
            const wasAlive = this.isAlive ? this.isAlive() : false;
            _Game_BattlerBase_die.apply(this, arguments);
            if (wasAlive) onBattlerDie(this);
        };
    }

    if (typeof BattleManager !== "undefined") {
        const _BattleManager_startBattle = BattleManager.startBattle;
        if (_BattleManager_startBattle) {
            BattleManager.startBattle = function() {
                const s = state();
                s.battleBreaks = s.battleBreaks || {};
                s.battleBreaks.awareEnemies = {};
                s.battleBreaks.fakeLogLines = [];
                FWB.emit("battleStarted", {});
                _BattleManager_startBattle.apply(this, arguments);
            };
        }

        const _BattleManager_update = BattleManager.update;
        BattleManager.update = function(timeActive) {
            _BattleManager_update.apply(this, arguments);
            if (sceneKind(SceneManager._scene) === "battle") checkBattleHpTriggers();
        };

        const _BattleManager_endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function(result) {
            _BattleManager_endBattle.apply(this, arguments);
            FWB.emit("battleEnded", { result: result });
            clearTriggerPrefix("enemyAppear_");
            clearTriggerPrefix("enemyHp_");
            if (Settings.clearAfterBattle) FWB.clear({ fadeFrames: 45 });
        };
    }

    if (typeof Game_Message !== "undefined") {
        const _Game_Message_add = Game_Message.prototype.add;
        Game_Message.prototype.add = function(text) {
            const s = state();
            if (s.textGlitchNext && Number(s.textGlitchNext.lines || 0) > 0) {
                text = glitchText(text, s.textGlitchNext.amount, s.textGlitchNext.symbols);
                s.textGlitchNext.lines -= 1;
                if (s.textGlitchNext.lines <= 0) s.textGlitchNext = null;
            }
            _Game_Message_add.call(this, text);
        };

        if (Game_Message.prototype.setSpeakerName) {
            const _Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
            Game_Message.prototype.setSpeakerName = function(speakerName) {
                const s = state();
                if (s.speakerGlitchNext && Number(s.speakerGlitchNext.uses || 0) > 0) {
                    speakerName = glitchText(speakerName, s.speakerGlitchNext.amount, s.speakerGlitchNext.symbols);
                    s.speakerGlitchNext.uses -= 1;
                    if (s.speakerGlitchNext.uses <= 0) s.speakerGlitchNext = null;
                }
                _Game_Message_setSpeakerName.call(this, speakerName);
            };
        }
    }

    if (typeof Window_BattleLog !== "undefined") {
        const _FWB_Window_BattleLog_addText = Window_BattleLog.prototype.addText;
        Window_BattleLog.prototype.addText = function(text) {
            _FWB_Window_BattleLog_addText.call(this, maybeCorruptBattleLogText(text));
        };
    }

    if (typeof Window_Command !== "undefined") {
        const _Window_Command_drawItem = Window_Command.prototype.drawItem;
        Window_Command.prototype.drawItem = function(index) {
            const level = uiCorruptionLevel();
            const chance = 0.18 + level * 0.08;
            if (canCorruptMenuText() && Math.random() < chance) {
                const rect = this.itemLineRect(index);
                const dx = level > 0 ? randomInt(-level * 2, level * 2) : 0;
                const dy = level > 1 ? randomInt(-level, level) : 0;
                this.resetTextColor();
                this.changePaintOpacity(this.isCommandEnabled(index));
                const name = maybeCorruptText(this.commandName(index), 1, 0.25);
                this.drawText(name, rect.x + dx, rect.y + dy, rect.width, this.itemTextAlign());
                this.changePaintOpacity(true);
            } else {
                _Window_Command_drawItem.apply(this, arguments);
            }
        };
    }

    if (typeof Window_Options !== "undefined" && Window_Options.prototype.statusText) {
        const _Window_Options_statusText = Window_Options.prototype.statusText;
        Window_Options.prototype.statusText = function(index) {
            const name = this.commandName ? this.commandName(index) : "";
            const overrides = state().fakeOptionOverrides || {};
            if (Object.prototype.hasOwnProperty.call(overrides, name)) return String(overrides[name]);
            return _Window_Options_statusText.apply(this, arguments);
        };
    }

    if (typeof Window_SavefileList !== "undefined" && Window_SavefileList.prototype.drawTitle) {
        const _Window_SavefileList_drawTitle = Window_SavefileList.prototype.drawTitle;
        Window_SavefileList.prototype.drawTitle = function(savefileId, x, y) {
            if (canCorruptMenuText() && Math.random() < 0.22) {
                const title = maybeCorruptText(TextManager.file + " " + savefileId, 1, 0.3);
                this.drawText(title, x, y, 180);
            } else {
                _Window_SavefileList_drawTitle.apply(this, arguments);
            }
        };
    }

    // -------------------------------------------------------------------------
    // Plugin commands
    // -------------------------------------------------------------------------

    PluginManager.registerCommand(PLUGIN_NAME, "SetCrackStage", args => {
        FWB.setStage(argNumber(args, "stage", 1), { fadeFrames: argNumber(args, "fadeFrames", 45), force: argBool(args, "force", false) });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "EscalateCrack", args => {
        FWB.escalate(argNumber(args, "amount", 1), { fadeFrames: argNumber(args, "fadeFrames", 35) });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ReduceCrackStage", args => {
        FWB.reduce(argNumber(args, "amount", 1), { fadeFrames: argNumber(args, "fadeFrames", 45) });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearCracks", args => {
        FWB.clear({ fadeFrames: argNumber(args, "fadeFrames", 60) });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "PulseCrack", args => {
        FWB.pulse(argNumber(args, "duration", 60), argNumber(args, "intensity", 0.5));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "FlashCrack", args => {
        FWB.flash(argNumber(args, "duration", 24), argNumber(args, "opacity", 160));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "LockCrackStage", () => FWB.lock());
    PluginManager.registerCommand(PLUGIN_NAME, "UnlockCrackStage", () => FWB.unlock());

    PluginManager.registerCommand(PLUGIN_NAME, "SetCrackMode", args => {
        FWB.setMode(argString(args, "mode", "hybrid"));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "LockInput", args => {
        FWB.lockInput(argNumber(args, "frames", 60));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "UnlockInput", () => FWB.unlockInput());

    PluginManager.registerCommand(PLUGIN_NAME, "LockBreachMeter", () => FWB.lockBreach());
    PluginManager.registerCommand(PLUGIN_NAME, "UnlockBreachMeter", () => FWB.unlockBreach());

    PluginManager.registerCommand(PLUGIN_NAME, "RegisterSequence", args => {
        FWB.registerSequence(argString(args, "sequenceName", "Custom Break"), argString(args, "customJson", "[]"));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "QueueBreakSequence", args => {
        FWB.queueSequence(argString(args, "sequenceName", "Reality Fracture"), argString(args, "customJson", ""));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "PauseSequence", () => FWB.pauseSequence());
    PluginManager.registerCommand(PLUGIN_NAME, "ResumeSequence", () => FWB.resumeSequence());

    PluginManager.registerCommand(PLUGIN_NAME, "StopSequence", args => {
        FWB.stopSequence(argBool(args, "clearQueue", false));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearSequenceMemory", args => {
        FWB.clearSequenceMemory(argString(args, "prefix", ""));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ValidateSequence", args => {
        const result = FWB.validateSequence(argString(args, "customJson", "[]"));
        console.log(`[${PLUGIN_NAME}] ValidateSequence`, result);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "RunBreakSequence", args => {
        FWB.runSequence(argString(args, "sequenceName", "Reality Fracture"), argString(args, "customJson", ""));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "AddBreachMeter", args => {
        FWB.addBreach(argNumber(args, "amount", 10));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetBreachMeter", args => {
        FWB.setBreach(argNumber(args, "value", 50));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "RepairScreen", args => {
        FWB.repair(argString(args, "mode", "oneStage"), argNumber(args, "fadeFrames", 60));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "GlitchNextMessage", args => {
        FWB.glitchNextMessage(argNumber(args, "amount", 0.2), argNumber(args, "lines", 1), argString(args, "symbols", DEFAULT_SYMBOLS));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "GlitchSpeakerName", args => {
        FWB.glitchSpeakerName(argNumber(args, "amount", 0.35), argNumber(args, "uses", 1), argString(args, "symbols", DEFAULT_SYMBOLS));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "PlayBreakMoment", args => {
        FWB.playBreakMoment({
            breakId: argString(args, "breakId", ""),
            severity: argNumber(args, "severity", 1),
            type: argString(args, "type", "dialogue"),
            speakerName: argString(args, "speakerName", ""),
            messageText: argString(args, "messageText", ""),
            faceEventId: argNumber(args, "faceEventId", 0),
            addBreach: argNumber(args, "addBreach", 0),
            addPresence: argNumber(args, "addPresence", 0),
            oneShot: argBool(args, "oneShot", false)
        });
    });


    PluginManager.registerCommand(PLUGIN_NAME, "SetPresence", args => {
        FWB.setPresence(argNumber(args, "value", 50));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "AddPresence", args => {
        FWB.addPresence(argNumber(args, "amount", 10));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearPresence", () => {
        FWB.clearPresence();
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetPresenceDecay", args => {
        FWB.setPresenceDecay(
            argBool(args, "enabled", true),
            argNumber(args, "amount", 1),
            argNumber(args, "frames", 900),
            argNumber(args, "floor", 0)
        );
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetNarrativeState", args => {
        FWB.setNarrativeState(argString(args, "stateName", "neutral"));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetRandomSubtle", args => {
        FWB.setRandomSubtle(argBool(args, "enabled", true));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetAccessibility", args => {
        FWB.setAccessibility({
            reduceFlashing: argBool(args, "reduceFlashing", false),
            reduceScreenShake: argBool(args, "reduceScreenShake", false),
            disableFlicker: argBool(args, "disableFlicker", false),
            disableStage4: argBool(args, "disableStage4", false),
            maxOverlayOpacity: argNumber(args, "maxOverlayOpacity", 255)
        });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "RegisterTrigger", args => {
        FWB.registerTrigger({
            id: argString(args, "triggerId", ""),
            condition: argString(args, "condition", "presence GTE 75"),
            action: argString(args, "action", "sequence"),
            value: argString(args, "value", "System Failure"),
            cooldown: argNumber(args, "cooldown", 0),
            once: argBool(args, "once", false),
            scope: argString(args, "scope", "global")
        });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearTriggers", args => {
        FWB.clearTriggers(argString(args, "scope", ""));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetControlDistortion", args => {
        FWB.setControlDistortion({
            duration: argNumber(args, "duration", 180),
            invertX: argBool(args, "invertX", false),
            invertY: argBool(args, "invertY", false),
            driftChance: argNumber(args, "driftChance", 0),
            randomBlockChance: argNumber(args, "randomBlockChance", 0),
            delayFrames: argNumber(args, "delayFrames", 0),
            forceDirection: argNumber(args, "forceDirection", 0)
        });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearControlDistortion", () => FWB.clearControlDistortion());

    PluginManager.registerCommand(PLUGIN_NAME, "SetUiCorruption", args => {
        FWB.setUiCorruption(argNumber(args, "level", 1), argNumber(args, "duration", 0));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearUiCorruption", () => FWB.clearUiCorruption());

    PluginManager.registerCommand(PLUGIN_NAME, "FakeSystemMessage", args => {
        FWB.fakeSystemMessage(argString(args, "text", "Runtime integrity warning."), argString(args, "speaker", "SYSTEM"));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "FakeSaveFailure", args => {
        FWB.fakeSaveFailure(argString(args, "text", "Save failed. File integrity compromised."));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "FakeOptionChange", args => {
        FWB.fakeOptionChange(argString(args, "optionName", "Volume"), argString(args, "fakeValue", "???"));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetMemory", args => {
        FWB.memory.set(argString(args, "key", "key"), argString(args, "value", "true"));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "AddMemory", args => {
        FWB.memory.add(argString(args, "key", "counter"), argNumber(args, "amount", 1));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearMemory", args => {
        FWB.memory.clear(argString(args, "key", ""));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetFlag", args => {
        FWB.setFlag(argString(args, "key", "flag"), argBool(args, "value", true));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearFlag", args => {
        FWB.clearFlag(argString(args, "key", "flag"));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "FakeBattleDamage", args => {
        FWB.fakeDamage(argNumber(args, "targetIndex", 0), argNumber(args, "amount", 9999), argString(args, "text", ""));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "FakeBattleHeal", args => {
        FWB.fakeHeal(argNumber(args, "targetIndex", 0), argNumber(args, "amount", 9999), argString(args, "text", ""));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "CorruptBattleLog", args => {
        FWB.corruptBattleLog(argNumber(args, "amount", 0.25), argNumber(args, "lines", 3));
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetAudioCorruption", args => {
        FWB.setAudioCorruption({
            pitchDrift: argNumber(args, "pitchDrift", 0.06),
            volumeFlutter: argNumber(args, "volumeFlutter", 0.12),
            dropoutChance: argNumber(args, "dropoutChance", 0),
            wrongSeChance: argNumber(args, "wrongSeChance", 0),
            duration: argNumber(args, "duration", 300)
        });
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ClearAudioCorruption", () => FWB.clearAudioCorruption());

    PluginManager.registerCommand(PLUGIN_NAME, "DebugAction", args => {
        const action = argString(args, "action", "printState");
        if (action === "printState") console.log(`[${PLUGIN_NAME}] state`, JSON.parse(JSON.stringify(state())));
        else if (action === "testStage1") FWB.setStage(1, { force: true });
        else if (action === "testStage2") FWB.setStage(2, { force: true });
        else if (action === "testStage3") FWB.setStage(3, { force: true });
        else if (action === "testStage4") FWB.setStage(4, { force: true });
        else if (action === "testPulse") FWB.pulse(60, 0.7);
        else if (action === "testSequence") FWB.runSequence("Reality Fracture");
        else if (action === "clear") FWB.clear({ force: true });
        else if (action === "resetMemory") {
            if (root.$gameSystem) $gameSystem._fourthWallBreaks = defaultState();
            markSyncDirty();
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ForceSync", () => syncVariablesAndSwitches());

    // -------------------------------------------------------------------------
    // Public read-only helpers
    // -------------------------------------------------------------------------

    FWB.triggerCount = function() { return (state().triggerRules || []).length; };
    FWB.activeTriggers = function() { return (state().triggerRules || []).slice(); };
    FWB.uiCorruptionLevel = function() { return uiCorruptionLevel(); };

    FWB.version = VERSION;
    FWB.presenceTierName = presenceTierName;
    FWB.presenceTierLevel = presenceTierLevel;
    FWB.stageFromPresence = stageFromPresence;
    FWB.settings = Settings;
    FWB.profiles = Profiles;
    FWB.sequences = SEQUENCES;
    FWB.sequenceActions = SEQUENCE_ACTIONS;
    FWB.state = state;
    FWB.sync = syncVariablesAndSwitches;
    FWB.processNote = processGenericNote;

    // Preload default pictures once the image manager exists.
    if (root.ImageManager && ImageManager.loadPicture) {
        for (let stage = 1; stage <= 4; stage++) {
            ImageManager.loadPicture(profile(stage).image);
        }
    }

    logDebug(`loaded v${VERSION}`);
})();
