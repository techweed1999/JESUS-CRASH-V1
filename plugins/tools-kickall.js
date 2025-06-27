const { cmd } = require('../command');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🛠 Get only plain ID
const getPlainId = (jid) => jid.replace(/@.+/, '');

// ✅ Remove all non-admin members
cmd({
  pattern: "kickalls",
  alias: ["kickall", "endgc", "endgroup"],
  desc: "Remove all non-admin members from the group.",
  react: "🧹",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, {
  from, isGroup, isAdmins, isBotAdmins, groupMetadata, reply, isOwner
}) => {
  try {
    if (!isGroup) return reply("❗ This command only works in groups.");
    if (!isAdmins && !isOwner) return reply("❌ You must be an *admin*.");
    if (!isBotAdmins) return reply("❌ Bot needs to be *admin* to perform this.");

    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    const targets = groupMetadata.participants.filter(p => !admins.includes(p.id));

    if (!targets.length) return reply("✅ No non-admin members to remove.");

    reply(`🗑 Removing ${targets.length} non-admin members...`);

    for (let member of targets) {
      await conn.groupParticipantsUpdate(from, [member.id], "remove").catch(e => {
        console.error(`❌ Can't remove ${member.id}:`, e.message);
      });
      await sleep(2000);
    }

    reply("✅ Finished removing non-admins.");
  } catch (e) {
    console.error(e);
    reply("❌ An error occurred while executing the command.");
  }
});

// ✅ Remove all admins (excluding bot & owner)
cmd({
  pattern: "removeadmins",
  alias: ["kickadmins", "kickall3", "deladmins"],
  desc: "Remove all admins except bot & owner.",
  react: "🚫",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, {
  from, isGroup, isAdmins, isOwner, isBotAdmins, groupMetadata, reply
}) => {
  try {
    if (!isGroup) return reply("❗ Group only command.");
    if (!isAdmins && !isOwner) return reply("❌ You must be an *admin*.");
    if (!isBotAdmins) return reply("❌ Bot needs admin privileges.");

    const botJid = conn.user.id;
    const ownerId = getPlainId(botJid);
    const targets = groupMetadata.participants.filter(p =>
      p.admin &&
      p.id !== botJid &&
      getPlainId(p.id) !== ownerId
    );

    if (!targets.length) return reply("✅ No admins to remove (except bot/owner).");

    reply(`🗑 Removing ${targets.length} admins...`);

    for (let member of targets) {
      await conn.groupParticipantsUpdate(from, [member.id], "remove").catch(e => {
        console.error(`❌ Failed to remove ${member.id}:`, e.message);
      });
      await sleep(2000);
    }

    reply("✅ Admins removed (except bot/owner).");
  } catch (e) {
    console.error(e);
    reply("❌ Failed to remove admins.");
  }
});

// ✅ Remove everyone except bot & owner
cmd({
  pattern: "kickalls2",
  alias: ["kickall2", "endgc2", "endgroup2"],
  desc: "Remove all members except bot & owner.",
  react: "🧨",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, {
  from, isGroup, isAdmins, isOwner, isBotAdmins, groupMetadata, reply
}) => {
  try {
    if (!isGroup) return reply("❗ Group only.");
    if (!isAdmins && !isOwner) return reply("❌ Admins only.");
    if (!isBotAdmins) return reply("❌ Bot must be admin.");

    const botJid = conn.user.id;
    const ownerId = getPlainId(botJid);

    const targets = groupMetadata.participants.filter(p =>
      p.id !== botJid && getPlainId(p.id) !== ownerId
    );

    if (!targets.length) return reply("✅ No members to remove (except bot/owner).");

    reply(`🗑 Removing ${targets.length} members...`);

    for (let member of targets) {
      await conn.groupParticipantsUpdate(from, [member.id], "remove").catch(e => {
        console.error(`❌ Failed to remove ${member.id}:`, e.message);
      });
      await sleep(2000);
    }

    reply("✅ All members removed (except bot/owner).");
  } catch (e) {
    console.error(e);
    reply("❌ Something went wrong during removal.");
  }
});
