// index.js oswa handler.js
const AntiSpam = require('./lib/antispam')

// Egzanp itilizasyon pou chak mesaj
conn.ev.on('messages.upsert', async (m) => {
    try {
        const msg = m.messages[0]
        const sender = msg.key.remoteJid

        // Check cooldown (5s)
        if (AntiSpam.isFiltered(sender)) return

        AntiSpam.addFilter(sender) // mete 5s delay

        // Check si sender a deja spam
        if (AntiSpam.isSpam(sender, global.db.data.antispam)) {
            return conn.sendMessage(sender, { text: "🚫 Ou fin fè twòp commands. Tanpri tann kèk minit." })
        }

        // Si pa spam, ajoute li
        AntiSpam.addSpam(sender, global.db.data.antispam)

        // ➕ Repons oswa commands bot lan
        // eg. conn.sendMessage(sender, { text: 'Men meni an' })

    } catch (e) {
        console.log(e)
    }
})
