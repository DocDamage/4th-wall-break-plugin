// uiCorruption.js - Handles UI corruption and fake system layer logic for FourthWallBreaks plugin
import { clamp } from './FourthWallBreaks/helpers.js';

export function setUiCorruption(level, duration) {
    const s = state();
    s.uiCorruptionLevel = clamp(Number(level || 0), 0, Settings.maxUiCorruptionLevel);
    s.uiCorruptionFrames = Math.max(0, Number(duration || 0));
    markSyncDirty();
    const fwb = (typeof window !== "undefined") && (window.FourthWallBreaks || window.FWB);
    if (fwb && fwb.emit) {
        fwb.emit("uiCorruptionChanged", { level: s.uiCorruptionLevel, duration: s.uiCorruptionFrames });
    }
    return s.uiCorruptionLevel;
}

export function clearUiCorruption() {
    const s = state();
    s.uiCorruptionLevel = 0;
    s.uiCorruptionFrames = 0;
    markSyncDirty();
    const fwb = (typeof window !== "undefined") && (window.FourthWallBreaks || window.FWB);
    if (fwb && fwb.emit) {
        fwb.emit("uiCorruptionChanged", { level: 0 });
    }
}

export function uiCorruptionLevel() {
    const s = state();
    return clamp(Number(s.uiCorruptionLevel || 0), 0, Settings.maxUiCorruptionLevel);
}

export function updateUiCorruption() {
    const s = state();
    if (Number(s.uiCorruptionFrames || 0) > 0) {
        s.uiCorruptionFrames -= 1;
        if (s.uiCorruptionFrames <= 0) clearUiCorruption();
    }
}

export function fakeSystemMessage(text, speaker, tokenReplace, root) {
    if (!Settings.fakeSystemEnabled) return false;
    const s = state();
    const payload = { text: tokenReplace(text || "Runtime integrity warning."), speaker: tokenReplace(speaker || "SYSTEM") };
    s.fakeSystemMessages.push(payload);
    if (root && root.$gameMessage) {
        if (payload.speaker && root.$gameMessage.setSpeakerName) root.$gameMessage.setSpeakerName(payload.speaker);
        root.$gameMessage.add(payload.text);
    }
    const fwb = (typeof window !== "undefined") && (window.FourthWallBreaks || window.FWB);
    if (fwb && fwb.emit) {
        fwb.emit("fakeSystemMessage", payload);
    }
    return true;
}

export function fakeSaveFailure(text, tokenReplace, root) {
    return fakeSystemMessage(text || "Save failed. File integrity compromised.", "SYSTEM", tokenReplace, root);
}

export function fakeOptionChange(optionName, fakeValue) {
    const s = state();
    s.fakeOptionOverrides[String(optionName || "")] = String(fakeValue || "???");
    markSyncDirty();
    const fwb = (typeof window !== "undefined") && (window.FourthWallBreaks || window.FWB);
    if (fwb && fwb.emit) {
        fwb.emit("fakeOptionChanged", { optionName: optionName, fakeValue: fakeValue });
    }
}

export function clearFakeOptionChange(optionName) {
    const s = state();
    if (optionName) delete s.fakeOptionOverrides[String(optionName)];
    else s.fakeOptionOverrides = {};
    markSyncDirty();
}
