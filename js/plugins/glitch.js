// glitch.js - Handles glitch text and message logic for FourthWallBreaks plugin
import { clamp, randomInt } from './FourthWallBreaks/helpers.js';

export const DEFAULT_SYMBOLS = "@#$%&?!<>/\\[]{}=+*0123456789";

export function glitchText(text, amount, symbols) {
    text = String(text || "");
    amount = clamp(Number(amount || 0), 0, 1);
    symbols = String(symbols || DEFAULT_SYMBOLS);
    if (amount <= 0 || symbols.length <= 0) return text;
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        // Preserve RPG Maker escape control sequences like \V[1], \N[1], \C[2].
        if (ch === "\\") {
            let j = i + 1;
            if (j < text.length) {
                result += ch + text[j];
                j++;
                if (text[j] === "[") {
                    while (j < text.length) {
                        result += text[j];
                        if (text[j] === "]") break;
                        j++;
                    }
                }
                i = j;
                continue;
            }
        }
        if (/\s/.test(ch)) {
            result += ch;
        } else if (Math.random() < amount) {
            result += symbols[randomInt(0, symbols.length - 1)];
        } else {
            result += ch;
        }
    }
    return result;
}

export function glitchNextMessage(amount, lines, symbols) {
    const s = state();
    s.textGlitchNext = {
        amount: clamp(Number(amount || 0.2), 0, 1),
        lines: Math.max(1, Number(lines || 1)),
        symbols: String(symbols || DEFAULT_SYMBOLS)
    };
}

export function glitchSpeakerName(amount, uses, symbols) {
    const s = state();
    s.speakerGlitchNext = {
        amount: clamp(Number(amount || 0.35), 0, 1),
        uses: Math.max(1, Number(uses || 1)),
        symbols: String(symbols || DEFAULT_SYMBOLS)
    };
}
