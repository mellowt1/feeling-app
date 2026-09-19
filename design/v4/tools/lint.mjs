#!/usr/bin/env node
// design/v4/tools/lint.mjs
//
// Scene grammar lint for index.html. Parses the file as TEXT (no browser,
// no CSS-object-model, zero dependencies) and prints a per-place markdown
// table, also written to design/v4/LINT.md. See design/v4/PLAN-scene-grammar.md
// task 0.2 for the spec this implements.
//
// Usage: node lint.mjs   (from anywhere; resolves index.html relative to
// this file's location: ../../../index.html)
//
// What "scoped to a place" means here, since this is a text parser and not
// a real CSS engine: a rule (or one comma-separated part of its selector)
// is attributed to a place if it contains an explicit
// html[data-place="<place>"] attribute selector, or one of that place's
// known class/id markers (.campo, .keywest, kwSwell/kwLap/kwRuffle,
// .hawaii, .tokyo, tk- prefixed classes/ids). A bare `.waves ...` selector
// with none of those markers is attributed to dock, because dock is the
// unsuffixed default scene (see PLAN section 1) and the plan's own
// line-number map treats the original .waves engine as dock's.
//
// The three selector prefixes the plan calls "properly scoped" are
// `.waves`, `html[data-place`, and `body.dock .waves` (PLAN 0.2 bullet 5).
// Anything that mentions a place marker but does not start with one of
// those three is reported as an unscoped-selector warning.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..', '..', '..');
const INDEX_PATH = path.join(APP_ROOT, 'index.html');
const OUT_PATH = path.join(__dirname, '..', 'LINT.md');

const PLACES = ['dock', 'campo', 'keywest', 'hawaii', 'tokyo'];

const html = readFileSync(INDEX_PATH, 'utf8');

// ---------------------------------------------------------------------
// 1. Pull out the <style> block and the markup for each place's scene.
// ---------------------------------------------------------------------

const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error('lint.mjs: no <style> block found in index.html');
  process.exit(2);
}
// Strip CSS comments before any parsing. Comments here are long prose
// (design rationale) with no braces of their own, but leaving them in
// would glue their trailing text onto the next selector once braces are
// stripped out by splitTopLevel, corrupting the "starts with" scoping
// check below.
const css = styleMatch[1].replace(/\/\*[\s\S]*?\*\//g, ' ');

// Find each place's `<div class="waves ...">` scene container in document
// order. Boundaries drift (PLAN section 1), so we locate them by content,
// not by line number.
const wavesOpenRe = /<div class="waves([^"]*)"/g;
const wavesOpens = [];
let m;
while ((m = wavesOpenRe.exec(html))) {
  const classAttr = m[1].trim(); // '', 'campo', 'keywest', 'hawaii', 'tokyo'
  const place = classAttr === '' ? 'dock' : classAttr.split(/\s+/)[0];
  if (PLACES.includes(place)) {
    wavesOpens.push({ place, index: m.index });
  }
}

const sceneMarkup = {};
for (let i = 0; i < wavesOpens.length; i++) {
  const { place, index } = wavesOpens[i];
  let end;
  if (i + 1 < wavesOpens.length) {
    end = wavesOpens[i + 1].index;
  } else {
    // Last place in the file (tokyo): stop at its own closing scene
    // comment if present, else the next top-level markup landmark.
    const closeComment = html.indexOf(`<!-- /${place}:scene -->`, index);
    const headrow = html.indexOf('<div class="headrow"', index);
    if (closeComment !== -1) end = closeComment;
    else if (headrow !== -1) end = headrow;
    else end = html.length;
  }
  sceneMarkup[place] = html.slice(index, end);
}

for (const p of PLACES) {
  if (!sceneMarkup[p]) {
    console.error(`lint.mjs: could not find <div class="waves${p === 'dock' ? '' : ' ' + p}"> in index.html`);
    process.exit(2);
  }
}

// ---------------------------------------------------------------------
// 2. Split the stylesheet into top-level rules (recursing into @media),
//    and collect @keyframes bodies separately.
// ---------------------------------------------------------------------

function splitTopLevel(text) {
  // Returns [{ selector, body, braceEnd }] for each top-level `sel { body }`
  // in `text`, using brace-depth counting (no string/url brace escaping
  // needed: this file has none inside scene-relevant rules).
  const rules = [];
  let depth = 0;
  let selStart = 0;
  let bodyStart = -1;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '{') {
      if (depth === 0) bodyStart = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && bodyStart !== -1) {
        const selector = text.slice(selStart, bodyStart).trim();
        const body = text.slice(bodyStart + 1, i);
        rules.push({ selector, body });
        selStart = i + 1;
        bodyStart = -1;
      }
    }
  }
  return rules;
}

const topRules = splitTopLevel(css);

// Flatten: @media wrappers get unwrapped one level (their inner rules are
// what we actually care about); @keyframes are collected into a map;
// everything else is a plain rule.
const keyframes = new Map(); // name -> body text
const rules = []; // { selector, body }

function ingest(list) {
  for (const r of list) {
    const sel = r.selector.trim();
    if (sel.startsWith('@keyframes')) {
      const name = sel.replace('@keyframes', '').trim();
      keyframes.set(name, r.body);
    } else if (sel.startsWith('@media')) {
      ingest(splitTopLevel(r.body));
    } else if (sel.startsWith('@')) {
      // @font-face, @supports, etc: not scene-relevant, skip.
    } else {
      rules.push(r);
    }
  }
}
ingest(topRules);

// ---------------------------------------------------------------------
// 3. Classify each rule (per comma-separated selector part) by place.
// ---------------------------------------------------------------------

const PLACE_MARKER = {
  campo: /\bcampo\b/,
  keywest: /\bkeywest\b|\bkw[A-Z]\w*/,
  hawaii: /\bhawaii\b/,
  tokyo: /\btokyo\b|\btk-/,
};

const SCOPE_OK_PREFIXES = ['.waves', 'html[data-place', 'html[data-sky', 'html.night', 'body.dock .waves', 'body.late .waves', 'body.gust .waves', '.campo', '.keywest', '.hawaii', '.tokyo', '.tk-', '@keyframes'];   // place-class descendants live under .waves.<place> in markup

function classifyPart(part) {
  const dataPlaceMatch = part.match(/html\[data-place="(dock|campo|keywest|hawaii|tokyo)"\]/);
  if (dataPlaceMatch) return dataPlaceMatch[1];
  for (const p of ['campo', 'keywest', 'hawaii', 'tokyo']) {
    if (PLACE_MARKER[p].test(part)) return p;
  }
  if (/\.waves\b/.test(part)) return 'dock';
  return null; // not a scene rule at all
}

// Per-place bucket of { selectorPart, body }
const placeRules = { dock: [], campo: [], keywest: [], hawaii: [], tokyo: [] };
const unscopedWarnings = []; // { place, selector }

for (const rule of rules) {
  const parts = rule.selector.split(',').map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    const place = classifyPart(part);
    if (!place) continue; // not scene-related, ignore
    placeRules[place].push({ selector: part, body: rule.body });
    const okPrefix = SCOPE_OK_PREFIXES.some((p) => part.includes(p));   // a place scope anywhere in the compound (body.gust .keywest …) is scoped
    if (!okPrefix) {
      unscopedWarnings.push({ place, selector: part });
    }
  }
}

// ---------------------------------------------------------------------
// 4. G12: creature count per place = <use> tags inside that place's
//    scene markup.
// ---------------------------------------------------------------------

const useCounts = {};
for (const p of PLACES) {
  const matches = sceneMarkup[p].match(/<use\b/g);
  useCounts[p] = matches ? matches.length : 0;
}

// ---------------------------------------------------------------------
// 5. G9 / G11: walk each place's non-@keyframes rules, pull out
//    animation-name/animation-duration usage, and cross-reference the
//    keyframe body for translate displacement.
// ---------------------------------------------------------------------

const TIME_RE = /^([\d.]+)(m?s)$/;
const NON_NAME_TOKENS = new Set([
  'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start',
  'step-end', 'infinite', 'alternate', 'alternate-reverse', 'reverse',
  'normal', 'forwards', 'backwards', 'both', 'running', 'paused', 'none',
]);

function toSeconds(numStr, unit) {
  const n = parseFloat(numStr);
  return unit === 'ms' ? n / 1000 : n;
}

// Tokenize an `animation:` shorthand value respecting parens (for
// cubic-bezier(...), steps(...)).
function tokenizeAnimationValue(value) {
  const tokens = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      // multiple comma-separated animations on one property; treat as
      // separate declarations
      if (cur.trim()) tokens.push(cur.trim());
      cur = '';
      tokens.push(','); // separator marker
      continue;
    }
    if (/\s/.test(ch) && depth === 0) {
      if (cur) tokens.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function maxTranslatePx(keyframeBody) {
  // Finds every translate/translateX/translateY/translate3d(...) call and
  // returns the largest absolute px value found, plus whether any
  // non-px unit (%, vh, vw, em, rem) was used (can't be compared to the
  // G9 4px threshold, so callers should treat that as "unknown/skip").
  let max = 0;
  let sawNonPx = false;
  const re = /translate(?:X|Y|3d)?\(([^)]+)\)/g;
  let mm;
  while ((mm = re.exec(keyframeBody))) {
    const args = mm[1].split(',');
    for (const arg of args) {
      const a = arg.trim();
      const pxm = a.match(/^(-?[\d.]+)px$/);
      if (pxm) {
        max = Math.max(max, Math.abs(parseFloat(pxm[1])));
      } else if (/^-?[\d.]+(%|vh|vw|em|rem|vmin|vmax)$/.test(a)) {
        sawNonPx = true;
      }
    }
  }
  return { max, sawNonPx };
}

// Cache resolved translate info per keyframe name.
const keyframeTranslateCache = new Map();
function translateInfoFor(name) {
  if (keyframeTranslateCache.has(name)) return keyframeTranslateCache.get(name);
  const body = keyframes.get(name);
  const info = body ? maxTranslatePx(body) : { max: 0, sawNonPx: false };
  keyframeTranslateCache.set(name, info);
  return info;
}

const AMBIENT_THRESHOLD_PX = 4;
const AMBIENT_MAX_DURATION_S = 20; // "under 20s" per G9

const placeStats = {};
for (const place of PLACES) {
  const ambientViolations = []; // { name, durationS, px }
  const nonAmbientDurations = new Set();
  const keyframeNamesUsed = new Set();

  for (const { body } of placeRules[place]) {
    // Find animation-name / animation-duration explicit props first.
    const nameDecl = body.match(/animation-name\s*:\s*([^;]+)/);
    const durDecl = body.match(/animation-duration\s*:\s*([^;]+)/);
    // Also walk full `animation:` shorthand declarations (there may be
    // more than one on a body, e.g. dock/late overrides in the same rule
    // is unlikely but handle generically).
    const shorthandRe = /(?:^|[;{])\s*animation\s*:\s*([^;]+);?/g;
    let sm;
    const shorthandUsages = [];
    while ((sm = shorthandRe.exec(body))) {
      shorthandUsages.push(sm[1].trim());
    }

    function recordUsage(name, durationS) {
      if (!name || name === 'none') return;
      keyframeNamesUsed.add(name);
      const { max: px, sawNonPx } = translateInfoFor(name);
      if (durationS != null && !sawNonPx && durationS < AMBIENT_MAX_DURATION_S && px > AMBIENT_THRESHOLD_PX) {
        ambientViolations.push({ name, durationS, px });
      } else if (durationS != null) {
        nonAmbientDurations.add(durationS);
      }
    }

    for (const shorthand of shorthandUsages) {
      const tokens = tokenizeAnimationValue(shorthand);
      // Split on ',' separators into individual animation declarations.
      const groups = [[]];
      for (const t of tokens) {
        if (t === ',') groups.push([]);
        else groups[groups.length - 1].push(t);
      }
      for (const g of groups) {
        let durationS = null;
        let name = null;
        const times = [];
        for (const tok of g) {
          const tm = tok.match(TIME_RE);
          if (tm) times.push(toSeconds(tm[1], tm[2]));
          else if (!NON_NAME_TOKENS.has(tok) && !/^\d+$/.test(tok) && !/^(cubic-bezier|steps)\(/.test(tok)) {
            name = tok;
          }
        }
        if (times.length > 0) durationS = times[0]; // duration is first time value
        recordUsage(name, durationS);
      }
    }

    if (nameDecl) {
      const name = nameDecl[1].trim().split(/\s|,/)[0];
      let durationS = null;
      if (durDecl) {
        const dm = durDecl[1].trim().split(/\s|,/)[0].match(TIME_RE);
        if (dm) durationS = toSeconds(dm[1], dm[2]);
      }
      recordUsage(name, durationS);
    }
  }

  placeStats[place] = {
    keyframeCount: keyframeNamesUsed.size,
    ambientViolations,
    nonAmbientDurations: [...nonAmbientDurations].sort((a, b) => a - b),
  };
}

// ---------------------------------------------------------------------
// 6. G7: hard-coded colours inside html[data-place="X"]-scoped rules,
//    on non-custom-property declarations only (a --var:#hex; definition
//    is the correct place for the colour to live and is not a violation;
//    a `fill:#hex;`/`background:#hex;`/etc on a descendant selector is).
// ---------------------------------------------------------------------

const hardCodeCounts = {};
for (const place of PLACES) hardCodeCounts[place] = 0;

for (const rule of rules) {
  const parts = rule.selector.split(',').map((s) => s.trim()).filter(Boolean);
  const places = new Set();
  for (const part of parts) {
    const dpm = part.match(/html\[data-place="(dock|campo|keywest|hawaii|tokyo)"\]/);
    if (dpm) places.add(dpm[1]);
  }
  if (places.size === 0) continue;
  // Walk declarations in this rule's body.
  const declRe = /([\w-]+)\s*:\s*([^;]+);?/g;
  let dm;
  let hits = 0;
  while ((dm = declRe.exec(rule.body))) {
    const prop = dm[1].trim();
    const val = dm[2];
    if (prop.startsWith('--')) continue; // variable definition: not a violation
    if (/#[0-9a-fA-F]{3,8}\b/.test(val) || /\brgba?\(\s*\d/.test(val)) {
      hits++;
    }
  }
  if (hits > 0) {
    for (const p of places) hardCodeCounts[p] += hits;
  }
}

// ---------------------------------------------------------------------
// 7. distinct --scene-* variables referenced per place.
// ---------------------------------------------------------------------

const sceneVarCounts = {};
for (const place of PLACES) {
  const vars = new Set();
  for (const { body } of placeRules[place]) {
    const re = /var\(\s*(--scene-[\w-]+)/g;
    let vm;
    while ((vm = re.exec(body))) vars.add(vm[1]);
  }
  sceneVarCounts[place] = vars;
}

// ---------------------------------------------------------------------
// 8. Render markdown report.
// ---------------------------------------------------------------------

let out = '';
out += '# Scene lint\n\n';
out += `Generated by \`design/v4/tools/lint.mjs\` against \`index.html\`. See \`design/v4/PLAN-scene-grammar.md\` task 0.2.\n\n`;
out += '| Place | `<use>` creatures (G12) | keyframes used | ambient-tier violations (>4px, <20s) (G9) | non-ambient durations used (G11) | distinct `--scene-*` vars | hard-coded colour hits (G7) |\n';
out += '|---|---|---|---|---|---|---|\n';
for (const place of PLACES) {
  const s = placeStats[place];
  out += `| ${place} | ${useCounts[place]} | ${s.keyframeCount} | ${s.ambientViolations.length} | ${s.nonAmbientDurations.length} (${s.nonAmbientDurations.map((d) => d + 's').join(', ') || '—'}) | ${sceneVarCounts[place].size} | ${hardCodeCounts[place]} |\n`;
}

out += '\n## Ambient-tier violations (G9: translate > 4px on a loop under 20s)\n\n';
let anyAmbient = false;
for (const place of PLACES) {
  const v = placeStats[place].ambientViolations;
  if (v.length === 0) continue;
  anyAmbient = true;
  out += `- **${place}**: `;
  out += v.map((x) => `\`${x.name}\` (${x.px}px, ${x.durationS}s)`).join(', ');
  out += '\n';
}
if (!anyAmbient) out += 'none found.\n';

out += '\n## Unscoped selectors (not prefixed by `.waves`, `html[data-place`, or `body.dock .waves`)\n\n';
if (unscopedWarnings.length === 0) {
  out += 'none found.\n';
} else {
  for (const w of unscopedWarnings) {
    out += `- **${w.place}**: \`${w.selector}\`\n`;
  }
}

out += '\n## Hard-coded colours inside `html[data-place="X"]` scene rules (G7)\n\n';
const anyHardCode = PLACES.some((p) => hardCodeCounts[p] > 0);
if (!anyHardCode) {
  out += 'none found (all colour is via `--scene-*`/custom-property variables).\n';
} else {
  for (const p of PLACES) {
    if (hardCodeCounts[p] > 0) out += `- **${p}**: ${hardCodeCounts[p]} declaration(s) with a literal colour outside a \`--\` custom property.\n`;
  }
}

writeFileSync(OUT_PATH, out, 'utf8');
console.log(out);

const exitCode = anyHardCode || unscopedWarnings.length > 0 ? 1 : 0;
process.exit(exitCode);
