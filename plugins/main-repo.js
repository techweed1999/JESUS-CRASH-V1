 const axios = require('axios');
const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Obtenir les infos du dépôt GitHub",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/DAWENS-BOY96/JESUS-CRASH-V1';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);

        if (!response.ok) throw new Error(`Erreur API GitHub : ${response.status}`);
        const repoData = await response.json();

        const author = repoData.owner.login;
        const repoInfo = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            url: repoData.html_url
        };
        const createdDate = new Date(repoData.created_at).toLocaleDateString();
        const lastUpdateDate = new Date(repoData.updated_at).toLocaleDateString();
        const botname = "JESUS-CRASH-V1";

        const styleCustom = `*ʜᴇʟʟᴏ ,,,👋 ᴛʜɪs ɪs ${botname}*
ᴛʜᴇ ʙᴇsᴛ ʙᴏᴛ ɪɴ ᴛʜᴇ ᴜɴɪᴠᴇʀsᴇ ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ Dawens ᴛᴇᴄʜ. ғᴏʀᴋ ᴀɴᴅ ɢɪᴠᴇ ᴀ sᴛᴀʀ 🌟 ᴛᴏ ᴍʏ ʀᴇᴘᴏ
╭───────────────────
│✞ *sᴛᴀʀs:* ${repoInfo.stars}
│✞ *ғᴏʀᴋs:* ${repoInfo.forks}
│✞ *ʀᴇʟᴇᴀsᴇ Date:* ${createdDate}
│✞ *ʟᴀsᴛ Update:* ${lastUpdateDate}
│✞ *ᴏᴡɴᴇʀ:* ${author}
│✞ *ʀᴇᴘᴏsɪᴛᴏʀʏ:* ${repoInfo.url}
│✞ *sᴇssɪᴏɴ:* https://jesus-crash-v1-session-id2.onrender.com 
╰───────────────────`;

        // Télécharger l'image
        const thumbnailBuffer = await axios.get('https://files.catbox.moe/l0xrah.png', { responseType: 'arraybuffer' }).then(res => res.data);

        // Envoyer le message avec image
        await conn.sendMessage(from, {
            image: thumbnailBuffer,
            caption: styleCustom,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: '𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Erreur commande repo:", error);
        reply(`❌ Erreur : ${error.message}`);
    }
});
