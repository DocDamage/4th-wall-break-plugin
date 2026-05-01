/*:
 * @target MZ
 * @plugindesc v4.13.0 Loader for the FourthWallBreaks runtime. Release builds inline the full runtime into this filename.
 * @author DocDamage
 * @url https://github.com/DocDamage/4th-wall-break-plugin
 *
 * @help
 * FourthWallBreaks.js
 *
 * Development layout:
 *   js/plugins/FourthWallBreaks.js loads js/plugins/FourthWallBreaks.bundled.js.
 *   js/plugins/FourthWallBreaks.runtime.js is the editable monolithic runtime source.
 *
 * Release layout:
 *   node tools/build_release.js writes a single-file RPG Maker plugin to:
 *   release/FourthWallBreaks_v<version>/js/plugins/FourthWallBreaks.js
 *
 * Place the crack images in: img/pictures/
 *
 * This loader is intentionally small so day-to-day editing can move into
 * runtime/modules while RPG Maker still gets a normal plugin entry file.
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "FourthWallBreaks";
    const VERSION = "5.0.0";
    const root = (typeof window !== "undefined") ? window : globalThis;

    if (root.FourthWallBreaks && root.FourthWallBreaks.__runtimeLoaded) return;

    function runtimeUrl() {
        if (typeof document !== "undefined" && document.currentScript && document.currentScript.src) {
            return document.currentScript.src.replace(/FourthWallBreaks\.js(?:\?.*)?$/, "FourthWallBreaks.bundled.js");
        }
        return "js/plugins/FourthWallBreaks.bundled.js";
    }

    function loadRuntime() {
        if (typeof require === "function" && typeof process !== "undefined" && process.versions && process.versions.node) {
            require("./FourthWallBreaks.bundled.js");
            return;
        }
        if (typeof XMLHttpRequest === "undefined") {
            throw new Error(`[${PLUGIN_NAME}] Cannot load FourthWallBreaks.bundled.js: XMLHttpRequest is unavailable.`);
        }
        const request = new XMLHttpRequest();
        request.open("GET", runtimeUrl(), false);
        request.overrideMimeType("text/javascript");
        request.send(null);
        if (request.status >= 400 || !request.responseText) {
            throw new Error(`[${PLUGIN_NAME}] Failed to load FourthWallBreaks.bundled.js (${request.status}).`);
        }
        (0, eval)(`${request.responseText}\n//# sourceURL=FourthWallBreaks.bundled.js`);
    }

    loadRuntime();
    if (root.FourthWallBreaks) root.FourthWallBreaks.__loaderVersion = VERSION;
})();
