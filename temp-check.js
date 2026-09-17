const http = require('http');
http.get({ host: '127.0.0.1', port: 3999, path: '/assets/banners/slide-m1.webp' }, r => {
  console.log('status', r.statusCode);
  console.log('cache-control:', r.headers['cache-control']);
  console.log('content-length:', r.headers['content-length']);
  r.resume();
  r.on('end', () => process.exit(0));
});
