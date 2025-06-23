const fs = require('fs');
const path = './data/spam.json';

// Kreye folder & fichye otomatik si pa egziste
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

// Chaje done spam yo
let spamData = JSON.parse(fs.readFileSync(path));

// Sove done nan spam.json
function saveSpamData() {
  fs.writeFileSync(path, JSON.stringify(spamData, null, 2));
}

// ✅ Fonksyon pou verifye si se spam
function checkSpam(sender) {
  if (!spamData[sender]) spamData[sender] = { count: 0, blocked: false };

  spamData[sender].count += 1;

  if (spamData[sender].count >= 7) {
    spamData[sender].blocked = true;
    saveSpamData();
    return true;
  }

  saveSpamData();
  return false;
}

// ✅ Reset yon moun si admin debloque l
function resetSpam(sender) {
  if (spamData[sender]) {
    spamData[sender].count = 0;
    spamData[sender].blocked = false;
    saveSpamData();
  }
}

// ✅ Verifye si yon moun bloke
function isBlocked(sender) {
  return spamData[sender]?.blocked;
}

module.exports = { checkSpam, isBlocked, resetSpam };
