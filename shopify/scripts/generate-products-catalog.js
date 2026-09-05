#!/usr/bin/env node
/**
 * Gera shopify/assets/products-catalog.json a partir de shopify/produtos.csv
 * Uso: node scripts/generate-products-catalog.js
 */
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'produtos.csv');
const outPath = path.join(__dirname, '..', 'assets', 'products-catalog.json');

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/);
const header = parseCsvLine(lines[0]);

const idx = {
  handle: header.indexOf('Handle'),
  title: header.indexOf('Title'),
  price: header.indexOf('Variant Price'),
  compare: header.indexOf('Variant Compare At Price'),
  image: header.indexOf('Image Src')
};

const products = [];
const seen = new Set();

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  const row = parseCsvLine(lines[i]);
  const handle = row[idx.handle];
  const title = row[idx.title];

  if (!handle || !title || seen.has(handle)) continue;

  seen.add(handle);
  products.push({
    handle,
    title,
    price: parseFloat(row[idx.price]) || 0,
    compare_at_price: parseFloat(row[idx.compare]) || 0,
    image: row[idx.image] || '',
    url: '/products/' + handle
  });
}

fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
console.log('Gerado ' + products.length + ' produtos em ' + outPath);
