const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const banFile = path.join(__dirname, '../lib/banlist.json');

cmd({
  pattern: 'unban',
  desc: '🔓 Unban a user by their number.',
  category: 'spam',
  filename: __filename,
}, async (conn, m, { reply, args }) => {
  if (!args[0]) return reply('Please provide a number to unban.');

  let bannedUsers = JSON.parse(fs.readFileSync(banFile));
  const number = args[0].replace(/\D/g, '');

  if (!bannedUsers.includes(number)) return reply('User is not banned.');

  bannedUsers = bannedUsers.filter(u => u !== number);
  fs.writeFileSync(banFile, JSON.stringify(bannedUsers, null, 2));

  reply(`✅ Unbanned user: ${number}`);
});
