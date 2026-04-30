#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const entryFile = path.join(rootDir, "js/plugins/FourthWallBreaks.runtime.js");
const outputFile = path.join(rootDir, "js/plugins/FourthWallBreaks.bundled.js");

function resolveImport(importPath, fromFile) {
    if (!importPath.startsWith(".")) {
        return null;
    }
    const fromDir = path.dirname(fromFile);
    let resolved = path.resolve(fromDir, importPath);
    if (fs.existsSync(resolved)) return resolved;

    if (!resolved.endsWith(".js")) {
        const withExt = resolved + ".js";
        if (fs.existsSync(withExt)) return withExt;
    }

    const fallbackDir = path.join(fromDir, "FourthWallBreaks");
    const fallback = path.join(fallbackDir, path.basename(importPath));
    if (fs.existsSync(fallback)) return fallback;
    if (!fallback.endsWith(".js")) {
        const withExt = fallback + ".js";
        if (fs.existsSync(withExt)) return withExt;
    }

    return null;
}

function isSubfolderModule(filePath) {
    return filePath.includes(path.sep + "FourthWallBreaks" + path.sep);
}

function stripExports(content) {
    return content
        .replace(/\bexport\s+function\s+/g, "function ")
        .replace(/\bexport\s+const\s+/g, "const ")
        .replace(/\bexport\s+let\s+/g, "let ")
        .replace(/\bexport\s+var\s+/g, "var ")
        .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, "")
        .replace(/^\s*export\s+\*\s+from\s+['"][^'"]+['"]\s*;?\s*$/gm, "");
}

function collectExports(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const exports = [];

    const fnRegex = /\bexport\s+function\s+(\w+)/g;
    let m;
    while ((m = fnRegex.exec(content)) !== null) exports.push(m[1]);

    const constRegex = /\bexport\s+const\s+(\w+)/g;
    while ((m = constRegex.exec(content)) !== null) exports.push(m[1]);

    const blockRegex = /\bexport\s*\{([^}]*)\}/g;
    while ((m = blockRegex.exec(content)) !== null) {
        m[1].split(",").forEach(name => {
            name = name.trim();
            const asMatch = name.match(/^(\w+)\s+as\s+(\w+)$/);
            if (asMatch) exports.push(asMatch[2]);
            else if (name) exports.push(name);
        });
    }

    return [...new Set(exports)];
}

const IMPORT_REGEX = /^\s*import\s+(?:(\*\s+as\s+(\w+))|(\{[^}]*\})|(\w+))\s+from\s+['"]([^'"]+)['"]\s*;?/;

function bundleFile(filePath, visited) {
    visited = visited || new Set();
    const absolutePath = path.resolve(filePath);

    if (visited.has(absolutePath)) {
        return `// Already bundled: ${path.relative(rootDir, absolutePath)}\n`;
    }
    visited.add(absolutePath);

    if (!fs.existsSync(absolutePath)) {
        console.warn(`Missing file: ${absolutePath}`);
        return `// MISSING: ${path.relative(rootDir, absolutePath)}\n`;
    }

    let content = fs.readFileSync(absolutePath, "utf8");
    const lines = content.split("\n");
    const output = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = IMPORT_REGEX.exec(line);
        if (match) {
            const importPath = match[5];
            const resolved = resolveImport(importPath, absolutePath);

            if (resolved && isSubfolderModule(resolved)) {
                output.push(`// Skipped subfolder import (provided by main): ${importPath}`);
            } else if (resolved) {
                const bundled = bundleFile(resolved, visited);
                const namespaceName = match[2]; // for `import * as X`

                if (namespaceName) {
                    // Namespace import: wrap in IIFE that returns the namespace object
                    const exports = collectExports(resolved);
                    const exportList = exports.join(", ");
                    const wrapped = `(function() {\n${stripExports(bundled)}\nreturn { ${exportList} };\n})();`;
                    output.push(`const ${namespaceName} = ${wrapped}`);
                } else {
                    // Named import: inline stripped content directly
                    output.push(`// -- bundled from: ${path.relative(rootDir, resolved)} --`);
                    output.push(stripExports(bundled));
                    output.push(`// -- end bundled: ${path.relative(rootDir, resolved)} --`);
                }
            } else {
                output.push(`// Skipped external import: ${importPath}`);
            }
        } else {
            output.push(line);
        }
    }

    return output.join("\n");
}

function main() {
    console.log(`Bundling ${path.relative(rootDir, entryFile)}...`);
    const bundled = bundleFile(entryFile, new Set());
    fs.writeFileSync(outputFile, bundled, "utf8");
    console.log(`Bundled output written to ${path.relative(rootDir, outputFile)}`);

    try {
        require("child_process").execSync(`node --check "${outputFile}"`, { stdio: "inherit" });
        console.log("Syntax check passed.");
    } catch (e) {
        console.error("Syntax check failed.");
        process.exit(1);
    }
}

main();
