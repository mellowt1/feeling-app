const sharp = require('sharp'), potrace = require('potrace'), fs = require('fs');
const src = 'C:/Users/Admin/Desktop/PAUL AGENTS/Feeling App/design/109-1099332_free-render-for-use-godzilla-final-wars-render.png';
const T = +process.argv[2] || 225;
(async () => {
  const { data, info } = await sharp(src).resize({ width: 786, kernel: 'lanczos3' }).greyscale().blur(1.2).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i++) data[i] = data[i] < T ? 0 : 255;
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  potrace.trace(png, { turdSize: 60, optTolerance: 0.5, alphaMax: 1.0, threshold: 128 }, async (e, svg) => {
    if (e) throw e;
    fs.writeFileSync('godzilla-side.svg', svg);
    console.log(info.width + 'x' + info.height, 'chars', svg.length);
    await sharp(Buffer.from(svg)).flatten({ background: '#e8b27a' }).png().toFile('gz-side-check.png');
  });
})();
