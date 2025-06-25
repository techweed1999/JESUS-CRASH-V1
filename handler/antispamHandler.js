const { checkSpam, isBlocked } = require('../lib/antiSpam');

module.exports = (bot) => {
  bot.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];
    if (!message?.message) return;

    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? message.key.participant : from;

    if (!isGroup) {
      const body = (
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        message.message.videoMessage?.caption ||
        ''
      ).trim();

      const spamKeywords = ['.menu', 'bro', '.bug', '.spam', '.yo'];
      const matchedSpam = spamKeywords.some(cmd => body.toLowerCase().startsWith(cmd));

      if (isBlocked(sender)) {
        return await bot.sendMessage(from, {
          text: '🚫 Ou te bloke pou spam. Kontakte admin si se erè.'
        });
      }

      if (checkSpam(sender) || matchedSpam) {
        return await bot.sendMessage(from, {
          text: '🚫 Anti-spam détecté. Ou bloke pou twòp mesaj oswa spam.'
        });
      }
    }

    // Ou ka ajoute lòt trete mesaj isit la si ou vle
  });
};
