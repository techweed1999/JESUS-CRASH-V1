const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Small caps
function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

// Random emoji function
const emojis = ['🌟','🌹','⚡','🌸','✨','🔥','🌀','🩸','😍','🌚','💍','❤️','🍷'];
const randEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

cmd({
  pattern: "menu",
  alias: ["allmenu", "jesus", "🖤"],
  desc: "Show all bot commands",
  category: "menu",
  react: "🖤",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const sender = m.sender || mek?.key?.participant || mek?.key?.remoteJid;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");
    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(1);
    const hostName = os.hostname();
    const totalCommands = commands.length;

    let menu = `
╔═════◇🌐◇═════╗
    🔥 𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏 🔥
╚═════◇🌐◇═════╝
║ 👤 *User*      : @${sender.split("@")[0]}
║ ⏱️ *Uptime*    : ${uptime()}
║ ⚙️ *Mode*      : ${config.MODE}
║ 💠 *Prefix*    : [${config.PREFIX}]
║ 📦 *Plugins*   : ${totalCommands}
║ 🛠️ *RAM*       : ${ramUsage}MB / ${totalRam}MB
║ 🖥️ *Host*      : ${hostName}
║ 👑 *Developer* : DAWENS BOY 🇭🇹
║ 📆 *Date*      : ${date}
╠══════════════════════════════╣
 ✨ *Welcome to JESUS-CRASH-V1*
🧠 Type *.menu* to explore features.
⚔️ No mercy, just power. 🇭🇹
╚══════════════════════════════╝
`;

    // Organize commands by category
    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    // Add commands by category to menu
    const keys = Object.keys(category).sort();
    for (let k of keys) {
      menu += `\n\n❖──⭓ *${k.toUpperCase()} MENU* ⭓──❖`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        menu += `\n${randEmoji()} ➤ ${config.PREFIX}${toSmallCaps(usage)}`;
      });
      menu += `\n🇭🇹──⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓`;
    }

    // Send menu message
    await conn.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/fuoqii.png' },
      caption: menu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.newsletterJid || '120363419768812867@newsletter',
          newsletterName: '𝗝𝗘𝗦𝗨𝗦-𝗖𝗥𝗔𝗦𝗛-𝗩𝟭',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Audio feedback
    await conn.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/8e7mkq.mp4' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
