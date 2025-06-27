const { cmd } = require('../command');

cmd({
    pattern: "soti",
    desc: "Retire yon moun nan gwoup lan (pa bot la, men pa admin 50942241547)",
    category: "spam",
    filename: __filename
}, async (conn, mek, m, { isGroup, participants, sender, args, reply }) => {
    try {
        if (!isGroup) return reply("📍 Sèlman disponib nan group!");
        
        const groupAdmins = participants.filter(p => p.admin).map(p => p.id);
        const senderNumber = sender.split("@")[0];

        // Verifye si se 50942241547 kap voye cmd la
        if (senderNumber !== "50942241547") return reply("⛔ Ou pa gen dwa itilize kòmand sa!");

        // Verifye si sender la se admin
        if (!groupAdmins.includes(sender)) return reply("❌ Ou pa admin nan gwoup la!");

        // Verifye si gen moun yo reponn oubyen mete nan args
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (args[0]) {
            const num = args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net";
            target = num;
        } else {
            return reply("❗ Tanpri reponn a yon mesaj oswa mete nimewo moun lan.");
        }

        // Evite kick tèt ou
        if (target === sender) return reply("❌ Ou pa ka retire tèt ou!");

        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
        reply("✅ Moun lan soti avèk siksè!");

    } catch (e) {
        console.error(e);
        reply("⚠️ Erè pandan operasyon an.");
    }
});
