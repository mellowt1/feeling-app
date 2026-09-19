// node apply.mjs <src index.html> <dest index.html>
// Adds the Hawaiʻi place. Idempotent: strips an earlier Hawaiʻi insert first.
import fs from 'fs';
const D = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const [, , src, dest] = process.argv;
let s = fs.readFileSync(src, 'utf8');
const symbols = fs.readFileSync(D + 'symbols.html', 'utf8');
const markup = fs.readFileSync(D + 'markup.html', 'utf8');
const css = fs.readFileSync(D + 'style.css', 'utf8');
const B = (n) => `<!-- hawaii:${n} -->`, E = (n) => `<!-- /hawaii:${n} -->`;
const CB = '  /* hawaii:css */\n', CE = '  /* /hawaii:css */\n';
// strip previous
s = s.replace(/<!-- hawaii:(\w+) -->[\s\S]*?<!-- \/hawaii:\1 -->\n?/g, '');
s = s.replace(/  \/\* hawaii:css \*\/\n[\s\S]*?  \/\* \/hawaii:css \*\/\n/, '');
const once = (from, to) => { if (!s.includes(from)) throw new Error('anchor missing: ' + from.slice(0, 80)); s = s.replace(from, to); };

// 1 sprite
once('<symbol id="f-turtle"', B('sym') + symbols + E('sym') + '\n<symbol id="f-turtle"');
// 2 css, at the end of the main stylesheet
const i = s.indexOf('</style>'); s = s.slice(0, i) + CB + css + CE + s.slice(i);
// 3 scene markup, after Key West
once('    <div class="headrow">', '    ' + B('scene') + '\n    ' + markup.trim() + '\n    ' + E('scene') + '\n\n    <div class="headrow">');

// 4 place pill: a jagged ridge
const MARK = 'M0 11 L2.6 6.4 L3.8 7.6 L5.6 3 L7 5.2 L8.4 1 L10 4.4 L11.2 3.4 L13 7 L14.2 6.2 L16 11 Z';
if (!s.includes('data-p="hawaii"')) once('        <button data-p="dock" type="button"', `        <button data-p="hawaii" type="button" aria-label="Hawaiʻi"><svg viewBox="0 0 16 12" aria-hidden="true"><path d="${MARK}"/></svg></button>\n        <button data-p="dock" type="button"`);

// 5 head script: accept the place; season classes for whales (Dec–Apr) and migrant shorebirds (Aug–Apr); ?season=winter|summer to preview
const rep = (a, b) => { if (s.includes(b)) return; once(a, b); };
rep("if (p === 'campo' || p === 'keywest') place = p; } catch (e) {}", "if (p === 'campo' || p === 'keywest' || p === 'hawaii') place = p; } catch (e) {}");
rep("if (/^(dock|campo|keywest)$/.test(q.get('place') || '')) place = q.get('place');", "if (/^(dock|campo|keywest|hawaii)$/.test(q.get('place') || '')) place = q.get('place');\n  const mo = q.get('season') === 'winter' ? 0 : q.get('season') === 'summer' ? 6 : new Date().getMonth();\n  document.documentElement.classList.toggle('whales', mo === 11 || mo <= 3);\n  document.documentElement.classList.toggle('migrants', mo >= 7 || mo <= 3);");
rep("keywest: ['#CFE9EC', '#D39C9C', '#0B161D'] };", "keywest: ['#CFE9EC', '#D39C9C', '#0B161D'], hawaii: ['#A9D0E6', '#8E86B0', '#0A1419'] };");
// 6 names, marks, hints, sound
rep("keywest: 'Key West' };", "keywest: 'Key West', hawaii: 'Hawaiʻi' };");
rep("M8 5 L5 0.5 L10.5 0.5 Z' };", `M8 5 L5 0.5 L10.5 0.5 Z', hawaii: '${MARK}' };`);
rep("keywest: 'Breathe with the tide · tap anywhere to come back' };", "keywest: 'Breathe with the tide · tap anywhere to come back', hawaii: 'Breathe with the trade wind · tap anywhere to come back' };");
rep("return p === 'campo' || p === 'keywest' ? p : 'dock'; };", "return p === 'campo' || p === 'keywest' || p === 'hawaii' ? p : 'dock'; };");
// C major, bowl on C4: warm and open, apart from dock D, Key West F, campo A
rep("    campo:   { root: 55.00,", "    hawaii:  { root: 65.41, chord: [0, 7, 14, 16, 19], bowl: 261.63, water: { lp: 460, base: 0.09, swell: 0.44, open: 780 }, padLp: 350 },\n    campo:   { root: 55.00,");

fs.writeFileSync(dest, s);
console.log('written', dest, s.length);
