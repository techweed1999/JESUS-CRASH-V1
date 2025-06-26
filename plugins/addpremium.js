const { addPremium } = require('../lib/premium');
const config = require('../config');

module.exports = {
  name: 'addpremium',
  description: 'Grant 5-day premium to user',
  async execute(m, conn) {
    const sender = m.sender;
    const ownerList = config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net');
    if (!ownerList.includes(sender)) {
      return conn.sendMessage(m.from, { text: '❌ Only owner can do this.' }, { quoted: m });
    }

    const args = m.body.split(' ').slice(1);
    const number = args[0];

    if (!number || isNaN(number)) {
      return conn.sendMessage(m.from, { text: 'Usage: .addpremium 509XXXXXXXX' }, { quoted: m });
    }

    addPremium(number);
    await conn.sendMessage(m.from, {
      text: `✅ Premium access granted to +${number} for 5 days.`,
    }, { quoted: m });
  }
};
