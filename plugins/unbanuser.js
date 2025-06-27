// Similar to banuser.js
cmd({
  pattern: 'unbanuser',
  desc: '🔓 Unban a user.',
  category: 'spam',
  use: '<@tag | number>',
  filename: __filename,
}, async (conn, m, { args, reply }) => {
  const sender = m.sender;
  const isCreator = [...config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net'), conn.decodeJid(conn.user.id)].includes(sender);
  if (!isCreator) return reply('🚫 Only the bot owner can use this.');

  const target = m.mentionedJid && m.mentionedJid[0]
    || (args[0] && args[0].replace(/\D/g, '') + '@s.whatsapp.net');

  if (!target || !bannedUsers.includes(target)) {
    return reply('❌ User is not banned.');
  }

  bannedUsers = bannedUsers.filter(u => u !== target);
  saveBanlist();
  return reply(`🔓 User ${target} has been *unbanned*.`);
});
