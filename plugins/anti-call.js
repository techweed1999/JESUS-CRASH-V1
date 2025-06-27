const config = require('../config');

const anticallcommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, ...config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net')].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const args = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== 'anticall') return;

    if (!isCreator) {
      return m.reply("🚫 *Only the bot owner can use this command.*");
    }

    let response;

    if (args === 'on') {
      config.REJECT_CALL = true;
      response = "✅ *Anti-Call has been enabled.*\n📞 Incoming calls will be automatically rejected.";
    } else if (args === 'off') {
      config.REJECT_CALL = false;
      response = "❌ *Anti-Call has been disabled.*\n☎️ Bot will no longer auto-reject calls.";
    } else {
      response = `📛 *Invalid usage!*\n\n🛠️ Example:\n• \`${prefix}anticall on\` — Enable auto reject\n• \`${prefix}anticall off\` — Disable auto reject`;
    }

    await Matrix.sendMessage(m.from, { text: response }, { quoted: m });

  } catch (error) {
    console.error("❌ AntiCall Command Error:", error);
    await Matrix.sendMessage(m.from, { text: "⚠️ *An error occurred while processing your request.*" }, { quoted: m });
  }
};

module.exports = anticallcommand;
