const { cmd } = require('../command');

cmd({
  pattern: 'device',
  desc: 'Detekte ki aparèy moun lan ap itilize',
  category: 'spam',
  react: '📲',
  filename: __filename
}, async (client, message) => {
  try {
    // Detekte aparèy moun lan
    const msgId = message.key.id;
    let deviceType = 'Unknown';

    if (msgId?.startsWith('3EB0')) {
      deviceType = 'Android';
    } else if (msgId?.startsWith('3EB1')) {
      deviceType = 'iPhone';
    } else if (msgId?.includes(':')) {
      deviceType = 'WhatsApp Web';
    }

    await client.sendMessage(message.key.remoteJid, {
      text: `_📲 Moun sa a ap itilize: ${deviceType}_`
    }, { quoted: message });

  } catch (err) {
    await client.sendMessage(message.key.remoteJid, {
      text: `_❌ Erè: ${err.message}_`
    }, { quoted: message });
  }
});
