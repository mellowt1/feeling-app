// Emits Godzilla body, spine band and plate paths in scene coordinates (no transforms) for Figma booleans.
const fs=require('fs');const G={x:196,y:76,s:0.238};
const tx=(d)=>d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g,(m,a,b)=>`${Math.round((G.x+ +a*G.s)*10)/10},${Math.round((G.y+ +b*G.s)*10)/10}`).replace(/\s+/g,' ').replace(/ ?([MLCZ]) ?/g,'$1');
const get=(f)=>fs.readFileSync(f,'utf8').match(/ d="([^"]+)"/)[1];
const band='M270,120 L330,100 L500,200 L540,420 L560,560 L640,660 L640,700 L600,700 L555,672 L500,612 L468,548 L442,478 L418,408 L388,338 L356,268 L318,208 L276,160 Z';
const out={body:tx(get('godzilla-side-trace.svg')),band:tx(band),plates:tx(get('godzilla-side-plates.svg'))};
fs.writeFileSync('parts/flat.json',JSON.stringify(out));for(const k in out)console.log(k,out[k].length);
