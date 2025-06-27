const thanksCommand = async (m, Matrix) => {
  const prefix = "."; // Si gen yon lòt prefix, chanje li isit la
  const body = m.body || "";
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  const validCommands = ["thanks", "thanksto", "dev"];
  if (!validCommands.includes(cmd)) return;

  try {
    await m.React("👤");

    const message = `
╭─❏ *DEVELOPER:*
│👨‍💻 DEV : *©DAWENS BOY*
│👨‍💻 NUM : +50942241547
│───────────────────
│🛠️ *BOT:* JESUS-CRASH-V1*
│───────────────────
│🙋‍♂️ HELLO @${m.sender.split("@")[0]}
╰──────────────────❏
`;

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: "https://files.catbox.moe/fuoqii.png" },
        caption: message,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363419768812867@newsletter",
            newsletterName: "JESUS-CRASH-V1",
            serverMessageId: 143,
          },
        },
      },
      { quoted: m }
    );

    await m.React("✅");
  } catch (err) {
    console.error("Thanks Command Error:", err);
    await Matrix.sendMessage(m.from, { text: `❌ Error: ${err.message}` }, { quoted: m });
    await m.React("❌");
  }
};

export default thanksCommand;
