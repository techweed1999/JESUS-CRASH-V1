const config = require('../config');

module.exports = async function anticallHandler(conn, update) {
  try {
    if (!config.REJECT_CALL || !update || !update.calls) return;

    for (const call of update.calls) {
      const callerId = call.from;
      const isGroupCall = callerId.endsWith('@g.us');

      if (isGroupCall) continue;

      const isOwner = config.OWNER_NUMBER.some(owner => callerId.includes(owner));
      if (isOwner) return;

      // Send polite warning
      await conn.sendMessage(callerId, {
        text: `📵 I am not available right now.\nPlease do not call the bot.\nUse text commands instead.`
      });

      console.log(`[ANTICALL] Replied to ${callerId} (call attempt).`);
    }
  } catch (err) {
    console.error('[ANTICALL ERROR]', err);
  }
};
