#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();

// Run bundler first
console.log("Running bundler...");
require("./bundle.js");

const versionMatch = fs.readFileSync(path.join(root, "js/plugins/FourthWallBreaks.runtime.js"), "utf8").match(/const VERSION = "([^"]+)"/);
const version = versionMatch ? versionMatch[1] : "unknown";
const outDir = path.join(root, "release", `FourthWallBreaks_v${version}`);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, "js/plugins"), { recursive: true });
fs.mkdirSync(path.join(outDir, "img/pictures"), { recursive: true });
fs.mkdirSync(path.join(outDir, "tools"), { recursive: true });

const copyIfExists = (from, to) => {
  if (fs.existsSync(from)) fs.copyFileSync(from, to);
};

// Copy the bundled file as the release plugin
copyIfExists(path.join(root, "js/plugins/FourthWallBreaks.bundled.js"), path.join(outDir, "js/plugins/FourthWallBreaks.js"));

[
  "FourthWall_01_HairlineFracture.png","FourthWall_02_RealityCrack.png",
  "FourthWall_03_ScreenShatter.png","FourthWall_04_FullBreach.png",
  "FourthWall_05_ThinTear.png","FourthWall_06_DeepFracture.png",
  "FourthWall_07_StaticVeil.png","FourthWall_08_EdgePressure.png",
  "FourthWall_09_PresenceMark.png","FourthWall_10_DigitalSplit.png",
  "FourthWall_11_CosmicDust.png","FourthWall_12_BloodVignette.png"
].forEach(name => {
  copyIfExists(path.join(root, "img/pictures", name), path.join(outDir, "img/pictures", name));
});

["README.md","CHANGELOG.md","TESTING.md","DEVELOPMENT_PLAN.md","LICENSE"].forEach(name => {
  copyIfExists(path.join(root, name), path.join(outDir, name));
});

console.log("Verifying release...");
require("./verify_refactor.js");

console.log(`Built release folder: ${outDir}`);
console.log("Zip this folder for distribution.");
