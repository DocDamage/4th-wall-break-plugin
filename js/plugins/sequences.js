// sequences.js - Extracted sequence logic from FourthWallBreaks.js
import { clamp } from './FourthWallBreaks/helpers.js';
import { pushBattleLog, fakeDamage, fakeHeal, corruptBattleLog } from './battle.js';

// -------------------------------------------------------------------------
// Dependencies (injected from main plugin)
// -------------------------------------------------------------------------
let _deps = {
    FWB: null,
    tokenReplace: null,
    pluginName: "FourthWallBreaks",
    debugMode: false
};

export function init(deps) {
    Object.assign(_deps, deps);
}

function logDebug() {
    if (!_deps.debugMode) return;
    console.log.apply(console, [`[${_deps.pluginName}]`].concat(Array.prototype.slice.call(arguments)));
}

function safeReserveCommonEvent(id) {
    id = Number(id || 0);
    if (id > 0 && window.$gameTemp && window.$gameTemp.reserveCommonEvent) {
        window.$gameTemp.reserveCommonEvent(id);
    }
}

function tryParseJson(value, def) {
    if (value === undefined || value === null || value === "") return def;
    try {
        let parsed = JSON.parse(String(value));
        if (typeof parsed === "string") parsed = JSON.parse(parsed);
        return parsed;
    } catch (e) {
        console.warn(`[${_deps.pluginName}] Could not parse JSON parameter:`, value, e);
        return def;
    }
}

// -------------------------------------------------------------------------
// Built-in sequences
// -------------------------------------------------------------------------
export const SEQUENCES = {
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

export const SEQUENCE_ACTIONS = [
    "stage", "setstage", "escalate", "reduce", "clear", "pulse", "flash", "glitch", "speaker", "message",
    "breach", "commonevent", "lockinput", "unlockinput", "presence", "narrative", "setnarrativestate",
    "memory", "memoryadd", "clearmemory", "flag", "clearflag", "fakedamage", "fakeheal", "battlelog", "corruptbattlelog",
    "audiocorruption", "clearaudiocorruption", "wait", "emit", "sequence", "runsequence", "stopsequence",
    "trigger", "registertrigger", "controldistortion", "clearcontroldistortion", "uicorruption", "clearuicorruption",
    "fakesystemmessage", "fakesavefailure", "visualdistortion", "clearvisualdistortion", "fakecrash",
    "realtimemessage", "debugsnapshot", "validateruntime"
];

const SESSION_SEQUENCE_ONCE = {};
const SESSION_SEQUENCE_COOLDOWNS = {};

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------
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

// -------------------------------------------------------------------------
// Validation
// -------------------------------------------------------------------------
export function validateSequence(jsonOrArray) {
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
}

export function logSequenceValidation(result, name) {
    if (!_deps.debugMode || !result) return;
    if (result.errors && result.errors.length) console.warn(`[${_deps.pluginName}] sequence validation errors for ${name}:`, result.errors);
    if (result.warnings && result.warnings.length) console.warn(`[${_deps.pluginName}] sequence validation warnings for ${name}:`, result.warnings);
}

// -------------------------------------------------------------------------
// Registration
// -------------------------------------------------------------------------
export function registerSequence(name, customJson) {
    const sequenceName = String(name || "").trim();
    const result = validateSequence(customJson);
    logSequenceValidation(result, sequenceName || "Custom");
    if (!sequenceName || !result.ok) return false;
    SEQUENCES[sequenceName] = result.steps;
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceRegistered", { name: sequenceName, steps: result.steps });
    return true;
}

export function unregisterSequence(name) {
    const sequenceName = String(name || "").trim();
    if (!sequenceName || !SEQUENCES[sequenceName]) return false;
    delete SEQUENCES[sequenceName];
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceUnregistered", { name: sequenceName });
    return true;
}

export function hasSequence(name) {
    return !!SEQUENCES[String(name || "")];
}

export function listSequences() {
    return Object.keys(SEQUENCES).sort();
}

// -------------------------------------------------------------------------
// Runtime
// -------------------------------------------------------------------------
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

export function runSequence(name, customJson, options) {
    options = options || {};
    const s = state();
    let steps = null;
    if (customJson) steps = normalizeSequenceInput(customJson);
    if (!Array.isArray(steps)) steps = SEQUENCES[String(name || "Reality Fracture")];
    if (!Array.isArray(steps)) steps = SEQUENCES["Reality Fracture"];
    const result = validateSequence(steps);
    logSequenceValidation(result, String(name || "Custom"));
    if (!result.ok) return false;
    const runtime = makeSequenceRuntime(name || "Custom", result.steps);
    const mode = String(options.mode || "replace").toLowerCase();
    if (mode === "queue" && s.sequence) {
        s.sequenceQueue = s.sequenceQueue || [];
        s.sequenceQueue.push(runtime);
        if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceQueued", { name: runtime.name, queueLength: s.sequenceQueue.length });
        return true;
    }
    s.sequence = runtime;
    s.sequencePaused = false;
    logDebug("sequence", s.sequence.name, s.sequence.steps);
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceStarted", { name: s.sequence.name, steps: s.sequence.steps });
    return true;
}

export function queueSequence(name, customJson) {
    return runSequence(name, customJson, { mode: "queue" });
}

export function pauseSequence() {
    const s = state();
    if (!s.sequence) return false;
    s.sequencePaused = true;
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequencePaused", { name: s.sequence.name });
    return true;
}

export function resumeSequence() {
    const s = state();
    if (!s.sequence) return false;
    s.sequencePaused = false;
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceResumed", { name: s.sequence.name });
    return true;
}

export function stopSequence(clearQueue) {
    const s = state();
    const old = s.sequence ? s.sequence.name : "";
    s.sequence = null;
    s.sequencePaused = false;
    if (clearQueue) s.sequenceQueue = [];
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceStopped", { name: old, clearQueue: !!clearQueue });
    return !!old;
}

export function clearSequenceMemory(prefix) {
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
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceMemoryCleared", { prefix: pfx });
}

export function isSequenceRunning() {
    return !!state().sequence;
}

export function currentSequence() {
    const seq = state().sequence;
    return seq ? JSON.parse(JSON.stringify(seq)) : null;
}

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
    if (step.if && _deps.FWB && _deps.FWB.evalCondition && !_deps.FWB.evalCondition(step.if)) return false;
    if (step.unless && _deps.FWB && _deps.FWB.evalCondition && _deps.FWB.evalCondition(step.unless)) return false;
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
        const now = window.Graphics && window.Graphics.frameCount ? window.Graphics.frameCount : 0;
        const last = Number(store[key] || -999999999);
        if (now - last < Number(step.cooldown)) return false;
        store[key] = now;
    }
    return true;
}

export function executeSequenceStep(step, runtime, index) {
    if (!step || !runtime) return;
    if (!shouldExecuteSequenceStep(step, runtime, index)) return;
    const action = String(step.action || "stage").toLowerCase();
    const FWB = _deps.FWB;
    const tokenReplace = _deps.tokenReplace;
    if (!FWB) return;
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
            if (window.$gameMessage && step.text) {
                if (step.speaker && window.$gameMessage.setSpeakerName) window.$gameMessage.setSpeakerName(tokenReplace ? tokenReplace(step.speaker) : step.speaker);
                window.$gameMessage.add(tokenReplace ? tokenReplace(step.text) : step.text);
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
            fakeDamage(window, Number(step.targetIndex || step.target || 0), Number(step.amount || 9999), step.text);
            break;
        case "fakeheal":
            fakeHeal(window, Number(step.targetIndex || step.target || 0), Number(step.amount || 9999), step.text);
            break;
        case "battlelog":
            pushBattleLog(window, String(step.text || step.value || ""));
            break;
        case "corruptbattlelog":
            corruptBattleLog(Number(step.amount || 0.25), Number(step.lines || 3));
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
        case "visualdistortion":
            FWB.setVisualDistortion(step);
            break;
        case "clearvisualdistortion":
            FWB.clearVisualDistortion();
            break;
        case "fakecrash":
            FWB.fakeCrash(step);
            break;
        case "realtimemessage":
            FWB.realTimeMessage(String(step.condition || "always"), String(step.text || step.message || ""), String(step.speaker || "SYSTEM"));
            break;
        case "debugsnapshot":
            FWB.dumpDebugSnapshot();
            break;
        case "validateruntime":
            console.log(`[${_deps.pluginName}] runtime validation`, FWB.validateRuntime());
            break;
        case "stopsequence":
            FWB.stopSequence(!!step.clearQueue);
            break;
    }
    FWB.emit("sequenceStepExecuted", { sequence: runtime.name, step: step, index: index, action: action });
}

// -------------------------------------------------------------------------
// Update loop
// -------------------------------------------------------------------------
export function startNextQueuedSequence() {
    const s = state();
    if (s.sequence || !Array.isArray(s.sequenceQueue) || s.sequenceQueue.length <= 0) return false;
    s.sequence = s.sequenceQueue.shift();
    s.sequencePaused = false;
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceStarted", { name: s.sequence.name, steps: s.sequence.steps, queued: true });
    return true;
}

export function finishSequence(runtime) {
    const s = state();
    const name = runtime ? runtime.name : "";
    s.sequenceHistory = s.sequenceHistory || [];
    s.sequenceHistory.push({ name: name, endedAt: window.Graphics && window.Graphics.frameCount ? window.Graphics.frameCount : 0 });
    if (s.sequenceHistory.length > 20) s.sequenceHistory.shift();
    s.sequence = null;
    s.sequencePaused = false;
    if (_deps.FWB && _deps.FWB.emit) _deps.FWB.emit("sequenceEnded", { name: name });
    startNextQueuedSequence();
}

export function updateSequence() {
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

// -------------------------------------------------------------------------
// Debug helpers
// -------------------------------------------------------------------------
export function debugPrintSequences() {
    const s = state();
    const builtIns = Object.keys(SEQUENCES || {});
    const custom = [];
    console.group(`[${_deps.pluginName}] Sequences`);
    console.log("Built-in:", builtIns);
    console.log("Custom:", custom);
    console.log("Current:", s.sequence || null);
    console.log("Queue:", s.sequenceQueue || []);
    console.groupEnd();
    return { builtIns, custom, current: s.sequence || null, queue: s.sequenceQueue || [] };
}
