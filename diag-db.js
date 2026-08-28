const fs = require('fs');
const path = require('path');
const env = {};
fs.readFileSync(path.join(__dirname, 'cloudpanel-app', '.env'), 'utf8')
  .split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  });
const url = env.SUPABASE_URL;
const key = env.SUPABASE_ANON_KEY;
console.log('URL:', JSON.stringify(url));

(async () => {
  const headers = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
  const ins = await fetch(url + '/rest/v1/orders', {
    method: 'POST',
    headers: Object.assign({}, headers, { Prefer: 'resolution=ignore-duplicates, return=representation' }),
    body: JSON.stringify({
      corvex_order_id: 'diag_final_' + Date.now(),
      event: 'ORDER_CREATED', status: 'created', total_cents: 100, payload: { diag: true }
    })
  });
  const txt = await ins.text();
  console.log('INSERT orders ->', ins.status, '|', txt.slice(0, 300));

  if (ins.ok) {
    const rows = JSON.parse(txt);
    if (rows.length) {
      const it = await fetch(url + '/rest/v1/order_items', {
        method: 'POST',
        headers: Object.assign({}, headers, { Prefer: 'return=minimal' }),
        body: JSON.stringify([{ order_id: rows[0].id, title: 'Item diag', quantity: 1, unit_price_cents: 100 }])
      });
      console.log('INSERT item ->', it.status, '|', (await it.text()).slice(0, 200));
    }
  }
})();
