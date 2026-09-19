// preview with per-layer blur + glow, the way Figma/CSS will show it
const fs=require('fs');const sharp=require(process.argv[2]+'/node_modules/sharp');
const o=JSON.parse(fs.readFileSync('parts/order.json'));const beam=process.argv[3]==='beam';
const defs=`<defs><filter id="b2"><feGaussianBlur stdDeviation="2"/></filter><filter id="b3"><feGaussianBlur stdDeviation="3"/></filter><filter id="b5"><feGaussianBlur stdDeviation="5"/></filter><filter id="b7"><feGaussianBlur stdDeviation="7"/></filter><filter id="b10"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="sp" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="${beam?5:3}" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
const blurs={'bay-light':'b7','beam-glow':'b10','beam-mid':'b2','mouth-flare':'b3','impact-fire':'b7','impact-flash':'b5'};
let body='';
for(const k of [...o.order.slice(0,6),...(beam?['beam']:[]),...o.order.slice(6)]){let s=fs.readFileSync(`parts/${k}.svg`,'utf8').replace('<svg ','<svg x="0" y="0" ');
 if(k==='spines'){s=s.replace(/^<svg ([^>]*)>/,'<svg $1><g filter="url(#sp)">').replace(/<\/svg>$/,'</g></svg>');}
 if(k==='smoke')s=s.replace(/<ellipse/g,'<ellipse filter="url(#b5)"');
 if(k==='fires')s=s.replace(/opacity=".85"\/>/g,'opacity=".85" filter="url(#b2)"/>');
 for(const [id,f] of Object.entries(blurs))s=s.replace(`id="${id}"`,`id="${id}" filter="url(#${f})"`);
 body+=s;}
sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="390" height="420">${defs}${body}</svg>`),{density:144}).png().toFile(process.argv[4]).then(()=>console.log('ok'));
