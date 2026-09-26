#!/usr/bin/env node
// By the fire (Feeling 66): puts scene.css / scene.html / scene.js into index.html between hearth markers,
// right after Tokyo's blocks. Run again after editing any of the three; it replaces what is there.
//   node design/v4/handoff-hearth/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.resolve(here, '../../../index.html');
let s = fs.readFileSync(INDEX, 'utf8');
const part = (f) => fs.readFileSync(path.join(here, f), 'utf8').replace(/\s+$/, '') + '\n';

function put(open, close, after, body) {
  const block = open + '\n' + body + close;
  const a = s.indexOf(open);
  if (a >= 0) { const b = s.indexOf(close, a); s = s.slice(0, a) + block + s.slice(b + close.length); return; }
  const at = s.indexOf(after); if (at < 0) throw new Error('anchor missing: ' + after);
  const end = at + after.length;
  s = s.slice(0, end) + '\n' + block + s.slice(end);
}
put('  /* hearth:css */', '  /* /hearth:css */', '  /* /tokyo:css */', part('scene.css'));
put('    <!-- hearth:scene -->', '    <!-- /hearth:scene -->', '    <!-- /tokyo:scene -->', part('scene.html'));
put('<!-- hearth:js -->', '<!-- /hearth:js -->', '<!-- /tokyo:js -->', part('scene.js'));
fs.writeFileSync(INDEX, s);
console.log('hearth blocks in place');
