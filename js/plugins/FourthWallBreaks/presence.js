// FourthWallBreaks/presence.js
// Presence and narrative logic for the FourthWallBreaks plugin
import { clamp } from './helpers.js';

export function presenceTierLevel(value, thresholds) {
    value = Number(value || 0);
    if (value >= thresholds[3]) return 3;
    if (value >= thresholds[2]) return 2;
    if (value >= thresholds[1]) return 1;
    return 0;
}

export function presenceTierName(value, thresholds) {
    const level = presenceTierLevel(value, thresholds);
    if (level >= 3) return "hostile";
    if (level >= 2) return "interactive";
    if (level >= 1) return "aware";
    return "dormant";
}

export function stageFromPresence(value, thresholds) {
    value = Number(value || 0);
    if (value >= thresholds[4]) return 4;
    if (value >= thresholds[3]) return 3;
    if (value >= thresholds[2]) return 2;
    if (value >= thresholds[1]) return 1;
    return 0;
}
