// Key West, second pass: conch shack, hammock between two palms, the Overseas Highway on the horizon, a skiff, old pilings.
const fs = require('fs'), path = require('path');
const { frond } = require('./palm.cjs');
const { palm } = require('./palmlib.cjs');

const svg = `
<!-- sky, towering clouds, sun or moon -->
<rect x="0" y="0" width="390" height="206" fill="url(#k-sky)"></rect>
<g opacity="{{ v.stars }}" fill="#E8EEF6"><circle class="k-star" cx="30" cy="40" r=".9"></circle><circle class="k-star s2" cx="80" cy="96" r=".7"></circle><circle class="k-star" cx="134" cy="30" r="1"></circle><circle class="k-star s3" cx="176" cy="84" r=".6"></circle><circle class="k-star s2" cx="222" cy="44" r=".8"></circle><circle class="k-star" cx="260" cy="120" r=".6"></circle><circle class="k-star s3" cx="312" cy="26" r=".9"></circle><circle class="k-star" cx="356" cy="92" r=".7"></circle><circle class="k-star s2" cx="16" cy="134" r=".6"></circle><circle class="k-star s3" cx="200" cy="140" r=".5"></circle></g>
<circle class="k-sunglow" cx="{{ v.sunX }}" cy="{{ v.sunY }}" r="{{ v.glowR }}" fill="url(#k-sunglow)"></circle>
<circle cx="{{ v.sunX }}" cy="{{ v.sunY }}" r="{{ v.sunR }}" fill="{{ c.sunCore }}"></circle>
<g class="k-cloud">
<path d="M150,172 C144,158 154,146 168,150 C170,132 190,124 204,134 C212,118 236,118 244,134 C258,128 274,138 270,154 C284,156 290,168 282,176 Z" fill="{{ c.cloud }}"></path>
<path d="M150,172 C180,178 250,180 282,176 C270,170 240,168 220,170 C190,168 166,166 150,172 Z" fill="{{ c.cloudShade }}"></path>
<path d="M168,150 C170,132 190,124 204,134 C212,118 236,118 244,134" stroke="{{ c.cloudLit }}" stroke-width="2" fill="none" opacity=".8"></path>
</g>
<g class="k-cloud c2"><path d="M290,128 C298,118 314,120 320,114 C330,106 348,110 352,120 C364,118 372,124 370,132 L288,134 Z" fill="{{ c.cloud }}" opacity=".85"></path></g>
<g class="k-frigate" opacity="{{ v.birds }}"><use href="#f-frigate" x="96" y="96" width="10" height="17.6" fill="{{ c.bird }}"></use></g>

<!-- the sea; the Overseas Highway along the horizon with a car crossing; the lighthouse key -->
<rect x="0" y="200" width="390" height="120" fill="url(#k-sea)"></rect>
<g fill="{{ c.far }}" opacity=".85" transform="translate(126,0)">
<rect x="-10" y="189" width="250" height="2.4"></rect>
<path d="M0,191.4 V199 M16,191.4 V199 M32,191.4 V199 M48,191.4 V199 M64,191.4 V199 M80,191.4 V199 M96,191.4 V199 M112,191.4 V199 M128,191.4 V199 M144,191.4 V199 M160,191.4 V199 M176,191.4 V199 M192,191.4 V199 M208,191.4 V199 M224,191.4 V199 M240,191.4 V199" stroke="{{ c.far }}" stroke-width="1.6"></path>
<path d="M232,189 C236,186 240,186 244,189" stroke="{{ c.far }}" stroke-width="1" fill="none"></path>
</g>
<g transform="translate(126,0)"><g class="k-car"><rect x="-8" y="186.4" width="5" height="2.6" rx=".8" fill="{{ c.car }}"></rect><circle cx="-2.6" cy="187.6" r="1.1" fill="#FFF2C0" opacity="{{ v.lights }}"></circle></g></g>
<path d="M116,203 C126,198 144,196 160,197 C172,197 184,199 196,203 Z" fill="{{ c.key }}"></path>
<path d="M122,199 q3,-5 6,0 M178,199 q3,-5 6,0" stroke="{{ c.key }}" stroke-width="2.4" fill="none"></path>
<rect x="147" y="172" width="6" height="26" fill="{{ c.tower }}"></rect><rect x="146" y="168" width="8" height="5" fill="{{ c.towerTop }}"></rect><path d="M145.5,168 L150,163 L154.5,168 Z" fill="{{ c.towerTop }}"></path>
<circle cx="150" cy="170.5" r="1.6" fill="#FFE9A8" opacity="{{ v.beam }}"></circle>
<g opacity="{{ v.beam }}"><g class="k-beam"><path d="M150,170.5 L269,152 L269,188 Z" fill="url(#k-beam)" filter="url(#k-soft)"></path></g></g>
<g opacity="{{ v.schooner }}" transform="translate(-76,0)"><g class="k-sail"><path d="M204,200 L204,178 L216,198 Z M206,178 L206,200 M196,200 L220,200 L216,204 L200,204 Z M200,182 L204,200 L194,198 Z" fill="{{ c.key }}" stroke="{{ c.key }}" stroke-width=".6"></path></g></g>
<g transform="translate({{ v.sunX }},0)" opacity="{{ v.glints }}" stroke="{{ c.glint }}" stroke-linecap="round">
<path class="k-gl" d="M-14,208 H14" stroke-width="2"></path><path class="k-gl g2" d="M-20,217 H8" stroke-width="1.8"></path><path class="k-gl g3" d="M-6,227 H22" stroke-width="1.6"></path><path class="k-gl" d="M-24,239 H2" stroke-width="1.5"></path>
</g>

<!-- the flats: seagrass, a sandbar, a turtle, dolphins at dusk, an anchored skiff, old pilings with gulls -->
<g fill="{{ c.seagrass }}" opacity=".45"><ellipse cx="60" cy="236" rx="40" ry="5"></ellipse><ellipse cx="150" cy="252" rx="52" ry="6"></ellipse><ellipse cx="300" cy="244" rx="46" ry="5"></ellipse><ellipse cx="230" cy="266" rx="36" ry="4.6"></ellipse></g>
<path d="M130,280 C180,272 250,274 330,278 C300,284 200,286 130,280 Z" fill="{{ c.shallowSand }}" opacity=".55"></path>
<g opacity="{{ v.turtle }}"><g class="k-turtle"><use href="#f-turtle" x="96" y="256" width="15" height="13.8" fill="{{ c.under }}"></use></g></g>
<g opacity="{{ v.dolphins }}"><g class="k-dolphin"><use href="#f-dolphin" x="120" y="212" width="26" height="8.4" fill="{{ c.bird }}"></use></g><g class="k-dolphin k2"><use href="#f-dolphin" x="138" y="216" width="22" height="7" fill="{{ c.bird }}"></use></g></g>
<g class="k-wave" stroke="{{ c.foam }}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".55"><path d="M20,222 q10,-3 20,0 M90,230 q12,-3 24,0 M170,220 q9,-2 18,0 M250,232 q12,-3 24,0 M330,222 q10,-3 20,0 M40,258 q14,-4 28,0 M180,262 q14,-4 28,0 M320,262 q14,-4 28,0"></path></g>
<g class="k-skiff">
<path d="M176,240 L206,240 L202,246 L180,246 Z" fill="{{ c.hull }}"></path><path d="M178,240 H205" stroke="{{ c.hullTrim }}" stroke-width="1.2"></path>
<rect x="189" y="234" width="6" height="6" fill="{{ c.hullTrim }}"></rect><path d="M188,234 H196" stroke="{{ c.far }}" stroke-width="1"></path>
<path d="M176,241 C170,246 166,252 164,258" stroke="{{ c.line }}" stroke-width=".6" fill="none"></path>
</g>
<path d="M172,247 C182,249 200,249 210,247" stroke="{{ c.foam }}" stroke-width=".9" fill="none" opacity=".5"></path>
<g fill="{{ c.piling }}"><rect x="238" y="226" width="4" height="28"></rect><rect x="254" y="228" width="4" height="27"></rect><rect x="270" y="230" width="4" height="26"></rect><rect x="286" y="232" width="4" height="25"></rect></g>
<path d="M236,254 q4,2 8,0 M252,255 q4,2 8,0 M268,256 q4,2 8,0 M284,257 q4,2 8,0" stroke="{{ c.foam }}" stroke-width=".9" fill="none" opacity=".6"></path>
<g opacity="{{ v.birds }}"><use href="#f-gull" x="235" y="215" width="11" height="9.6" fill="{{ c.gull }}"></use><g transform="matrix(-1 0 0 1 572 0)"><use href="#f-gull" x="281" y="221" width="10" height="8.8" fill="{{ c.gull }}"></use></g></g>
<g opacity="{{ v.egret }}"><g class="k-egret"><use href="#f-egret" x="146" y="258" width="11" height="25.7" fill="{{ c.egret }}"></use></g></g>

<!-- the beach -->
<path d="M0,292 C70,286 150,290 230,286 C300,283 350,288 390,284 L390,420 L0,420 Z" fill="url(#k-sand)"></path>
<path class="k-surf" d="M0,290 C70,284 150,288 230,284 C300,281 350,286 390,282" stroke="{{ c.foam }}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"></path>
<path class="k-surf s2" d="M0,284 C60,279 140,283 220,279 C290,276 350,280 390,277" stroke="{{ c.foam }}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"></path>
<path d="M150,330 q2,-1 4,0 M220,360 q2,-1 4,0 M110,380 q2,-1 4,0 M260,390 q2,-1 4,0" stroke="{{ c.sandDeep }}" stroke-width="1.2" fill="none"></path>

<!-- the conch shack on stilts: tin roof, porch, shutters, string lights after dusk -->
<g fill="{{ c.stilt }}"><rect x="10" y="258" width="4" height="36"></rect><rect x="40" y="258" width="4" height="38"></rect><rect x="70" y="258" width="4" height="38"></rect><rect x="100" y="258" width="4" height="36"></rect></g>
<rect x="8" y="210" width="98" height="48" fill="{{ c.shackWall }}"></rect>
<path d="M8,218 H106 M8,226 H106 M8,234 H106 M8,242 H106 M8,250 H106" stroke="{{ c.siding }}" stroke-width=".8"></path>
<path d="M-2,213 L57,186 L116,213 Z" fill="{{ c.roof }}"></path>
<path d="M10,212 L57,190 M22,212 L57,194 M34,212 L57,198 M80,212 L57,198 M92,212 L57,194 M104,212 L57,190" stroke="{{ c.roofLine }}" stroke-width=".7" opacity=".7"></path>
<rect x="18" y="220" width="18" height="15" fill="{{ c.window }}"></rect><rect x="78" y="220" width="18" height="15" fill="{{ c.window }}"></rect>
<rect x="13" y="220" width="5" height="15" fill="{{ c.shutter }}"></rect><rect x="36" y="220" width="5" height="15" fill="{{ c.shutter }}"></rect><rect x="73" y="220" width="5" height="15" fill="{{ c.shutter }}"></rect><rect x="96" y="220" width="5" height="15" fill="{{ c.shutter }}"></rect>
<rect x="49" y="222" width="15" height="36" fill="{{ c.door }}"></rect><circle cx="61" cy="241" r=".9" fill="{{ c.siding }}"></circle>
<rect x="2" y="256" width="112" height="4" fill="{{ c.trim }}"></rect>
<path d="M2,244 H114 M2,244 V256 M114,244 V256 M12,244 V256 M22,244 V256 M32,244 V256 M76,244 V256 M86,244 V256 M96,244 V256 M106,244 V256" stroke="{{ c.trim }}" stroke-width="1.4"></path>
<path d="M114,260 L128,292 M120,260 L134,292 M116,266 H122 M119,273 H125 M121,280 H128 M124,287 H131" stroke="{{ c.stilt }}" stroke-width="1.4"></path>
<circle cx="57" cy="230" r="46" fill="url(#k-lamp)" opacity="{{ v.windows }}"></circle>
<g opacity="{{ v.strings }}"><path d="M0,214 C20,220 40,220 57,216 C74,220 94,220 116,214" stroke="{{ c.stilt }}" stroke-width=".5" fill="none"></path>
<g class="k-bulbs" fill="#FFD890"><circle cx="8" cy="216.6" r="1.4"></circle><circle cx="20" cy="218.6" r="1.4"></circle><circle cx="32" cy="219.2" r="1.4"></circle><circle cx="44" cy="218.4" r="1.4"></circle><circle cx="57" cy="216.2" r="1.4"></circle><circle cx="70" cy="218.4" r="1.4"></circle><circle cx="82" cy="219.2" r="1.4"></circle><circle cx="94" cy="218.6" r="1.4"></circle><circle cx="106" cy="216.6" r="1.4"></circle></g></g>
<g class="k-rooster"><use href="#f-rooster" x="20" y="229" width="14" height="15.5" fill="{{ c.rooster }}"></use></g>
<g class="k-hen"><use href="#f-hen" x="138" y="296" width="11" height="15.6" fill="{{ c.hen }}"></use></g>
<g opacity="{{ v.iguana }}"><use href="#f-iguana" x="118" y="276" width="20" height="10" fill="{{ c.iguana }}"></use></g>

<!-- two palms and the hammock between them, Paul in it; a cooler and flip-flops underneath -->
PALM_A
PALM_B
<ellipse cx="316" cy="346" rx="74" ry="7" fill="{{ c.shadow }}" opacity=".3"></ellipse>
<rect x="300" y="330" width="18" height="11" rx="2" fill="{{ c.cooler }}"></rect><rect x="300" y="330" width="18" height="3.4" rx="1.5" fill="{{ c.trim }}"></rect>
<path d="M326,340 l5,-1.4 l1,2 l-5,1.4 Z M332,342 l5,-1.4 l1,2 l-5,1.4 Z" fill="{{ c.flops }}"></path>
<g class="k-hammock">
<path d="M270,272 L286,292 M364,266 L350,288" stroke="{{ c.rope }}" stroke-width="1"></path>
<path d="M284,290 C300,312 334,312 352,286 L354,292 C336,322 298,320 282,296 Z" fill="{{ c.hammockBack }}"></path>
<g transform="translate(270,247) scale(.42)"><g class="breathe-fig" fill="{{ c.fig }}" stroke="{{ c.fig }}" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M150 74 C162 78,168 90,166 106 C164 120,162 130,162 140 L44 140 C34 140,28 134,27 124 C26 116,24 106,29 102 C34 99,39 104,40 112 C42 118,50 114,60 110 C66 107,70 104,74 102 C92 98,108 108,120 114 C124 106,130 92,136 82 C140 76,144 74,150 74 Z"></path>
<path stroke="none" d="M137 81 L153 75 L153 60 L140 66 Z"></path>
<ellipse cx="146" cy="60" rx="15" ry="17" transform="rotate(6 146 60)" stroke="none"></ellipse>
<path d="M120 50 C124 36,168 34,174 50 C182 52,186 54,184 56 L114 56 C114 53,116 51,120 50 Z" fill="{{ c.hat }}" stroke="none"></path>
</g></g>
<path d="M282,296 C298,318 336,320 354,292 L352,300 C334,326 296,324 280,302 Z" fill="{{ c.hammock }}"></path>
<path d="M284,299 C300,317 334,318 351,297 M283,303 C299,321 333,322 350,301" stroke="{{ c.hammockStripe }}" stroke-width="1.6" fill="none"></path>
</g>

<!-- a pelican gliding low, a ghost crab after dark -->
<g class="k-pelican" opacity="{{ v.birds }}"><use href="#f-pelican" x="0" y="168" width="28" height="14.3" fill="{{ c.bird }}"></use></g>
<g opacity="{{ v.crab }}"><g class="k-crab"><use href="#f-crab" x="210" y="352" width="11" height="7.8" fill="{{ c.crab }}"></use></g></g>

<!-- sea grape in the foreground -->
<g class="k-grape">
<g fill="{{ c.grapeDark }}"><circle cx="8" cy="378" r="14"></circle><circle cx="30" cy="368" r="12"></circle><circle cx="50" cy="384" r="13"></circle><circle cx="20" cy="398" r="14"></circle><circle cx="-4" cy="358" r="11"></circle></g>
<g fill="{{ c.grape }}"><circle cx="16" cy="372" r="9"></circle><circle cx="36" cy="362" r="7.5"></circle><circle cx="54" cy="378" r="8"></circle><circle cx="4" cy="390" r="8.6"></circle><circle cx="30" cy="388" r="7"></circle></g>
<g fill="{{ c.grapeRed }}"><circle cx="44" cy="372" r="4.4"></circle><circle cx="12" cy="360" r="4"></circle></g>
<path d="M16,372 L20,366 M36,362 L39,357 M54,378 L58,373 M4,390 L7,385" stroke="{{ c.grapeDark }}" stroke-width="1" fill="none"></path>
</g>
<path d="M358,330 C360,316 364,308 370,302 M364,330 C364,318 368,310 376,306 M370,330 C372,320 378,314 384,312" stroke="{{ c.seaOats }}" stroke-width="1.4" fill="none" stroke-linecap="round"></path>
`;

const PAL = {
  morning: { page: '#F6E6DA', skyTop: '#EDE4E8', skyMid: '#F7DCCB', horizon: '#FBE2BE', sun: '#FFD28A', sunCore: '#FFE9BC', cloud: '#F9E2D6', cloudShade: '#E8C4BC', cloudLit: '#FFE8C6', far: '#8E9CA0', car: '#C0584A', seaFar: '#7FA8B4', seaMid: '#86C2C0', shallow: '#B6E0D4', shallowSand: '#F1E2C4', seagrass: '#4E8078', key: '#6E8078', tower: '#F4EEE6', towerTop: '#3A3A3E', glint: '#FFF1D2', foam: '#FFFBF4', under: '#3E7A76', hull: '#F2EEE6', hullTrim: '#3E88A8', line: '#8A7A68', piling: '#6E5A48', gull: '#F4F0EA', egret: '#FFFFFF', sandWet: '#D8C4A2', sand: '#F2E2C4', sandDeep: '#E6CFA8', stilt: '#7A6452', shackWall: '#A8DCCC', siding: '#8CC4B2', roof: '#B8BEC2', roofLine: '#8E969C', window: '#5E7A80', shutter: '#E88A6A', door: '#F0C66A', trim: '#FFFFFF', rooster: '#8A4A34', hen: '#A8744E', iguana: '#6E8A4E', shadow: '#7A6A58', cooler: '#3E88A8', flops: '#E86A5A', rope: '#8A7A68', hammock: '#F0E6D2', hammockBack: '#D0C4AE', hammockStripe: '#D86A5A', fig: '#2F3A3E', hat: '#D8C29A', bird: '#40505A', crab: '#E8DCC8', grape: '#6E9A52', grapeDark: '#4E7A42', grapeRed: '#B8583E', seaOats: '#B8A070', trunk: '#8A6E58', trunkRing: '#6E5646', frond: '#4E7A52', frondBack: '#34604A', rib: '#9CC07E', dry: '#9A7A4E', coconut: '#6E5238' },
  day: { page: '#DDF0F2', skyTop: '#9FD2EC', skyMid: '#C6E6F2', horizon: '#EAF6F4', sun: '#FFFFFF', sunCore: '#FFFFFF', cloud: '#FFFFFF', cloudShade: '#DCE8F0', cloudLit: '#FFFFFF', far: '#7E949A', car: '#D8584A', seaFar: '#2F8FB0', seaMid: '#3EC0C4', shallow: '#9FE6D6', shallowSand: '#F6ECD4', seagrass: '#2A7A70', key: '#5C8070', tower: '#FFFFFF', towerTop: '#2E3236', glint: '#FFFFFF', foam: '#FFFFFF', under: '#1E7070', hull: '#FFFFFF', hullTrim: '#2E7EA8', line: '#7A6A58', piling: '#6A5644', gull: '#FFFFFF', egret: '#FFFFFF', sandWet: '#DCC9A4', sand: '#F6E8CC', sandDeep: '#EAD5AE', stilt: '#7A6250', shackWall: '#9EE0CC', siding: '#80C8B2', roof: '#C4CACE', roofLine: '#969EA4', window: '#4E6E78', shutter: '#F07E5E', door: '#F6C85A', trim: '#FFFFFF', rooster: '#9A4A30', hen: '#B07A50', iguana: '#6A8E48', shadow: '#8C7658', cooler: '#2E7EA8', flops: '#F0604E', rope: '#7A6A58', hammock: '#F6EEDC', hammockBack: '#D4C8B0', hammockStripe: '#E0604E', fig: '#2C383C', hat: '#E0CCA2', bird: '#3C4E57', crab: '#EDE2CE', grape: '#62A04A', grapeDark: '#3E7A3A', grapeRed: '#C0563A', seaOats: '#B09A64', trunk: '#8E7058', trunkRing: '#705846', frond: '#3E7E4E', frondBack: '#2A5E40', rib: '#A6D08A', dry: '#A6844E', coconut: '#6A4E34' },
  evening: { page: '#EDBFA2', skyTop: '#C890A8', skyMid: '#EEA286', horizon: '#FBC478', sun: '#FF8A48', sunCore: '#FFBC6E', cloud: '#E28E86', cloudShade: '#B26A76', cloudLit: '#FFC28A', far: '#5A4A5A', car: '#3A2E36', seaFar: '#7A6A88', seaMid: '#C58A88', shallow: '#EDB49A', shallowSand: '#F6CCAA', seagrass: '#6A4E5E', key: '#4A3C4A', tower: '#F4D6C4', towerTop: '#2A2228', glint: '#FFD29A', foam: '#FFE6D2', under: '#5A4A5A', hull: '#F2D8C8', hullTrim: '#4E5A7A', line: '#6E5040', piling: '#3E2E2E', gull: '#F4DCD0', egret: '#F8E2D6', sandWet: '#C99C84', sand: '#EEC6A6', sandDeep: '#DDAE8E', stilt: '#4E3A34', shackWall: '#B8B0A0', siding: '#9A9084', roof: '#8E7E80', roofLine: '#6E6064', window: '#FFC878', shutter: '#B05A48', door: '#D8A060', trim: '#F4DCD0', rooster: '#6E3426', hen: '#8A5A40', iguana: '#4E4A36', shadow: '#6E4A40', cooler: '#4E5A7A', flops: '#B8503E', rope: '#6E5040', hammock: '#F0D8C8', hammockBack: '#C8A898', hammockStripe: '#B8503E', fig: '#271E24', hat: '#C8A088', bird: '#2F2630', crab: '#F2D6C4', grape: '#4E4E36', grapeDark: '#36382A', grapeRed: '#8A3E2E', seaOats: '#8E6A50', trunk: '#5E4038', trunkRing: '#4A302A', frond: '#3A3A36', frondBack: '#2A2A2A', rib: '#6E5A48', dry: '#5E4432', coconut: '#3E2A24' },
  night: { page: '#0E1820', skyTop: '#0A131C', skyMid: '#12202E', horizon: '#1E3040', sun: '#DCE6EA', sunCore: '#E8EEF0', cloud: '#1A2833', cloudShade: '#131E28', cloudLit: '#2E4250', far: '#16222C', car: '#10161C', seaFar: '#14283A', seaMid: '#183448', shallow: '#1E4450', shallowSand: '#2A3A40', seagrass: '#0E1C22', key: '#0E181E', tower: '#9AA4AA', towerTop: '#0E1418', glint: '#C9D8DE', foam: '#6A8A96', under: '#0E1E26', hull: '#5A646A', hullTrim: '#2A3E4E', line: '#34322E', piling: '#12161A', gull: '#6A747A', egret: '#8A949A', sandWet: '#2A3034', sand: '#363C40', sandDeep: '#2C3236', stilt: '#1E1C1C', shackWall: '#3A4A4A', siding: '#2E3C3C', roof: '#2A3034', roofLine: '#20262A', window: '#FFC878', shutter: '#3A2A28', door: '#4A3E30', trim: '#5A6468', rooster: '#1E1A1A', hen: '#262220', iguana: '#1A1E18', shadow: '#0A0E12', cooler: '#2A3E4E', flops: '#3A2A28', rope: '#34322E', hammock: '#4A5056', hammockBack: '#363A40', hammockStripe: '#5A3A36', fig: '#0B1014', hat: '#3A3A38', bird: '#0B1318', crab: '#C8C4BA', grape: '#16221A', grapeDark: '#0E1812', grapeRed: '#2A1A16', seaOats: '#262C2A', trunk: '#1E1C1C', trunkRing: '#141212', frond: '#10181A', frondBack: '#0A1012', rib: '#1E2A2A', dry: '#16120E', coconut: '#141010' },
};
const V = {
  morning: { sunX: 92, sunY: 150, sunR: 10, glowR: 70, stars: 0, glints: .8, beam: 0, schooner: 0, birds: 1, turtle: 1, dolphins: 0, egret: 1, crab: 0, lights: 0, windows: 0, strings: 0, iguana: 1 },
  day: { sunX: 250, sunY: 100, sunR: 9, glowR: 56, stars: 0, glints: .6, beam: 0, schooner: 0, birds: 1, turtle: 1, dolphins: 0, egret: 1, crab: 0, lights: 0, windows: 0, strings: 0, iguana: 1 },
  evening: { sunX: 150, sunY: 188, sunR: 15, glowR: 120, stars: 0, glints: 1, beam: .5, schooner: 1, birds: 0, turtle: .6, dolphins: 1, egret: 1, crab: 0, lights: 1, windows: .7, strings: 1, iguana: 0 },
  night: { sunX: 250, sunY: 64, sunR: 9, glowR: 46, stars: 1, glints: .55, beam: 1, schooner: 0, birds: 0, turtle: 0, dolphins: 0, egret: 0, crab: 1, lights: 1, windows: 1, strings: 1, iguana: 0 },
};
let body = svg.replace('PALM_A', palm({ cls: 'k-crown', base: [266, 344], top: [254, 192], c1: [266, 300], c2: [260, 246], w: 12, s: 1 }))
  .replace('PALM_B', palm({ cls: 'k-crown c2', base: [374, 346], top: [364, 182], c1: [376, 300], c2: [370, 240], w: 13, s: 1.08 }));
const defs = `<defs>
<!--FAUNA-->
${frond('p-frond', 1)}
${frond('p-frond2', 1.6)}
<linearGradient id="k-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{{ c.skyTop }}"></stop><stop offset=".55" stop-color="{{ c.skyMid }}"></stop><stop offset="1" stop-color="{{ c.horizon }}"></stop></linearGradient>
<linearGradient id="k-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{{ c.seaFar }}"></stop><stop offset=".45" stop-color="{{ c.seaMid }}"></stop><stop offset="1" stop-color="{{ c.shallow }}"></stop></linearGradient>
<linearGradient id="k-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{{ c.sandWet }}"></stop><stop offset=".2" stop-color="{{ c.sand }}"></stop><stop offset="1" stop-color="{{ c.sandDeep }}"></stop></linearGradient>
<radialGradient id="k-sunglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{{ c.sun }}" stop-opacity=".75"></stop><stop offset=".35" stop-color="{{ c.sun }}" stop-opacity=".25"></stop><stop offset="1" stop-color="{{ c.sun }}" stop-opacity="0"></stop></radialGradient>
<radialGradient id="k-lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC870" stop-opacity=".45"></stop><stop offset="1" stop-color="#FFB050" stop-opacity="0"></stop></radialGradient>
<linearGradient id="k-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF2C8" stop-opacity=".55"></stop><stop offset="1" stop-color="#FFF2C8" stop-opacity="0"></stop></linearGradient>
<filter id="k-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.5"></feGaussianBlur></filter>
</defs>`;
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Key West scene</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>body{margin:0}</style>
</helmet>
<div style="width: 390px; height: 420px; position: relative; overflow: hidden; background: {{ c.page }}">
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="420" viewBox="0 0 390 420" style="display: block">
${defs}
${body}
</svg>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"sky":{"editor":"enum","options":["morning","day","evening","night"],"default":"day"},"$preview":{"width":390,"height":420}}'>
class Component extends DCLogic {
  renderVals() {
    const sky = this.props.sky || 'day';
    const P = ${JSON.stringify(PAL).replace(/"/g, "'")}[sky];
    const V = ${JSON.stringify(V).replace(/"/g, "'")}[sky];
    return { c: P, v: V };
  }
}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'project', 'KeyWestScene.dc.html'), page);
console.log('KeyWestScene written', page.length);
