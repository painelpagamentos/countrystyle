const https = require('https');
const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');

const BASE = 'https://acdn-us.mitiendanube.com/stores/002/071/006/themes/flex/';
const OUT = path.join(__dirname, 'cloudpanel-app', 'public', 'assets', 'banners');
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  // desktop slides (1920 wide) -> 1600px q58
  { url: BASE + '2-slide-1786569495061-3598503709-db63334818004b42c9478f28068185881786569496-1920-1920.webp', out: 'slide-d1.webp', w: 1600, q: 58 },
  { url: BASE + '1-slide-1785532719959-7999060274-08809a70482235c116245c19baeb78211785532724-1920-1920.webp', out: 'slide-d2.webp', w: 1600, q: 58 },
  { url: BASE + '1-slide-1785532719957-7650111922-5afa45f53b43635c4f8dcc4e6d9542041785532721-1920-1920.webp', out: 'slide-d3.webp', w: 1600, q: 58 },
  { url: BASE + '1-slide-1785532719958-4620468828-3a53143c9a20d68eccae7a21bf967b051785532722-1920-1920.webp', out: 'slide-d4.webp', w: 1600, q: 58 },
  { url: BASE + '1-slide-1785532719959-2845137803-66eee5d17deaaa0c9e923272472517c51785532723-1920-1920.webp', out: 'slide-d5.webp', w: 1600, q: 58 },
  { url: BASE + '1-slide-1785532719958-7118927512-9a4f182997313dea30ccc9389f5efc181785532723-1920-1920.webp', out: 'slide-d6.webp', w: 1600, q: 58 },
  // mobile slides (1024 wide) -> 828px q62
  { url: BASE + '2-slide-1786569495068-5678524532-0cf48c2d617ddc25e49fb0be73ca92c51786569497-1024-1024.webp', out: 'slide-m1.webp', w: 828, q: 62 },
  { url: BASE + '1-slide-1785533441830-4560387409-2fe832f10de3d2c170ac3d2346adba181785533443-1024-1024.webp', out: 'slide-m2.webp', w: 828, q: 62 },
  { url: BASE + '1-slide-1785533441830-6915209858-5e293d5c034a5a86a1c639ef1de8595e1785533443-1024-1024.webp', out: 'slide-m3.webp', w: 828, q: 62 },
  { url: BASE + '1-slide-1785533441830-778274698-d91387129bf36bf408763b5edb20c1601785533444-1024-1024.webp', out: 'slide-m4.webp', w: 828, q: 62 },
  { url: BASE + '1-slide-1785533441831-624373058-885e660fc42dcfa4db50829962a311bb1785533444-1024-1024.webp', out: 'slide-m5.webp', w: 828, q: 62 },
  { url: BASE + '1-slide-1785533441831-5199785013-72fb0e3771508cfdf58ce638c25844ca1785533444-1024-1024.webp', out: 'slide-m6.webp', w: 828, q: 62 },
  // big banners (shown ~1140px desktop / full width mobile)
  { url: BASE + '2-img-1973761847-1764969717-28969986e9b5294b8573a1d7cd25b4531764969717-1920-1920.webp', out: 'banner-ofertas-m.webp', w: 828, q: 60 },
  { url: BASE + '2-img-711308212-1764969717-75f8a7705a22c6ab2d571b53177abdeb1764969717-1920-1920.webp', out: 'banner-ofertas-d.webp', w: 1200, q: 58 },
  { url: BASE + '2-img-1372805007-1730388013-251ca4be61967bfa0857e4dba79cde331730388013-1920-1920.webp', out: 'banner-texteam-m.webp', w: 828, q: 60 },
  { url: BASE + '2-img-1894544859-1730388012-69d62dec79b6030a19eb978ba90138081730388012-1920-1920.webp', out: 'banner-texteam-d.webp', w: 1200, q: 58 },
  { url: BASE + '2-slide-1762881669759-3637725911-3ad4c106055a5e0e42c139356f3a8c541762881665-640-0.webp', out: 'banner-kits-f.webp', w: 640, q: 65 },
  { url: BASE + '2-slide-1762881669759-5015826379-02f60b2f55a2a056b55c9b106e0b3a461762881665-640-0.webp', out: 'banner-kits-m.webp', w: 640, q: 65 }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, r => {
      if (r.statusCode !== 200) return reject(new Error('HTTP ' + r.statusCode + ' ' + url));
      const ws = fs.createWriteStream(dest);
      r.pipe(ws);
      ws.on('finish', () => ws.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
  for (const j of jobs) {
    const tmp = path.join(OUT, 'tmp_' + j.out);
    const dst = path.join(OUT, j.out);
    try {
      await download(j.url, tmp);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', 'scale=' + j.w + ':-2:flags=lanczos', '-c:v', 'libwebp', '-quality', String(j.q), '-preset', 'photo', dst], { stdio: 'inherit' });
      fs.unlinkSync(tmp);
      console.log(j.out, (fs.statSync(dst).size / 1024).toFixed(0) + ' KB');
    } catch (e) {
      console.error('ERRO', j.out, e.message);
    }
  }
  console.log('CONCLUIDO');
})();
