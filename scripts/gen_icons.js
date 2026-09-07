const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const S = 4, W = 64, H = 64, N = W * S;
const out = path.join(__dirname, '..', 'assets', 'icons');
fs.mkdirSync(out, { recursive: true });

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type), b = Buffer.concat([t, data]), o = Buffer.alloc(12 + data.length);
  o.writeUInt32BE(data.length, 0); t.copy(o, 4); data.copy(o, 8); o.writeUInt32BE(crc32(b), 8 + data.length);
  return o;
}
function png(name, pixels, rgb) {
  const raw = Buffer.alloc((W * 4 + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (W * 4 + 1)] = 0;
    for (let x = 0; x < W; x++) {
      let a = 0;
      for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) a += pixels[((y*S+yy)*N + x*S+xx)];
      const i = y * (W * 4 + 1) + 1 + x * 4;
      raw[i] = rgb[0]; raw[i+1] = rgb[1]; raw[i+2] = rgb[2]; raw[i+3] = Math.round(a / (S*S));
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4); ihdr[8]=8; ihdr[9]=6;
  fs.writeFileSync(path.join(out, name+'.png'), Buffer.concat([Buffer.from('\x89PNG\r\n\x1a\n','binary'), chunk('IHDR',ihdr), chunk('IDAT',zlib.deflateSync(raw)), chunk('IEND',Buffer.alloc(0))]));
}
function make(name, draw) {
  const p = new Uint8Array(N*N);
  const dot=(x,y,r=1.25)=>{x*=S;y*=S;r*=S;for(let yy=Math.floor(y-r);yy<=Math.ceil(y+r);yy++)for(let xx=Math.floor(x-r);xx<=Math.ceil(x+r);xx++)if(xx>=0&&yy>=0&&xx<N&&yy<N&&(xx-x)**2+(yy-y)**2<=r*r)p[yy*N+xx]=255};
  const line=(x1,y1,x2,y2,w=1.7)=>{const d=Math.hypot(x2-x1,y2-y1), n=Math.ceil(d*S*1.5);for(let i=0;i<=n;i++)dot(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n,w/2)};
  const circle=(cx,cy,r,w=1.7)=>{const n=Math.ceil(2*Math.PI*r*S);for(let i=0;i<n;i++){let a=i/n*Math.PI*2;dot(cx+Math.cos(a)*r,cy+Math.sin(a)*r,w/2)}};
  const rect=(x,y,w,h,r=0)=>{ if(!r){line(x,y,x+w,y);line(x+w,y,x+w,y+h);line(x+w,y+h,x,y+h);line(x,y+h,x,y);return;} line(x+r,y,x+w-r,y);line(x+w,y+r,x+w,y+h-r);line(x+w-r,y+h,x+r,y+h);line(x,y+h-r,x,y+r);circle(x+r,y+r,r);circle(x+w-r,y+r,r);circle(x+w-r,y+h-r,r);circle(x+r,y+h-r,r)};
  draw({line,circle,rect,dot});
  png(name,p,[255,255,255]);
  png(name+'-dark',p,[20,20,20]);
}

const arrowR=({line})=>{line(15,32,49,32);line(39,22,49,32);line(39,42,49,32)};
make('menu',({line})=>{line(14,20,50,20);line(14,32,50,32);line(14,44,50,44)});
make('search',({line,circle})=>{circle(28,28,14);line(38,38,50,50)});
make('cart',({line})=>{line(14,21,50,21);line(50,21,47,49);line(47,49,17,49);line(17,49,14,21);line(23,28,23,17);line(23,17,28,12);line(28,12,36,12);line(36,12,41,17);line(41,17,41,28)});
make('arrow-right',arrowR);
make('arrow-left',({line})=>{line(49,32,15,32);line(25,22,15,32);line(25,42,15,32)});
make('arrow-down',({line})=>{line(32,13,32,49);line(22,39,32,49);line(42,39,32,49)});
make('plus',({line,circle})=>{circle(32,32,20);line(22,32,42,32);line(32,22,32,42)});
make('minus',({line,circle})=>{circle(32,32,20);line(22,32,42,32)});
make('delivery',({line,circle,rect})=>{rect(7,18,31,25);line(38,26,48,26);line(48,26,57,36);line(57,36,57,43);line(38,43,57,43);circle(18,47,4);circle(48,47,4)});
make('returns',({line})=>{line(11,28,11,16);line(11,16,23,16);line(11,16,17,22);line(11,16,17,10);line(12,17,18,11);line(18,11,28,8);line(28,8,40,10);line(40,10,49,18);line(53,36,53,48);line(53,48,41,48);line(53,48,47,42);line(53,48,47,54);line(52,47,46,53);line(46,53,36,56);line(36,56,24,54);line(24,54,15,46)});
make('payment-card',({line,rect})=>{rect(6,16,52,34);line(6,27,58,27);line(13,39,30,39)});
make('headset',({line})=>{for(let i=0;i<30;i++){let a=Math.PI+Math.PI*i/29;line(32+Math.cos(a)*20,34+Math.sin(a)*20,32+Math.cos(a+0.01)*20,34+Math.sin(a+0.01)*20)}line(12,34,12,48);line(12,48,20,48);line(20,48,20,34);line(52,34,52,48);line(52,48,44,48);line(44,48,44,34);line(52,48,48,55);line(48,55,38,55)});
make('instagram',({circle,rect,dot})=>{rect(9,9,46,46,10);circle(32,32,11);dot(46,18,2.5)});
make('pinterest',({line,circle})=>{circle(32,32,23);circle(34,28,11);line(31,23,25,48);line(28,37,35,41)});
make('tiktok',({line,circle})=>{circle(32,32,23);line(35,17,35,40,2.5);line(35,17,43,24,2.5);circle(28,41,7,2.5)});
make('close',({line})=>{line(17,17,47,47);line(47,17,17,47)});

console.log(`Generated 32 PNG icons (light and dark variants) in ${out}`);
