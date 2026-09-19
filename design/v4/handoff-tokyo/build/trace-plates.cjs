const sharp = require('sharp'), potrace = require('potrace'), fs = require('fs');
const src = 'C:/Users/Admin/Desktop/PAUL AGENTS/Feeling App/design/109-1099332_free-render-for-use-godzilla-final-wars-render.png';
const [lo, hi] = [+process.argv[2] || 105, +process.argv[3] || 215];
(async () => {
  const { data, info } = await sharp(src).resize({ width: 786, kernel: 'lanczos3' }).greyscale().blur(1).raw().toBuffer({ resolveWithObject: true });
  const bg = Buffer.from(data.map(v => v >= hi ? 255 : 0));
  const near = await sharp(bg, { raw: { width: info.width, height: info.height, channels: 1 } }).blur(2.6).extractChannel(0).raw().toBuffer();
  // pale plates: lighter than the body, darker than the white background; only on the back (x > 280 in 3x space)
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) { const i = y * info.width + x; data[i] = (data[i] > lo && data[i] < hi && x > 280 && near[i] < 22 && y < 700) ? 0 : 255; }
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  potrace.trace(png, { turdSize: 25, optTolerance: 0.5, threshold: 128 }, async (e, svg) => {
    fs.writeFileSync('godzilla-plates.svg', svg);
    const body = fs.readFileSync('godzilla-side.svg', 'utf8').match(/ d="([^"]+)"/)[1];
    const pl = svg.match(/ d="([^"]+)"/)[1];
    const comp = `<svg xmlns="http://www.w3.org/2000/svg" width="786" height="840"><rect width="786" height="840" fill="#3a2440"/><path d="${body}" fill="#171220"/><path d="${pl}" fill="#9fe6ff" opacity=".85"/></svg>`;
    await sharp(Buffer.from(comp)).png().toFile('gz-plates-check.png'); console.log('plates chars', pl.length);
  });
})();
