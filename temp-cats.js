const https = require('https');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT = path.join(__dirname, 'cloudpanel-app', 'public', 'assets', 'banners');
const html = fs.readFileSync(path.join(__dirname, 'cloudpanel-app', 'views', 'pages', 'home.ejs'), 'utf8');
const urls = [...html.matchAll(/(https:[^'"]*480-0\.webp[^'"]*)/g)].map(m => m[1]);
console.log('encontradas', urls.length, 'imagens de categoria');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, r => {
      if (r.statusCode !== 200) return reject(new Error('HTTP ' + r.statusCode));
      const ws = fs.createWriteStream(dest);
      r.pipe(ws);
      ws.on('finish', () => ws.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
  let n = 1;
  for (const u of urls) {
    const tmp = path.join(OUT, 'tmp_cat.webp');
    const dst = path.join(OUT, 'cat' + n + '.webp');
    await download(u, tmp);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', 'scale=320:-2:flags=lanczos', '-c:v', 'libwebp', '-quality', '65', '-preset', 'photo', dst]);
    fs.unlinkSync(tmp);
    console.log('cat' + n + '.webp', (fs.statSync(dst).size / 1024).toFixed(0) + ' KB');
    n++;
  }
  console.log('CONCLUIDO');
})();
