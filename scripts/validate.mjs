#!/usr/bin/env node
// Repository checks for the pipe0 Claude plugin that `claude plugin validate` doesn't make
// (directory rules from claude.com/docs/plugins/pre-submission-checklist). No dependencies.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// The directory scans only the plugin folder (its plugin path), so every directory rule applies there.
const root = join(repo, "pipe0");
const errors = [];
const fail = (msg) => errors.push(msg);
const readJson = (rel, base = root) => {
  try {
    return JSON.parse(readFileSync(join(base, rel), "utf8"));
  } catch (e) {
    fail(`${rel}: ${e.message}`);
    return null;
  }
};

const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const MCP_URL = "https://api.pipe0.com/v1/mcp";

const m = readJson(".claude-plugin/plugin.json");
const market = readJson(".claude-plugin/marketplace.json", repo);
const mcp = readJson(".mcp.json");

if (m) {
  if (m.name !== "pipe0") fail(`plugin.json: name must be "pipe0", got ${JSON.stringify(m.name)}`);
  if (!SEMVER_RE.test(m.version ?? "")) fail(`plugin.json: version must be semver, got ${JSON.stringify(m.version)}`);
  for (const key of ["description", "license", "homepage", "repository"]) {
    if (!m[key]) fail(`plugin.json: ${key} is required`);
  }
  if (!m.author?.name) fail("plugin.json: author.name is required");
}

if (market) {
  const entry = market.plugins?.find((p) => p.name === m?.name);
  if (!entry) fail("marketplace.json: no entry for the plugin");
  else if (entry.source !== "./pipe0") fail('marketplace.json: the plugin source must be "./pipe0"');
}

if (mcp) {
  const servers = Object.keys(mcp.mcpServers ?? {});
  if (servers.join() !== "pipe0") fail(`.mcp.json: declare exactly one server, pipe0 (got ${servers.join(", ")})`);
  const server = mcp.mcpServers?.pipe0;
  if (server) {
    if (server.type !== "http") fail(`.mcp.json: pipe0 server type must be "http", got ${JSON.stringify(server.type)}`);
    if (server.url !== MCP_URL) fail(`.mcp.json: pipe0 server url must be ${MCP_URL}`);
    if (server.headers) fail(".mcp.json: the server uses OAuth; do not ship static headers");
  }
}

const changelog = existsSync(join(repo, "CHANGELOG.md")) ? readFileSync(join(repo, "CHANGELOG.md"), "utf8") : "";
if (m?.version && !changelog.includes(`## ${m.version}`)) fail(`CHANGELOG.md has no entry for ${m.version}`);
for (const f of ["README.md", "LICENSE", "skills/pipe0/SKILL.md"]) if (!existsSync(join(root, f))) fail(`${f} is missing`);

// The directory blocks or holds: OS junk files, files over 256 KiB, and binaries other than images and fonts.
const SKIP = new Set([".git", "node_modules", "results"]);
const TEXT = new Set([".md", ".json", ".mjs", ".js", ".yml", ".yaml", ".svg", ".txt", ""]);
const IMAGE = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);
const JUNK = new Set([".DS_Store", "Thumbs.db", "desktop.ini", "__MACOSX"]);
let files = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    const rel = relative(root, path);
    if (JUNK.has(name)) fail(`${rel}: OS system file; delete it`);
    const st = statSync(path);
    if (st.isDirectory()) {
      walk(path);
      continue;
    }
    files++;
    const ext = extname(name).toLowerCase();
    if (!TEXT.has(ext) && !IMAGE.has(ext)) fail(`${rel}: only text files and images are allowed`);
    if (!IMAGE.has(ext) && st.size > 256 * 1024) fail(`${rel}: ${st.size} bytes (max 256 KiB for non-images)`);
  }
};
walk(root);
if (files > 512) fail(`${files} files (max 512)`);

const readme = readFileSync(join(root, "README.md"), "utf8").replace(/```[\s\S]*?```/g, "");
if (readme.split(/\s+/).filter(Boolean).length < 40) fail("README.md needs at least 40 words outside code blocks");

// The directory lints the plugin README as user-facing text: no shell commands to run, no credential handling.
const readmeRaw = readFileSync(join(root, "README.md"), "utf8");
if (/```/.test(readmeRaw)) fail("pipe0/README.md: keep code blocks (install or dev commands) in the root README");
if (/bearer|authorization:/i.test(readmeRaw)) fail("pipe0/README.md: don't describe how credentials are sent");

if (errors.length) {
  console.error("pipe0 plugin validation failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`pipe0 plugin ${m.version}: all checks passed`);
