const fs = require('fs');
const bannedUsers = JSON.parse(fs.readFileSync('./lib/banlist.json'));

if (bannedUsers.includes(m.sender)) {
  return conn.sendMessage(m.from, {
    text: "🚫 You're banned from using this bot.",
    mentions: [m.sender]
  }, { quoted: m });
}
