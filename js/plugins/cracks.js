// cracks.js
// Handles crack transitions, crack state, and overlay rendering for FourthWallBreaks plugin.
import { clamp, randomRange, randomInt } from './FourthWallBreaks/helpers.js';

// Crack creation and management
export function makeTransform(stage, randomize) {
    const p = profile(stage);
    const doRandom = randomize !== false;
    const rot = doRandom ? randomRange(-p.randomRotation, p.randomRotation) : 0;
    const offset = doRandom ? Number(p.randomOffset || 0) : 0;
    const scaleRand = doRandom ? Number(p.randomScale || 0) : 0;
    const flip = doRandom && p.randomFlip;
    return {
        rotation: rot,
        offsetX: randomRange(-offset, offset),
        offsetY: randomRange(-offset, offset),
        scale: Number(p.scale || 1) + randomRange(-scaleRand, scaleRand),
        flipX: flip ? Math.random() < 0.5 : false,
        flipY: flip ? Math.random() < 0.15 : false
    };
}

export function makeCrack(stage, fadeFrames, options) {
    const s = state();
    const p = profile(stage);
    const transform = makeTransform(stage, options && options.randomize);
    const target = clamp(Number((options && options.opacity) || p.opacity || 180), 0, 255);
    return {
        id: s.nextCrackId++,
        stage: stage,
        image: (options && options.image) || p.image,
        opacity: 0,
        targetOpacity: target,
        fadeSpeed: Math.max(1, target / Math.max(1, Number(fadeFrames || p.fadeIn || 30))),
        removing: false,
        age: 0,
        blendMode: p.blendMode || 'normal',
        rotation: transform.rotation,
        offsetX: transform.offsetX,
        offsetY: transform.offsetY,
        scale: transform.scale,
        flipX: transform.flipX,
        flipY: transform.flipY,
        chromatic: !!p.chromatic,
        flicker: Number(p.flicker || 0)
    };
}

export function fadeOutCrack(crack, frames) {
    if (!crack) return;
    crack.targetOpacity = 0;
    crack.fadeSpeed = Math.max(1, Number(crack.opacity || 0) / Math.max(1, Number(frames || profile(crack.stage).fadeOut || 45)));
    crack.removing = true;
}

export function stageOpacity(stage) {
    return clamp(Number(profile(stage).opacity || 180), 0, 255);
}

export function updateStackedCracks(newStage, fadeFrames, options) {
    const s = state();
    const mode = String(s.mode || Settings.defaultCrackMode || 'replace').toLowerCase();
    const fade = Number(fadeFrames || profile(newStage || 1).fadeIn || 30);
    if (newStage <= 0) {
        s.cracks.forEach(crack => fadeOutCrack(crack, fade));
        return;
    }
    if (mode === 'replace' || (mode === 'hybrid' && newStage >= 4)) {
        s.cracks.forEach(crack => fadeOutCrack(crack, fade));
        s.cracks.push(makeCrack(newStage, fade, options));
        return;
    }
    for (let stage = 1; stage <= newStage; stage++) {
        let existing = s.cracks.find(crack => crack.stage === stage && !crack.removing);
        if (!existing) {
            s.cracks.push(makeCrack(stage, fade, options));
        } else {
            existing.targetOpacity = stageOpacity(stage);
            existing.fadeSpeed = Math.max(1, Math.abs(existing.targetOpacity - existing.opacity) / Math.max(1, fade));
            existing.removing = false;
        }
    }
    s.cracks.forEach(crack => {
        if (crack.stage > newStage) fadeOutCrack(crack, fade);
    });
}

// Overlay rendering (PIXI/Graphics)
// ... (overlay rendering functions would be added here, referencing the above helpers)

// Export additional overlay and crack-related functions as needed.
