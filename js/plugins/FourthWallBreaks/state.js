// FourthWallBreaks/state.js
// State management for the FourthWallBreaks plugin
import { clamp, randomInt } from './helpers.js';

export function defaultState(VERSION, Settings) {
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
        visualDistortion: {
            enabled: false,
            remaining: 0,
            breathAmount: 0,
            breathSpeed: 0.05,
            rippleAmount: 0,
            zoomWobble: 0,
            rotationWobble: 0,
            warpAmount: 0,
            phase: 0
        },
        fakeCrash: {
            enabled: false,
            remaining: 0,
            duration: 0,
            message: "",
            returnStage: 0,
            hasMessaged: false
        },
        debugSnapshotHistory: [],
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

export function migrateState(s, VERSION, Settings, defaultStateFn) {
    const def = defaultStateFn(VERSION, Settings);
    if (!s || typeof s !== "object") return def;
    if (s._migratedVersion === VERSION) return s;
    Object.keys(def).forEach(key => {
        if (s[key] === undefined) s[key] = def[key];
    });
    s.version = VERSION;
    s._migratedVersion = VERSION;
    return s;
}
