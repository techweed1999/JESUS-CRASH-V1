const { cmd } = require('../command');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

cmd({
  pattern: 'pretem',
  desc: 'Re-envoye sticker oswa medya ak author Dawens',
  category: 'spam',
  react: '🎭',
  filename: __filename
}, async (client, message) => {
  try {
    const quoted = message.quoted;
    const remoteJid = message.key.remoteJid;

    if (!quoted) {
      return await client.sendMessage(remoteJid, {
        text: '_❗Tanpri reply sou yon imaj, videyo, oswa sticker._'
      }, { quoted: message });
    }

    const mime = quoted.mimetype || '';
    if (!/image|video|sticker/.test(mime)) {
      return await client.sendMessage(remoteJid, {
        text: '_❗Sa ou reply a pa yon medya ki valab._'
      }, { quoted: message });
    }

    const mediaBuffer = await downloadMediaMessage(quoted, 'buffer', {}, {});

    await client.sendMessage(remoteJid, {
      sticker: mediaBuffer,
      packname: '𓄂⍣⃝𝐆𝚯𝐃𝄟✮͢≛𝐃𝐀𝐖𝐄𝐍𝐒𝄟✮⃝🧭𓄂𝟙𝟠𝟘𝟞',
      author: 'DAWENS'
    }, { quoted: message });

  } catch (err) {
    await client.sendMessage(message.key.remoteJid, {
      text: `_❌ Erè: ${err.message}_`
    }, { quoted: message });
  }
});
