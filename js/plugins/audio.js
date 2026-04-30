// audio.js - Extracted audio corruption logic from FourthWallBreaks.js
import { clamp, randomRange, randomInt } from './FourthWallBreaks/helpers.js';

export const FWB_AUDIO_FALLBACK_SE = ["Cursor", "Cancel", "Decision", "Buzzer", "Damage1", "Damage2", "Equip1", "Load", "Save"];

export function setAudioCorruption(options) {
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
    // FWB.emit("audioCorruptionStarted", { audioCorruption: Object.assign({}, s.audioCorruption) });
    return true;
}

export function clearAudioCorruption() {
    const s = state();
    s.audioCorruption = {
        enabled: false,
        remaining: 0,
        pitchDrift: 0,
        volumeFlutter: 0,
        dropoutChance: 0,
        wrongSeChance: 0,
        sePool: []
    };
    markSyncDirty();
    // FWB.emit("audioCorruptionCleared", {});
}

export function getAudioCorruption() {
    return Object.assign({}, state().audioCorruption || {});
}

export function isAudioCorruptionActive() {
    const a = state().audioCorruption || {};
    return !!a.enabled && Number(a.remaining || 0) > 0 && Settings.audioCorruptionEnabled && !access().disableAudioDistortion;
}

export function corruptAudioPayload(payload, type) {
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

export function updateAudioCorruption() {
    const s = state();
    const a = s.audioCorruption || {};
    if (!a.enabled) return;
    if (Number(a.remaining || 0) > 0) a.remaining -= 1;
    if (Number(a.remaining || 0) <= 0) clearAudioCorruption();
}

export function parseKeyValueOptions(text) {
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
