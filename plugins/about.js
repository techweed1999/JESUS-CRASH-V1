const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "about",
  alias: ["dev"],
  react: "👑",
  desc: "Get developer and bot information",
  category: "main",
  filename: __filename
}, async (conn, mek, m, {
  from, pushname, reply
}) => {
  try {
    const caption = `
*╭┈───────────────•*
*ʜᴇʟʟᴏ 👋 ${pushname || 'User'}*
*╰┈───────────────•*

*╭┈───⪩ 👑 OWNER INFO*
*│  ◦  ᴄʀᴇᴀᴛᴏʀ:* Dawens Boy
*│  ◦  ʀᴇᴀʟ ɴᴀᴍᴇ:* Kibutsuji Muzan
*│  ◦  ɴɪᴄᴋɴᴀᴍᴇ:* dawens
*│  ◦  ᴀɢᴇ:* ɴᴏᴛ ᴅᴇғɪɴᴇᴅ
*│  ◦  ᴄɪᴛʏ:* ɴᴏᴛ ᴅᴇғɪɴᴇᴅ
*│  ◦  ᴘᴀꜱꜱɪᴏɴ:* WhatsApp Dev
*╰┈────────────────•*

*⪨ • JESUS-CRASH-V1 - PROJECT • ⪩*

*╭┈───⪩ 👨‍💻 DEVELOPERS*
*│  ◦  ✰ Dawens Boy*
*│  ◦  ✰ Inconnu Boy*
*│  ◦  ✰ Only 2 Devs*
*╰┈────────────────•*

*•────────────•✱*
> *© Powered by DAWENS BOY*
*•────────────•✱*
`.trim();

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/fuoqii.png' },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419768812867@newsletter',
          newsletterName: 'JESUS-CRASH-V1',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("❌ Error in .about command:", e);
    return reply(`❌ Error: ${e.message || e}`);
  }
});
