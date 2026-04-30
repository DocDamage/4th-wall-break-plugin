/*:
 * @target MZ
 * @plugindesc v4.0.0 Feature-packed staged 4th-wall break / screen-crack system with escalation, breach meter, tracking, battle hooks, note tags, debug, and accessibility.
 * @author ChatGPT
 * @url
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
 *   <FWBCommonEvent: 12>
 *   <FWBForbiddenRoom>
 *   <FWBOnAppearStage: 2>        enemy note
 *   <FWBStage75: 2>              enemy HP <= 75%
 *   <FWBStage50: 3>              enemy HP <= 50%
 *   <FWBStage25: 4>              enemy HP <= 25%
 *   <FWBSkillCrack: 2>           skill/item note
 *   <FWBSkillPulse>
 *   <FWBDeathCrack: 3>           actor/enemy note
 *   <FWBRegion13Stage: 2>        map note; triggers on region 13
 *   <FWBRegion13Pulse>
 *   <FWBRegion13Clear>
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
 * @desc Example: [{"regionId":13,"action":"stage","stage":2},{"regionId":14,"action":"pulse","duration":60,"intensity":0.5},{"regionId":15,"action":"clear"}]
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
 * @arg oneShot
 * @type boolean
 * @default false
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
    const VERSION = "4.0.0";
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
    // State
    // -------------------------------------------------------------------------

    function defaultState() {
        return {
            version: VERSION,
            stage: 0,
            targetStage: 0,
            mode: Settings.defaultCrackMode,
            locked: false,
            cracks: [],
            nextCrackId: 1,
            breachMeter: 0,
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

    function syncVariablesAndSwitches() {
        const s = state();
        if (root.$gameVariables) {
            if (Settings.stageVariableId > 0) $gameVariables.setValue(Settings.stageVariableId, s.stage);
            if (Settings.breachVariableId > 0) $gameVariables.setValue(Settings.breachVariableId, Math.round(s.breachMeter));
            if (Settings.totalBreaksVariableId > 0) $gameVariables.setValue(Settings.totalBreaksVariableId, s.totalBreaks);
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
        syncVariablesAndSwitches();
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
    };

    FWB.unlock = function() {
        state().locked = false;
    };

    FWB.setMode = function(mode) {
        mode = String(mode || "hybrid").toLowerCase();
        if (!["replace", "stack", "hybrid"].includes(mode)) mode = "hybrid";
        state().mode = mode;
    };

    FWB.setRandomSubtle = function(enabled) {
        const s = state();
        s.randomSubtleEnabled = !!enabled;
        s.randomCooldown = randomInt(Settings.randomMinCooldownFrames, Settings.randomMaxCooldownFrames);
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
        s.breachMeter = clamp(Number(value || 0), 0, 100);
        if (s.bindBreachToStage) {
            const stage = stageFromBreach(s.breachMeter);
            FWB.setStage(stage, Object.assign({ count: false }, options || {}));
        }
        syncVariablesAndSwitches();
        return s.breachMeter;
    };

    FWB.addBreach = function(amount, options) {
        const s = state();
        return FWB.setBreach((s.breachMeter || 0) + Number(amount || 0), options || {});
    };

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
            .replace(/\{breach\}/gi, String(Math.round(s.breachMeter || 0)));
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
        syncVariablesAndSwitches();
        return true;
    };

    // -------------------------------------------------------------------------
    // Sequences
    // -------------------------------------------------------------------------

    FWB.runSequence = function(name, customJson) {
        const s = state();
        let steps = null;
        if (customJson) steps = tryParseJson(customJson, null);
        if (!Array.isArray(steps)) steps = SEQUENCES[String(name || "Reality Fracture")];
        if (!Array.isArray(steps)) steps = SEQUENCES["Reality Fracture"];
        s.sequence = {
            name: String(name || "Custom"),
            frame: 0,
            index: 0,
            steps: JSON.parse(JSON.stringify(steps)).sort((a, b) => Number(a.time || 0) - Number(b.time || 0))
        };
        logDebug("sequence", s.sequence.name, s.sequence.steps);
    };

    function executeSequenceStep(step) {
        if (!step) return;
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
            case "commonevent":
                safeReserveCommonEvent(Number(step.id || step.commonEventId || 0));
                break;
        }
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
            container._fwbSprites.push({ sprite: red, x: -2, y: 0, tint: 0xff7777, alpha: 0.25 });
            container._fwbSprites.push({ sprite: blue, x: 2, y: 0, tint: 0x77aaff, alpha: 0.25 });
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
        overlay._fwbScanlines.clear();
        if (stage <= 0 || access().disableFlicker) return;

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
        if (scanAmount > 0) {
            overlay._fwbScanlines.beginFill(0x000000, scanAmount * 0.35);
            for (let y = 0; y < Graphics.height; y += 6) {
                overlay._fwbScanlines.drawRect(0, y, Graphics.width, 1);
            }
            overlay._fwbScanlines.endFill();
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
        overlay._fwbDebugText.text = `FWB v${VERSION}\nStage: ${s.stage}  Breach: ${Math.round(s.breachMeter)}\nMode: ${s.mode}  Locked: ${s.locked}\nCracks: ${s.cracks.length}\nSeq: ${s.sequence ? s.sequence.name : "none"}`;
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

    function updateSequence() {
        const s = state();
        if (!s.sequence) return;
        while (s.sequence.index < s.sequence.steps.length && Number(s.sequence.steps[s.sequence.index].time || 0) <= s.sequence.frame) {
            executeSequenceStep(s.sequence.steps[s.sequence.index]);
            s.sequence.index += 1;
        }
        s.sequence.frame += 1;
        if (s.sequence.index >= s.sequence.steps.length) {
            s.sequence = null;
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
        s.randomCooldown = randomInt(Settings.randomMinCooldownFrames, Settings.randomMaxCooldownFrames);
        const stage = randomInt(1, Settings.randomStageMax);
        const roll = Math.random();
        if (roll < 0.4) FWB.pulse(randomInt(25, 55), randomRange(0.15, 0.35));
        else if (roll < 0.8) FWB.setStage(stage, { fadeFrames: randomInt(20, 45), count: true });
        else FWB.flash(randomInt(6, 12), randomInt(50, 120));
    }

    FWB.update = function(scene) {
        updateSequence();
        updateCrackFades();
        updatePulseAndShake();
        updateInputLock();
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
        syncVariablesAndSwitches();
    }

    // -------------------------------------------------------------------------
    // Menu and save corruption
    // -------------------------------------------------------------------------

    function canCorruptMenuText() {
        const s = state();
        const kind = sceneKind(SceneManager._scene);
        if (kind === "file") return Settings.saveLoadCorruptionStage > 0 && s.stage >= Settings.saveLoadCorruptionStage;
        if (kind === "menu") return Settings.menuCorruptionStage > 0 && s.stage >= Settings.menuCorruptionStage;
        return false;
    }

    function maybeCorruptText(text, probability, amount) {
        if (!canCorruptMenuText() || access().disableFlicker) return text;
        if (Math.random() > probability) return text;
        return glitchText(text, amount, DEFAULT_SYMBOLS);
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
            syncVariablesAndSwitches();
        };

        const _DataManager_saveGame = DataManager.saveGame;
        DataManager.saveGame = function(savefileId) {
            const result = _DataManager_saveGame.apply(this, arguments);
            const mark = value => {
                if (value !== false) {
                    const s = state();
                    s.trackers.saveCount += 1;
                    syncVariablesAndSwitches();
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
                    syncVariablesAndSwitches();
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
            syncVariablesAndSwitches();
        };
    }

    if (typeof Scene_Gameover !== "undefined") {
        const _Scene_Gameover_start = Scene_Gameover.prototype.start;
        Scene_Gameover.prototype.start = function() {
            _Scene_Gameover_start.apply(this, arguments);
            const s = state();
            s.trackers.deathCount += 1;
            FWB.playBreakMoment({ breakId: `gameover_${s.trackers.deathCount}`, severity: Math.max(1, s.stage), type: "deathBreak", oneShot: false });
            syncVariablesAndSwitches();
        };
    }

    if (typeof Game_Map !== "undefined") {
        const _Game_Map_setup = Game_Map.prototype.setup;
        Game_Map.prototype.setup = function(mapId) {
            _Game_Map_setup.apply(this, arguments);
            const s = state();
            s.lastRegionId = 0;
            s.lastMapId = mapId;
            clearTriggerPrefix(`region_${mapId}_`);
            const visits = s.trackers.mapVisits;
            visits[mapId] = (visits[mapId] || 0) + 1;
            if (root.$dataMap) {
                const note = noteText($dataMap);
                processGenericNote(note, `map_${mapId}`);
                if (noteFlag(note, ["FWBForbiddenRoom", "FourthWallForbiddenRoom"])) {
                    const key = `forbidden_${mapId}_${visits[mapId]}`;
                    if (visits[mapId] > 1 && rememberTrigger(key)) FWB.escalate(1, { fadeFrames: 35 });
                }
            }
        };
    }

    if (typeof Game_Player !== "undefined") {
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
        const _BattleManager_update = BattleManager.update;
        BattleManager.update = function(timeActive) {
            _BattleManager_update.apply(this, arguments);
            checkBattleHpTriggers();
        };

        const _BattleManager_endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function(result) {
            _BattleManager_endBattle.apply(this, arguments);
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

    if (typeof Window_Command !== "undefined") {
        const _Window_Command_drawItem = Window_Command.prototype.drawItem;
        Window_Command.prototype.drawItem = function(index) {
            if (canCorruptMenuText() && Math.random() < 0.18) {
                const rect = this.itemLineRect(index);
                this.resetTextColor();
                this.changePaintOpacity(this.isCommandEnabled(index));
                const name = maybeCorruptText(this.commandName(index), 1, 0.25);
                this.drawText(name, rect.x, rect.y, rect.width, this.itemTextAlign());
                this.changePaintOpacity(true);
            } else {
                _Window_Command_drawItem.apply(this, arguments);
            }
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
            oneShot: argBool(args, "oneShot", false)
        });
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
            syncVariablesAndSwitches();
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ForceSync", () => syncVariablesAndSwitches());

    // -------------------------------------------------------------------------
    // Public read-only helpers
    // -------------------------------------------------------------------------

    FWB.version = VERSION;
    FWB.settings = Settings;
    FWB.profiles = Profiles;
    FWB.sequences = SEQUENCES;
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
