// stylePacks.js - Style Pack Matrix system for FourthWallBreaks
// Standalone ES module. Exports are stripped by the release bundler.

import { clamp } from './FourthWallBreaks/helpers.js';

// ------------------------------------------------------------------
// Internal registries
// ------------------------------------------------------------------

const _stylePackRegistry = {};
const _styleRecipeRegistry = {};
const _builtInPackKeys = new Set();

const CHANNELS = ["cracks", "overlays", "ui", "audio", "presence", "sequences"];

let _debugMode = false;

function logDebug(...args) {
    if (!_debugMode) return;
    console.log("[FWB StylePacks]", ...args);
}

function packKey(channel, name) {
    return `${channel}:${name}`;
}

function isValidChannel(channel) {
    return CHANNELS.includes(channel);
}

function ensureStylePacksState(state) {
    if (!state) return {};
    if (!state.stylePacks || typeof state.stylePacks !== "object") {
        state.stylePacks = {
            cracks: "",
            overlays: "",
            ui: "",
            audio: "",
            presence: "",
            sequences: ""
        };
    }
    return state.stylePacks;
}

// ------------------------------------------------------------------
// Built-in pack definitions
// ------------------------------------------------------------------

const BUILT_IN_CRACK_PACKS = {
    clean_glass: {
        stageImages: [
            "FourthWall_01_HairlineFracture",
            "FourthWall_02_RealityCrack",
            "FourthWall_03_ScreenShatter",
            "FourthWall_04_FullBreach"
        ],
        opacity: 1.0,
        blendMode: "normal",
        flicker: 0,
        chromatic: false,
        scanlines: 0,
        randomScale: 0.02,
        randomRotation: 0.01,
        randomOffset: 8
    },
    deep_fracture: {
        stageImages: [
            "FourthWall_01_HairlineFracture",
            "FourthWall_02_RealityCrack",
            "FourthWall_03_ScreenShatter",
            "FourthWall_04_FullBreach"
        ],
        opacity: 1.0,
        blendMode: "normal",
        flicker: 0.03,
        chromatic: true,
        scanlines: 0.1,
        randomScale: 0.05,
        randomRotation: 0.02,
        randomOffset: 12
    },
    shattered_lens: {
        stageImages: [
            "FourthWall_01_HairlineFracture",
            "FourthWall_02_RealityCrack",
            "FourthWall_03_ScreenShatter",
            "FourthWall_04_FullBreach"
        ],
        opacity: 1.0,
        blendMode: "normal",
        flicker: 0.05,
        chromatic: true,
        scanlines: 0.2,
        randomScale: 0.08,
        randomRotation: 0.03,
        randomOffset: 16
    },
    void_tear: {
        stageImages: [
            "FourthWall_01_HairlineFracture",
            "FourthWall_02_RealityCrack",
            "FourthWall_03_ScreenShatter",
            "FourthWall_04_FullBreach"
        ],
        opacity: 1.0,
        blendMode: "multiply",
        flicker: 0.02,
        chromatic: false,
        scanlines: 0.05,
        randomScale: 0.03,
        randomRotation: 0.01,
        randomOffset: 10
    },
    digital_split: {
        stageImages: [
            "FourthWall_01_HairlineFracture",
            "FourthWall_02_RealityCrack",
            "FourthWall_03_ScreenShatter",
            "FourthWall_04_FullBreach"
        ],
        opacity: 1.0,
        blendMode: "screen",
        flicker: 0.04,
        chromatic: true,
        scanlines: 0.3,
        randomScale: 0.06,
        randomRotation: 0,
        randomOffset: 20
    }
};

const BUILT_IN_OVERLAY_PACKS = {
    none: {
        vignetteImage: "",
        staticImage: "",
        presenceMarkImage: "",
        blendMode: "normal",
        opacity: 0,
        pulseBehavior: "none"
    },
    static_veil: {
        vignetteImage: "",
        staticImage: "FourthWall_07_StaticVeil",
        presenceMarkImage: "",
        blendMode: "normal",
        opacity: 0.35,
        pulseBehavior: "slow"
    },
    edge_pressure: {
        vignetteImage: "FourthWall_08_EdgePressure",
        staticImage: "",
        presenceMarkImage: "",
        blendMode: "multiply",
        opacity: 0.45,
        pulseBehavior: "breathe"
    },
    presence_mark: {
        vignetteImage: "",
        staticImage: "",
        presenceMarkImage: "FourthWall_09_PresenceMark",
        blendMode: "normal",
        opacity: 0.3,
        pulseBehavior: "phase"
    },
    cosmic_noise: {
        vignetteImage: "",
        staticImage: "FourthWall_07_StaticVeil",
        presenceMarkImage: "",
        blendMode: "screen",
        opacity: 0.5,
        pulseBehavior: "pulse"
    }
};

const BUILT_IN_UI_PACKS = {
    subtle_wrongness: {
        glitchSymbols: "",
        textCorruptionMod: 0.15,
        cursorInstability: 0.1,
        windowOffset: 0,
        fakeDisabledChance: 0.02,
        saveLabelFlavor: ""
    },
    haunted_save: {
        glitchSymbols: "",
        textCorruptionMod: 0.25,
        cursorInstability: 0.15,
        windowOffset: 0,
        fakeDisabledChance: 0.05,
        saveLabelFlavor: "haunted"
    },
    terminal_failure: {
        glitchSymbols: "01#ERR!@#$%",
        textCorruptionMod: 0.5,
        cursorInstability: 0.3,
        windowOffset: 0,
        fakeDisabledChance: 0.1,
        saveLabelFlavor: "terminal"
    },
    malware_popup: {
        glitchSymbols: "WARNING! INFECTED",
        textCorruptionMod: 0.4,
        cursorInstability: 0.2,
        windowOffset: 4,
        fakeDisabledChance: 0.15,
        saveLabelFlavor: "malware"
    },
    dream_decay: {
        glitchSymbols: "~*..*~",
        textCorruptionMod: 0.2,
        cursorInstability: 0.05,
        windowOffset: 2,
        fakeDisabledChance: 0.03,
        saveLabelFlavor: "dream"
    }
};

const BUILT_IN_AUDIO_PACKS = {
    vhs_decay: {
        pitchDrift: 0.06,
        volumeFlutter: 0.12,
        dropoutChance: 0.05,
        wrongSeChance: 0.02,
        sePool: []
    },
    signal_dropout: {
        pitchDrift: 0.02,
        volumeFlutter: 0.08,
        dropoutChance: 0.25,
        wrongSeChance: 0.05,
        sePool: []
    },
    wrong_sfx: {
        pitchDrift: 0.03,
        volumeFlutter: 0.05,
        dropoutChance: 0.05,
        wrongSeChance: 0.3,
        sePool: ["Buzzer1", "Buzzer2", "Static", "Glitch"]
    },
    low_breathing: {
        pitchDrift: 0.01,
        volumeFlutter: 0.04,
        dropoutChance: 0.02,
        wrongSeChance: 0.0,
        sePool: ["Breath", "Whisper"]
    },
    system_bleed: {
        pitchDrift: 0.05,
        volumeFlutter: 0.1,
        dropoutChance: 0.1,
        wrongSeChance: 0.15,
        sePool: ["Error", "SystemAlert", "Buzzer1"]
    }
};

const BUILT_IN_PRESENCE_PACKS = {
    entity_watching: {
        stageBias: 1,
        eventWeights: { glance: 0.3, flicker: 0.2, whisper: 0.1 },
        preferredSequences: ["Subtle Warning", "Player Spotted"],
        visualDistortionDefaults: { breathAmount: 0.01, rippleAmount: 0.005 },
        uiCorruptionBias: 0.1,
        overlayRecommendation: "presence_mark"
    },
    void_pressure: {
        stageBias: 2,
        eventWeights: { static: 0.3, flicker: 0.3, whisper: 0.2 },
        preferredSequences: ["Full Breach", "Reality Fracture"],
        visualDistortionDefaults: { breathAmount: 0.03, rippleAmount: 0.01, warpAmount: 0.02 },
        uiCorruptionBias: 0.2,
        overlayRecommendation: "edge_pressure"
    },
    cosmic_attention: {
        stageBias: 1,
        eventWeights: { static: 0.2, pulse: 0.3, glance: 0.2 },
        preferredSequences: ["Subtle Warning", "System Failure"],
        visualDistortionDefaults: { breathAmount: 0.02, zoomWobble: 0.01 },
        uiCorruptionBias: 0.15,
        overlayRecommendation: "cosmic_noise"
    },
    hostile_system: {
        stageBias: 1,
        eventWeights: { glitch: 0.4, flicker: 0.3, static: 0.2 },
        preferredSequences: ["Boss Break", "System Failure"],
        visualDistortionDefaults: { breathAmount: 0.02, rippleAmount: 0.01 },
        uiCorruptionBias: 0.35,
        overlayRecommendation: "static_veil"
    },
    silent_observer: {
        stageBias: 0,
        eventWeights: { glance: 0.1, whisper: 0.05 },
        preferredSequences: ["Subtle Warning"],
        visualDistortionDefaults: { breathAmount: 0.005 },
        uiCorruptionBias: 0.05,
        overlayRecommendation: "none"
    }
};

const BUILT_IN_SEQUENCE_PACKS = {
    classic: {
        subtleSequence: "Subtle Warning",
        hostileSequence: "Reality Fracture",
        fakeCrashSequence: "System Failure"
    },
    vhs: {
        subtleSequence: "Subtle Warning",
        hostileSequence: "Full Breach",
        fakeCrashSequence: "System Failure"
    },
    malware: {
        subtleSequence: "Subtle Warning",
        hostileSequence: "Boss Break",
        fakeCrashSequence: "System Failure"
    },
    void: {
        subtleSequence: "Subtle Warning",
        hostileSequence: "Full Breach",
        fakeCrashSequence: "System Failure"
    },
    dream: {
        subtleSequence: "Subtle Warning",
        hostileSequence: "Reality Fracture",
        fakeCrashSequence: "System Failure"
    }
};

// ------------------------------------------------------------------
// Registration helpers
// ------------------------------------------------------------------

function _registerBuiltInPack(channel, name, data) {
    const key = packKey(channel, name);
    if (!_stylePackRegistry[channel]) {
        _stylePackRegistry[channel] = {};
    }
    _stylePackRegistry[channel][name] = Object.freeze({ ...data });
    _builtInPackKeys.add(key);
}

export function registerBuiltInStylePacks(registerFn) {
    const fn = typeof registerFn === "function" ? registerFn : _registerBuiltInPack;

    Object.entries(BUILT_IN_CRACK_PACKS).forEach(([name, data]) => fn("cracks", name, data));
    Object.entries(BUILT_IN_OVERLAY_PACKS).forEach(([name, data]) => fn("overlays", name, data));
    Object.entries(BUILT_IN_UI_PACKS).forEach(([name, data]) => fn("ui", name, data));
    Object.entries(BUILT_IN_AUDIO_PACKS).forEach(([name, data]) => fn("audio", name, data));
    Object.entries(BUILT_IN_PRESENCE_PACKS).forEach(([name, data]) => fn("presence", name, data));
    Object.entries(BUILT_IN_SEQUENCE_PACKS).forEach(([name, data]) => fn("sequences", name, data));
}

// Auto-register built-ins into the local registry so the module works out-of-the-box.
registerBuiltInStylePacks();

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

export function setDebugMode(enabled) {
    _debugMode = !!enabled;
}

export function registerStylePack(channel, name, data) {
    if (!isValidChannel(channel)) {
        logDebug("registerStylePack: invalid channel", channel);
        return false;
    }
    if (!name || typeof name !== "string") {
        logDebug("registerStylePack: invalid name", name);
        return false;
    }
    if (!_stylePackRegistry[channel]) {
        _stylePackRegistry[channel] = {};
    }
    _stylePackRegistry[channel][name] = data != null ? { ...data } : {};
    logDebug("registered", channel, name);
    return true;
}

export function unregisterStylePack(channel, name) {
    if (!isValidChannel(channel)) return false;
    const key = packKey(channel, name);
    if (_builtInPackKeys.has(key)) {
        logDebug("unregisterStylePack: built-in pack protected", channel, name);
        return false;
    }
    const registry = _stylePackRegistry[channel];
    if (registry && registry[name] !== undefined) {
        delete registry[name];
        logDebug("unregistered", channel, name);
        return true;
    }
    return false;
}

export function listStylePacks(channel) {
    if (!isValidChannel(channel)) return [];
    const registry = _stylePackRegistry[channel];
    return registry ? Object.keys(registry) : [];
}

export function getStylePack(channel, name) {
    if (!isValidChannel(channel)) return undefined;
    const registry = _stylePackRegistry[channel];
    return registry ? registry[name] : undefined;
}

export function setStylePack(state, channel, name, options) {
    options = options || {};
    if (!isValidChannel(channel)) {
        logDebug("setStylePack: invalid channel", channel);
        return false;
    }
    if (name !== "" && getStylePack(channel, name) === undefined) {
        logDebug("setStylePack: unknown pack", channel, name);
        return false;
    }
    const packs = ensureStylePacksState(state);
    packs[channel] = name;
    if (!options.silent) {
        logDebug("set active", channel, name);
    }
    return true;
}

export function getActiveStylePacks(state) {
    const packs = ensureStylePacksState(state);
    return {
        cracks: packs.cracks || "",
        overlays: packs.overlays || "",
        ui: packs.ui || "",
        audio: packs.audio || "",
        presence: packs.presence || "",
        sequences: packs.sequences || ""
    };
}

export function clearStylePack(state, channel) {
    if (!isValidChannel(channel)) return false;
    const packs = ensureStylePacksState(state);
    packs[channel] = "";
    logDebug("cleared", channel);
    return true;
}

export function registerStyleRecipe(name, recipe) {
    if (!name || typeof name !== "string") return false;
    if (!recipe || typeof recipe !== "object") return false;

    const normalized = {};
    for (const ch of CHANNELS) {
        normalized[ch] = recipe[ch] || "";
    }
    _styleRecipeRegistry[name] = normalized;
    logDebug("registered recipe", name);
    return true;
}

export function applyStyleRecipe(state, name, options) {
    options = options || {};
    const recipe = _styleRecipeRegistry[name];
    if (!recipe) {
        logDebug("applyStyleRecipe: unknown recipe", name);
        return false;
    }
    let changed = false;
    for (const ch of CHANNELS) {
        const packName = recipe[ch];
        if (packName && packName !== "") {
            if (setStylePack(state, ch, packName, { silent: true })) {
                changed = true;
            }
        } else if (options.clearUnused) {
            clearStylePack(state, ch);
            changed = true;
        }
    }
    if (!options.silent) {
        logDebug("applied recipe", name, changed);
    }
    return changed;
}

export function previewStyleRecipe(state, name, frames) {
    frames = clamp(Math.floor(frames || 0), 1, 999999);
    const recipe = _styleRecipeRegistry[name];
    if (!recipe) {
        logDebug("previewStyleRecipe: unknown recipe", name);
        return false;
    }

    const previous = getActiveStylePacks(state);
    if (!state.stylePreview) {
        state.stylePreview = null;
    }
    state.stylePreview = {
        previous,
        timer: frames,
        recipeName: name
    };

    for (const ch of CHANNELS) {
        const packName = recipe[ch];
        if (packName && packName !== "") {
            setStylePack(state, ch, packName, { silent: true });
        }
    }
    logDebug("preview started", name, frames);
    return true;
}

export function listStyleRecipes() {
    return Object.keys(_styleRecipeRegistry);
}

export function getStyleRecipe(name) {
    return _styleRecipeRegistry[name];
}

export function updateStylePreview(state) {
    if (!state || !state.stylePreview) return false;
    const preview = state.stylePreview;
    if (!preview || !preview.timer || preview.timer <= 0) return false;

    preview.timer -= 1;
    if (preview.timer <= 0) {
        const prev = preview.previous || {};
        for (const ch of CHANNELS) {
            const packName = prev[ch] || "";
            setStylePack(state, ch, packName, { silent: true });
        }
        state.stylePreview = null;
        logDebug("preview expired, restored previous packs");
        return true;
    }
    return false;
}

export function getStyleValue(state, channel, key, fallback) {
    if (!isValidChannel(channel)) return fallback;
    const packs = state && state.stylePacks ? state.stylePacks : {};
    const activeName = packs[channel];
    if (!activeName) return fallback;
    const pack = getStylePack(channel, activeName);
    if (!pack || !(key in pack)) return fallback;
    return pack[key];
}
