const fs=require('fs');const sharp=require(process.argv[2]+'/node_modules/sharp');
const o=JSON.parse(fs.readFileSync('parts/order.json'));const layers=[...o.order,...(process.argv[3]==='beam'?['beam']:[])];
const body=layers.map(k=>fs.readFileSync(`parts/${k}.svg`,'utf8').replace('<svg ','<svg x="0" y="0" ')).join('');
const s=`<svg xmlns="http://www.w3.org/2000/svg" width="390" height="420">${body}</svg>`;
sharp(Buffer.from(s),{density:144}).png().toFile(process.argv[4]).then(()=>console.log('ok'));
