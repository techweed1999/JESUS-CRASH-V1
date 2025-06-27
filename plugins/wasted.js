const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'wasted',
  alias: ['wastedgta'],
  desc: "Add GTA Wasted effect to user's profile picture or replied image",
  category: 'fun',
  filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
  try {
    let imageBuffer;

    if (m.quoted && m.quoted.message.imageMessage) {
      imageBuffer = await conn.downloadMediaMessage(m.quoted);
    } else {
      try {
        const pfpUrl = await conn.profilePictureUrl(m.sender, 'image');
        const response = await axios.get(pfpUrl, { responseType: 'arraybuffer' });
        imageBuffer = Buffer.from(response.data, 'binary');
      } catch {
        return reply('Could not get profile picture and no image replied.');
      }
    }

    const tempPath = path.join(__dirname, 'tempwasted.jpg');
    fs.writeFileSync(tempPath, imageBuffer);

    // Upload to ImgBB (need API key)
    const imgbbApiKey = 'YOUR_IMGBB_API_KEY';

    const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', null, {
      params: {
        key: imgbbApiKey,
        image: imageBuffer.toString('base64')
      }
    });

    const imgUrl = imgbbResponse.data.data.url;

    // Call wasted API
    const wastedUrl = `https://some-random-api.ml/canvas/wasted?avatar=${encodeURIComponent(imgUrl)}`;

    const wastedImageResponse = await axios.get(wastedUrl, { responseType: 'arraybuffer' });
    const wastedImageBuffer = Buffer.from(wastedImageResponse.data, 'binary');

    await conn.sendMessage(from, { image: wastedImageBuffer, caption: '*WASTED!*' }, { quoted: mek });

    fs.unlinkSync(tempPath);
  } catch (e) {
    console.error('Wasted Command Error:', e);
    reply('Failed to create Wasted effect. Please try again.');
  }
});
