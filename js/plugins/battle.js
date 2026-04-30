// battle.js - Extracted battle break and enemy awareness logic from FourthWallBreaks.js
import { clamp, randomInt } from './FourthWallBreaks/helpers.js';

let _deps = {
    FWB: null,
    tokenReplace: null,
    glitchText: null,
    DEFAULT_SYMBOLS: "@#$%&?!<>/\\[]{}=+*0123456789",
    noteFlag: null,
    noteValue: null
};

export function init(deps) {
    Object.assign(_deps, deps);
}

export function battleLogWindow(root) {
    const scene = root.SceneManager && root.SceneManager._scene;
    return scene && scene._logWindow ? scene._logWindow : (root.BattleManager && root.BattleManager._logWindow ? root.BattleManager._logWindow : null);
}

export function battleMembers(root) {
    const members = [];
    if (root.$gameTroop && root.$gameTroop.members) members.push.apply(members, root.$gameTroop.members());
    if (root.$gameParty && root.$gameParty.battleMembers) members.push.apply(members, root.$gameParty.battleMembers());
    return members;
}

export function battleTargetByIndex(root, index) {
    const members = battleMembers(root);
    return members[clamp(Number(index || 0), 0, Math.max(0, members.length - 1))] || null;
}

export function battlerDisplayName(target) {
    if (!target) return "Target";
    if (target.name) return target.name();
    return "Target";
}

export function pushBattleLog(root, text) {
    const line = _deps.tokenReplace ? _deps.tokenReplace(text || "") : (text || "");
    const log = battleLogWindow(root);
    if (log && log.push) log.push("addText", line);
    else if (root.$gameMessage) root.$gameMessage.add(line);
    // FWB.emit("battleLogLine", { text: line });
    return line;
}

export function fakeDamage(root, targetOrIndex, amount, text) {
    if (!Settings.battleBreakEnabled) return false;
    const target = typeof targetOrIndex === "number" ? battleTargetByIndex(root, targetOrIndex) : targetOrIndex;
    const line = text || `${battlerDisplayName(target)} took ${Number(amount || 0)} damage!`;
    pushBattleLog(root, line);
    // FWB.emit("fakeDamage", { target: target, amount: Number(amount || 0), text: line });
    return true;
}

export function fakeHeal(root, targetOrIndex, amount, text) {
    if (!Settings.battleBreakEnabled) return false;
    const target = typeof targetOrIndex === "number" ? battleTargetByIndex(root, targetOrIndex) : targetOrIndex;
    const line = text || `${battlerDisplayName(target)} recovered ${Number(amount || 0)} HP!`;
    pushBattleLog(root, line);
    // FWB.emit("fakeHeal", { target: target, amount: Number(amount || 0), text: line });
    return true;
}

export function corruptBattleLog(amount, lines) {
    const s = state();
    s.battleBreaks = s.battleBreaks || {};
    s.battleBreaks.corruptLogAmount = clamp(Number(amount || 0.25), 0, 1);
    s.battleBreaks.corruptLogLines = Math.max(1, Number(lines || 3));
    markSyncDirty();
    // FWB.emit("battleLogCorruptionSet", { amount: s.battleBreaks.corruptLogAmount, lines: s.battleBreaks.corruptLogLines });
}

export function maybeCorruptBattleLogText(text) {
    const s = state();
    const b = s.battleBreaks || {};
    if (!Settings.battleBreakEnabled || !b.corruptLogLines || access().disableFlicker) return text;
    b.corruptLogLines -= 1;
    const amount = clamp(Number(b.corruptLogAmount || 0.25), 0, 1);
    return _deps.glitchText ? _deps.glitchText(text, amount, _deps.DEFAULT_SYMBOLS) : text;
}

export function runEnemyAwareness(root, enemy, data, note) {
    if (!Settings.battleBreakEnabled || !enemy || !data) return;
    if (_deps.noteFlag && !_deps.noteFlag(note, ["FWBAwareEnemy", "FourthWallAwareEnemy"]) && _deps.noteValue && _deps.noteValue(note, ["FWBAwarenessStage", "FourthWallAwarenessStage"]) === null && _deps.noteValue && _deps.noteValue(note, ["FWBAwarenessMessage", "FourthWallAwarenessMessage"]) === null) return;
    const s = state();
    s.battleBreaks = s.battleBreaks || { awareEnemies: {} };
    s.battleBreaks.awareEnemies = s.battleBreaks.awareEnemies || {};
    const key = `aware_${root.$gameTroop ? root.$gameTroop.troopId() : 0}_${enemy.index ? enemy.index() : 0}_${data.id || 0}`;
    if (s.battleBreaks.awareEnemies[key]) return;
    s.battleBreaks.awareEnemies[key] = true;
    const stage = _deps.noteValue ? _deps.noteValue(note, ["FWBAwarenessStage", "FourthWallAwarenessStage"]) : null;
    if (stage !== null && _deps.FWB) _deps.FWB.setStage(Number(stage), { fadeFrames: 30, source: "enemyAwareness", glitchOnStage: true });
    const presence = _deps.noteValue ? _deps.noteValue(note, ["FWBAwarenessPresence", "FourthWallAwarenessPresence"]) : null;
    if (presence !== null && _deps.FWB) _deps.FWB.addPresence(Number(presence), { source: "enemyAwareness" });
    const message = _deps.noteValue ? _deps.noteValue(note, ["FWBAwarenessMessage", "FourthWallAwarenessMessage"]) : null;
    if (message !== null) pushBattleLog(root, String(message));
    // FWB.emit("enemyAwareness", { enemy: enemy, data: data, key: key });
    markSyncDirty();
}
