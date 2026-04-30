// FourthWallBreaks/helpers.js
// Utility functions for the FourthWallBreaks plugin

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

export function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

export function escapeRegExp(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stableHash(text) {
    text = String(text || "");
    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    return Math.abs(hash).toString(36);
}

export function removePictureExtension(name) {
    return String(name || "").replace(/\.(png|jpg|jpeg|webp)$/i, "");
}
