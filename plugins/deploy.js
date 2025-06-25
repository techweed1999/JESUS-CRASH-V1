const { cmd } = require('../command');
const fs = require('fs');
const { File } = require('megajs');
const { default: makeWASocket } = require('baileys');

// Global memory to store active jadibot sessions
global.jadibotSessions = global.jadibotSessions || {};

cmd({
  pattern: 'deploy',
  desc: '🚀 Deploy your own WhatsApp session using a MEGA session backup.',
  category: 'tools',
  react: '🔌',
  filename: __filename
}, async (conn, m, { text }) => {
  if (!text) return m.reply(`❌ *Please provide a MEGA Session ID*\n\nExample:\n.deploy JESUS~CRASH~V1~<file_id>#<file_key>`);

  const match = text.trim().match(/^JESUS~CRASH~V1~([a-zA-Z0-9\-_]+)#([a-zA-Z0-9\-_]+)$/);
  if (!match) return m.reply(`❌ *Invalid format!*\nUse:\n.deploy JESUS~CRASH~V1~<file_id>#<file_key>`);

  const [_, fileId, fileKey] = match;

  if (global.jadibotSessions[fileId])
    return m.reply('⚠️ *This session is already connected.*');

  if (Object.keys(global.jadibotSessions).length >= 5)
    return m.reply('⚠️ *Maximum Jadibot sessions reached (limit = 5).*');

  try {
    m.reply(`📥 *Downloading your session...*\n\n🆔 ID: ${fileId}`);

    const sessionFile = File.fromURL(`https://mega.nz/#!${fileId}!${fileKey}`);
    const stream = await sessionFile.download();
    const data = [];

    for await (const chunk of stream) data.push(chunk);

    const sessionBuffer = Buffer.concat(data);
    const sessionJson = JSON.parse(sessionBuffer.toString());

    // Start WhatsApp socket
    const sock = makeWASocket({
      auth: {
        creds: sessionJson.creds,
        keys: sessionJson.keys || {}
      },
      printQRInTerminal: false,
      browser: ['JesusCrashDeploy', 'Chrome', '121.0.0.1']
    });

    global.jadibotSessions[fileId] = sock;

    m.reply('⏳ *Connecting your session... Please wait.*');

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (connection === 'open') {
        m.reply(`✅ *Jadibot session \`${fileId}\` is now connected!*`);
        console.log(`[CONNECTED] Session ${fileId}`);
      }

      if (connection === 'close') {
        delete global.jadibotSessions[fileId];
        const reason = lastDisconnect?.error?.output?.statusCode || 'Unknown';
        console.log(`[DISCONNECTED] Session ${fileId} | Reason: ${reason}`);
      }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg?.message) return;

      const from = msg.key.remoteJid;
      const textMsg = msg.message.conversation || msg.message.extendedTextMessage?.text;

      if (textMsg?.toLowerCase() === 'ping') {
        await sock.sendMessage(from, { text: 'pong 🏓' }, { quoted: msg });
      }
    });

  } catch (err) {
    console.error('Error while deploying:', err);
    m.reply(`❌ *Error while deploying session:*\n\n${err.message}`);
  }
});
