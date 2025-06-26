const config = require('../config');

// Main command function
const anticallcommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, ...config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net')].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'anticall') {
    if (!isCreator) return m.reply("*Only bot owner can use this command.*");

    let responseMessage;

    if (text === 'on') {
      config.REJECT_CALL = true;
      responseMessage = "✅ Anti-Call has been *enabled*.";
    } else if (text === 'off') {
      config.REJECT_CALL = false;
      responseMessage = "❌ Anti-Call has been *disabled*.";
    } else {
      responseMessage = "Usage:\n\n- `anticall on` — Enable\n- `anticall off` — Disable";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error sending anti-call response:", error);
      await Matrix.sendMessage(m.from, { text: '❌ Failed to process your request.' }, { quoted: m });
    }
  }
};

module.exports = anticallcommand;
