#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = process.cwd();
const versionMatch = fs.readFileSync(path.join(root, "js/plugins/FourthWallBreaks.js"), "utf8").match(/const VERSION = "([^"]+)"/);
const version = versionMatch ? versionMatch[1] : "unknown";
const outDir = path.join(root, "release", `FourthWallBreaks_v${version}`);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, "js/plugins"), { recursive: true });
fs.mkdirSync(path.join(outDir, "img/pictures"), { recursive: true });
fs.mkdirSync(path.join(outDir, "presets"), { recursive: true });
fs.mkdirSync(path.join(outDir, "tools"), { recursive: true });

const copyIfExists = (from, to) => {
  if (fs.existsSync(from)) fs.copyFileSync(from, to);
};

copyIfExists(path.join(root, "js/plugins/FourthWallBreaks.js"), path.join(outDir, "js/plugins/FourthWallBreaks.js"));
["FourthWall_01_HairlineFracture.png","FourthWall_02_RealityCrack.png","FourthWall_03_ScreenShatter.png","FourthWall_04_FullBreach.png"].forEach(name => {
  copyIfExists(path.join(root, "img/pictures", name), path.join(outDir, "img/pictures", name));
});
["README.md","CHANGELOG.md","TESTING.md","DEVELOPMENT_PLAN.md"].forEach(name => {
  copyIfExists(path.join(root, name), path.join(outDir, name));
});
if (fs.existsSync(path.join(root, "presets"))) {
  fs.readdirSync(path.join(root, "presets")).forEach(name => copyIfExists(path.join(root, "presets", name), path.join(outDir, "presets", name)));
}

console.log(`Built release folder: ${outDir}`);
console.log("Zip this folder for distribution.");
