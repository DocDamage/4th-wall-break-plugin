// visualDistortion.js - Handles visual distortion logic for FourthWallBreaks plugin
import { clamp } from './FourthWallBreaks/helpers.js';

export function normalizeVisualDistortionOptions(options) {
    options = options || {};
    return {
        enabled: true,
        remaining: Math.max(1, Number(options.duration || options.frames || options.remaining || 300)),
        breathAmount: clamp(Number(options.breathAmount !== undefined ? options.breathAmount : (options.breath !== undefined ? options.breath : 0.02)), 0, 0.15),
        breathSpeed: clamp(Number(options.breathSpeed !== undefined ? options.breathSpeed : 0.05), 0.001, 1),
        rippleAmount: clamp(Number(options.rippleAmount !== undefined ? options.rippleAmount : (options.ripple !== undefined ? options.ripple : 0.01)), 0, 0.15),
        zoomWobble: clamp(Number(options.zoomWobble !== undefined ? options.zoomWobble : 0.01), 0, 0.15),
        rotationWobble: clamp(Number(options.rotationWobble !== undefined ? options.rotationWobble : 0.002), 0, 0.1),
        warpAmount: clamp(Number(options.warpAmount !== undefined ? options.warpAmount : (options.warp !== undefined ? options.warp : 0)), 0, 0.15),
        phase: 0
    };
}

export function setVisualDistortion(options, access, FWB) {
    if (access().disableFlicker) return false;
    const s = state();
    s.visualDistortion = normalizeVisualDistortionOptions(options || {});
    markSyncDirty();
    if (FWB && FWB.emit) {
        FWB.emit("visualDistortionStarted", { visualDistortion: Object.assign({}, s.visualDistortion) });
    }
    return true;
}

export function clearVisualDistortion(FWB) {
    const s = state();
    s.visualDistortion = {
        enabled: false,
        remaining: 0,
        breathAmount: 0,
        breathSpeed: 0.05,
        rippleAmount: 0,
        zoomWobble: 0,
        rotationWobble: 0,
        warpAmount: 0,
        phase: 0
    };
    markSyncDirty();
    if (FWB && FWB.emit) {
        FWB.emit("visualDistortionCleared", {});
    }
}

export function getVisualDistortion() {
    return Object.assign({}, state().visualDistortion || {});
}

export function updateVisualDistortion(FWB) {
    const s = state();
    const v = s.visualDistortion || {};
    if (!v.enabled) return;
    v.phase = Number(v.phase || 0) + Number(v.breathSpeed || 0.05);
    if (Number(v.remaining || 0) > 0) v.remaining -= 1;
    if (Number(v.remaining || 0) <= 0) clearVisualDistortion(FWB);
}

export function applyVisualDistortionToOverlay(overlay, baseScale, baseAlpha, access) {
    const s = state();
    const v = s.visualDistortion || {};
    if (!v.enabled || access().disableFlicker) {
        return { scale: baseScale, alpha: baseAlpha, rotation: 0 };
    }
    const phase = Number(v.phase || 0);
    const breath = Math.sin(phase) * Number(v.breathAmount || 0);
    const ripple = Math.sin(phase * 2.17) * Number(v.rippleAmount || 0);
    const zoom = Math.sin(phase * 1.41) * Number(v.zoomWobble || 0);
    const rotation = Math.sin(phase * 0.79) * Number(v.rotationWobble || 0);
    const scale = baseScale + breath + ripple + zoom;
    const alpha = clamp(baseAlpha + Math.abs(ripple) * 0.35, 0.55, 1.3);
    return { scale: clamp(scale, 0.85, 1.25), alpha: alpha, rotation: rotation };
}
