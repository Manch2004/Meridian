#!/usr/bin/env node
/*
 * Comprehensive automated audit of src/locales/hy/translation.json for
 * accidentally-untranslated (Latin-script) content.
 *
 * For every leaf string in hy/translation.json, finds Latin-script tokens
 * (3+ letters, digits allowed inside e.g. TRC20) after stripping i18next
 * {{placeholders}}, URLs and emails. Each surviving token is excluded if it
 * is in the explicit intentional-term list, otherwise it is reported as an
 * occurrence, tiered by whether the SAME token also appears in the ru.json
 * value at the same key (Tier B = ru keeps it too -> likely shared/deliberate
 * loanword; Tier A = ru does not have it -> hy-only leftover, likely a miss).
 *
 * Usage: node scripts/audit-hy-translations.cjs [--json]
 */

const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "src", "locales");

const EN_PATH = path.join(LOCALES_DIR, "en", "translation.json");
const HY_PATH = path.join(LOCALES_DIR, "hy", "translation.json");
const RU_PATH = path.join(LOCALES_DIR, "ru", "translation.json");

// Explicit exclusion list per audit spec: intentional Latin-script terms
// that must never be reported, regardless of context.
const EXCLUDED_TOKENS = new Set(
  [
    "meridian",
    "faq",
    "usdt",
    "trc20",
    "dao",
    "ai",
    "id",
    "txid",
    "browser",
    "cache",
    "screenshot",
    "transaction",
    "hash",
  ].map((t) => t.toLowerCase()),
);

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function flatten(obj, prefix = "", out = {}) {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, fullPath, out);
    } else {
      out[fullPath] = value;
    }
  }
  return out;
}

function stripNoise(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/\{\{[^}]*\}\}/g, " ") // i18next interpolation placeholders
    .replace(/https?:\/\/\S+/gi, " ") // URLs
    .replace(/\S+@\S+\.\S+/g, " "); // emails
}

// Matches runs of letters/digits that contain at least one Latin letter,
// e.g. "TRC20", "P2P", "performance", "Web3".
const TOKEN_RE = /[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]*/g;

function extractTokens(rawStr) {
  const cleaned = stripNoise(rawStr);
  const matches = cleaned.match(TOKEN_RE) || [];
  return matches.filter((t) => t.length >= 3 && !EXCLUDED_TOKENS.has(t.toLowerCase()));
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function main() {
  const en = loadJson(EN_PATH);
  const hy = loadJson(HY_PATH);
  const ru = loadJson(RU_PATH);

  const hyFlat = flatten(hy);
  const ruFlat = flatten(ru);
  const enFlat = flatten(en);

  const occurrences = [];

  for (const [keyPath, hyValueRaw] of Object.entries(hyFlat)) {
    if (typeof hyValueRaw !== "string") continue;
    const tokens = extractTokens(hyValueRaw);
    if (tokens.length === 0) continue;

    const ruValueRaw = ruFlat[keyPath];
    const enValueRaw = enFlat[keyPath];

    // De-dup tokens per key (case-insensitive) but keep first-seen casing.
    const seen = new Map();
    for (const t of tokens) {
      const k = t.toLowerCase();
      if (!seen.has(k)) seen.set(k, t);
    }

    for (const [lower, token] of seen) {
      const presentInRu =
        typeof ruValueRaw === "string" &&
        new RegExp(`\\b${escapeRegex(token)}\\b`, "i").test(ruValueRaw);

      occurrences.push({
        keyPath,
        token,
        tier: presentInRu ? "B" : "A",
        hyValue: hyValueRaw,
        ruValue: ruValueRaw ?? "(MISSING IN ru.json)",
        enValue: enValueRaw ?? "(MISSING IN en.json)",
      });
    }
  }

  occurrences.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier === "A" ? -1 : 1;
    return a.keyPath.localeCompare(b.keyPath);
  });

  const tierA = occurrences.filter((o) => o.tier === "A");
  const tierB = occurrences.filter((o) => o.tier === "B");

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ tierA, tierB }, null, 2));
    return;
  }

  console.log(`Total occurrences: ${occurrences.length}`);
  console.log(`Tier A (hy-only, ru does not contain the token): ${tierA.length}`);
  console.log(`Tier B (also present in ru at same key): ${tierB.length}`);
  console.log("");

  console.log("========== TIER A ==========");
  for (const o of tierA) {
    console.log(`\n[${o.keyPath}]  token="${o.token}"`);
    console.log(`  hy: ${o.hyValue}`);
    console.log(`  ru: ${o.ruValue}`);
  }

  console.log("\n\n========== TIER B ==========");
  for (const o of tierB) {
    console.log(`\n[${o.keyPath}]  token="${o.token}"`);
    console.log(`  hy: ${o.hyValue}`);
    console.log(`  ru: ${o.ruValue}`);
  }
}

main();
