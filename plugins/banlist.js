const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const banFile = path.join(__dirname, '../lib/banlist.json');

cmd({
  pattern: 'banlist',
  desc: '📜 View list of banned users.',
  category: 'spam',
  filename: __filename,
}, async (conn, m, { reply }) => {
  const bannedUsers = JSON.parse(fs.readFileSync(banFile));
  if (!bannedUsers.length) return reply('✅ No users are currently banned.');

  const list = bannedUsers.map((jid, i) => `${i + 1}. wa.me/${jid.split('@')[0]}`).join('\n');
  reply(`📛 *Banned Users:*\n\n${list}`);
});
