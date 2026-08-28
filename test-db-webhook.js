const crypto = require('crypto');

const secret = '524db49170ed5c3466846f35d635ad3067212a6665b397aa7d3312b336da1576';
const payload = {
  event: 'ORDER_PAID',
  id: 'ord_teste_db_' + Date.now(),
  status: 'paid',
  method: 'pix',
  amount: 17997,
  paidAt: new Date().toISOString(),
  client: { name: 'Cliente Teste DB', email: 'teste-db@exemplo.com', phone: '11999990000', doc: '00000000000' },
  items: [
    { name: 'Conjunto Samira', quantity: 2, price: 5999, externalRef: '46970824687814' },
    { name: 'Vestido Helena', quantity: 1, price: 5999, externalRef: '12345' }
  ],
  url_checkout: 'https://pagamento.yunabella.com/pay/teste'
};

const body = JSON.stringify(payload);
const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');

async function post() {
  const res = await fetch('http://localhost:3000/webhooks/corvex', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
    body
  });
  return res.status + ' ' + JSON.stringify(await res.json());
}

(async () => {
  console.log('1o envio:', await post());
  console.log('2o envio (duplicata):', await post());
  const bad = await fetch('http://localhost:3000/webhooks/corvex', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': 'assinaturaerrada' },
    body
  });
  console.log('assinatura invalida:', bad.status);
})();
