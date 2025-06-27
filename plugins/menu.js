const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Small caps function
function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

// Delay function
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

cmd({
  pattern: "menu",
  alias: ["🖤", "jesus", "allmenu"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "🖤",
  filename: __filename
},
async (jesus, mek, m, { from, reply }) => {
  try {
    const sender = (m && m.sender) ? m.sender : (mek?.key?.participant || mek?.key?.remoteJid || 'unknown@s.whatsapp.net');
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let jesusMenu = `
╔═════◇🌐◇═════╗
    🔥 𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏 🔥
╚═════◇🌐◇═════╝
║ 📛 *User*      : @${m.sender.split("@")[0]}          
║ ⏱️ *Uptime*    : ${uptime()}                        
║ ⚙️ *Mode*      : ${config.MODE}                   
║ 💠 *Prefix*    : [${config.PREFIX}]                
║ 📦 *Plugins*   : ${totalCommands}                 
║ 👑 *Developer* : 𝐃𝐀𝐖𝐄𝐍𝐒 𝐁𝐎𝐘 🇭🇹✨             
║ 🛠️ *Version*   : 1.0.0 🩸                         
║ 📆 *Date*      : ${date}                           
╠══════════════════════════════╣
║ ✨ *Welcome to* 𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏             
║ 🧠 Type *.menu* to explore features               
║ 🇭🇹 No mercy, just ⚔️ power.                       
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
      jesusMenu += `\n\n❖──⭓ *${k.toUpperCase()} MENU* ⭓──❖`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        jesusMenu += `\n🌹 ➤ ${config.PREFIX}${toSmallCaps(usage)}`;
      });
      jesusMenu += `\n🇭🇹──⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓⭓`;
    }

    // Send menu message without buttons
    await jesus.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/fuoqii.png' },
      caption: jesusMenu,
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

    // Optional: send audio message as PTT
    await jesus.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/8e7mkq.mp4' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
