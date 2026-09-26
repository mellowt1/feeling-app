#!/usr/bin/env node
// Florida dock, new look (Feeling 67): puts scene.css / scene.html / scene.js into index.html between dock5 markers,
// right after By the fire's blocks. Run again after editing any of the three; it replaces what is there.
//   node design/v4/handoff-dock5/build.mjs
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
put('  /* dock5:css */', '  /* /dock5:css */', '  /* /hearth:css */', part('scene.css'));
put('    <!-- dock5:scene -->', '    <!-- /dock5:scene -->', '    <!-- /hearth:scene -->', part('scene.html'));
put('<!-- dock5:js -->', '<!-- /dock5:js -->', '<!-- /hearth:js -->', part('scene.js'));
fs.writeFileSync(INDEX, s);
console.log('dock5 blocks in place');
