// FourthWallBreaks/triggers.js
// Trigger engine for the FourthWallBreaks plugin
import { stableHash } from './helpers.js';

export function triggerId(rule) {
    return String(rule.id || rule.triggerId || `trigger_${stableHash(JSON.stringify(rule))}`);
}

export function normalizeTriggerRule(rule, sourceKey, defaultScope) {
    if (!rule || typeof rule !== "object") return null;
    const normalized = Object.assign({}, rule);
    normalized.id = triggerId(Object.assign({ sourceKey: sourceKey }, normalized));
    normalized.condition = String(normalized.condition || normalized.if || "true");
    normalized.action = String(normalized.action || "sequence");
    normalized.value = normalized.value !== undefined ? normalized.value : (normalized.sequenceName || normalized.message || normalized.stage || normalized.amount || "");
    normalized.scope = String(normalized.scope || defaultScope || "global").toLowerCase();
    normalized.sourceKey = String(sourceKey || normalized.sourceKey || "");
    normalized.cooldown = Math.max(0, Number(normalized.cooldown || 0));
    const onceRaw = normalized.once;
    const onceText = String(onceRaw || "").toLowerCase();
    normalized.once = onceRaw === true || onceText === "true" || onceText === "save";
    normalized.sessionOnce = onceText === "session";
    return normalized;
}
