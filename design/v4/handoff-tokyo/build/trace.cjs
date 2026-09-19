const sharp = require('sharp'), potrace = require('potrace'), fs = require('fs');
const src = 'C:/Users/Admin/Desktop/PAUL AGENTS/Feeling App/design/Godzilla.webp';
(async () => {
  // alpha -> black on white, downscale to ~600px tall for a smooth, light path
  const { data, info } = await sharp(src).resize({ height: 640 }).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i++) data[i] = data[i] > 110 ? 0 : 255;
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  potrace.trace(png, { turdSize: 40, optTolerance: 0.6, alphaMax: 1.0, threshold: 128 }, (e, svg) => {
    if (e) throw e;
    fs.writeFileSync('godzilla.svg', svg);
    const d = svg.match(/ d="([^"]+)"/)[1];
    console.log(info.width + 'x' + info.height, 'path chars', d.length);
  });
})();
