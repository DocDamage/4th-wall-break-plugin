#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = path.resolve(__dirname, "..");
const mainPlugin = path.join(root, "js/plugins/FourthWallBreaks.js");
const runtimePlugin = path.join(root, "js/plugins/FourthWallBreaks.runtime.js");
const bundledPlugin = path.join(root, "js/plugins/FourthWallBreaks.bundled.js");

const moduleNames = [
  "cracks",
  "battle",
  "audio",
  "uiCorruption",
  "visualDistortion",
  "glitch",
  "sequences",
  "pluginCommands"
];

function run(command, args) {
  childProcess.execFileSync(command, args, {
    cwd: root,
    stdio: "inherit"
  });
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function pluginVersion() {
  const match = read(runtimePlugin).match(/const VERSION = "([^"]+)"/);
  return match ? match[1] : "unknown";
}

function releasePluginPath() {
  return path.join(root, "release", `FourthWallBreaks_v${pluginVersion()}`, "js/plugins/FourthWallBreaks.js");
}

function assertScriptPlugin(filePath, options) {
  options = options || {};
  const text = read(filePath);
  const relative = path.relative(root, filePath);
  assert(!/^\s*import\s/m.test(text), `${relative} must not contain static import statements.`);
  assert(!/^\s*export\s/m.test(text), `${relative} must not contain static export statements.`);
  if (options.requiresOverlay) {
    assert(/function\s+updateOverlay\s*\(/.test(text), `${relative} must include the overlay update runtime.`);
    assert(!/updateOverlay is not yet extracted/.test(text), `${relative} still contains the overlay placeholder.`);
  }
}

function assertLoader() {
  const text = read(mainPlugin);
  const lines = text.split(/\r?\n/).length;
  assert(lines <= 250, `js/plugins/FourthWallBreaks.js is still too large: ${lines} lines.`);
  assert(text.includes("FourthWallBreaks.bundled.js"), "Loader must reference FourthWallBreaks.bundled.js.");
  const loaderVersion = text.match(/const VERSION = "([^"]+)"/);
  assert(loaderVersion && loaderVersion[1] === pluginVersion(), "Loader VERSION must match runtime VERSION.");
}

function assertReleaseMatchesBundle() {
  const releasePlugin = releasePluginPath();
  if (!fs.existsSync(releasePlugin)) return;
  assert(
    read(releasePlugin) === read(bundledPlugin),
    "Release plugin is stale; run node tools/build_release.js."
  );
}

function main() {
  run(process.execPath, ["--check", mainPlugin]);
  run(process.execPath, ["--check", runtimePlugin]);
  run(process.execPath, ["--check", bundledPlugin]);

  assertLoader();
  assertScriptPlugin(mainPlugin);
  assertScriptPlugin(runtimePlugin, { requiresOverlay: true });
  assertScriptPlugin(bundledPlugin, { requiresOverlay: true });

  const imports = moduleNames
    .map(name => `import('./js/plugins/${name}.js')`)
    .join(",");
  run(process.execPath, [
    "--input-type=module",
    "-e",
    `await Promise.all([${imports}]);`
  ]);

  assertReleaseMatchesBundle();
  console.log("Refactor verification passed.");
}

main();
