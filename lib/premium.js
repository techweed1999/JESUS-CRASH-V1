const fs = require('fs');
const path = require('path');
const premiumPath = path.join(__dirname, '../DAWENS-BOY96/premium.json');

function loadPremium() {
  if (!fs.existsSync(premiumPath)) return [];
  return JSON.parse(fs.readFileSync(premiumPath));
}

function savePremium(data) {
  fs.writeFileSync(premiumPath, JSON.stringify(data, null, 2));
}

function isPremium(number) {
  const list = loadPremium();
  const now = Date.now();
  const entry = list.find(u => u.number === number);
  if (!entry) return false;
  return now < entry.expires;
}

function addPremium(number, days = 5) {
  const list = loadPremium();
  const now = Date.now();
  const expires = now + days * 24 * 60 * 60 * 1000;

  const existing = list.find(u => u.number === number);
  if (existing) {
    existing.expires = expires;
  } else {
    list.push({ number, expires });
  }

  savePremium(list);
}

module.exports = {
  isPremium,
  addPremium
};
