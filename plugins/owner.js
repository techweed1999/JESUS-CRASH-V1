const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅", 
    desc: "Get owner number",
    category: "owner",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER; // e.g. +13058962443
        const ownerName = config.OWNER_NAME || 'Unknown';

        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` + 
                      'END:VCARD';

        // Voye vCard la
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        // Voye imaj ak caption
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/fuoqii.png' }, // Imaj owner
            caption: `╭━━━〔 👑 *OWNER INFORMATION* 〕━━━╮
┃
┃ 👤 *Name*   : ${ownerName}
┃ 📞 *Number* : ${ownerNumber}
┃ 🧩 *Bot Ver*: 1.0.0 Beta
┃ ⚙️ *Powered By*: DAWENS BOY
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯
📌 *JESUS-CRASH-V1* | *Official Bot*
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ DAWENS BOY*`,
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: 'JESUS-CRASH-V1',
                    serverMessageId: 143
                }            
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ Erè: ${error.message}`);
    }
});
