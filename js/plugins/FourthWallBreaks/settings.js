// FourthWallBreaks/settings.js
// Settings and defaults for the FourthWallBreaks plugin
import { clamp, removePictureExtension } from './helpers.js';

export function parsePluginParams(params) {
    function pString(name, def) {
        const value = params[name];
        return value !== undefined && value !== null && value !== '' ? String(value) : def;
    }
    function pNumber(name, def) {
        const value = Number(params[name]);
        return Number.isFinite(value) ? value : def;
    }
    function pBool(name, def) {
        const value = params[name];
        if (value === undefined || value === null || value === '') return !!def;
        return String(value).toLowerCase() === 'true';
    }
    return { pString, pNumber, pBool };
}

export const DEFAULT_PROFILES = {
    1: {
        stage: 1,
        name: 'Hairline Fracture',
        image: 'FourthWall_01_HairlineFracture',
        opacity: 85,
        fadeIn: 45,
        fadeOut: 60,
        blendMode: 'normal',
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
        se: '',
        volume: 70,
        pitch: 100,
        pan: 0
    },
    // ...stages 2-4 omitted for brevity...
};
