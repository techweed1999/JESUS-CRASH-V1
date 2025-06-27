const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'wanted',
  alias: ['wantedposter'],
  desc: "Create a Wanted poster from user's profile picture or replied image",
  category: 'fun',
  filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Get image url or buffer: prefer replied image or user's profile pic
    let imageBuffer;

    if (m.quoted && m.quoted.message.imageMessage) {
      // Download replied image
      imageBuffer = await conn.downloadMediaMessage(m.quoted);
    } else {
      // Fetch user's profile picture
      try {
        const pfpUrl = await conn.profilePictureUrl(m.sender, 'image');
        const response = await axios.get(pfpUrl, { responseType: 'arraybuffer' });
        imageBuffer = Buffer.from(response.data, 'binary');
      } catch {
        return reply('Could not get profile picture and no image replied.');
      }
    }

    // Upload imageBuffer to an image processing API for wanted effect
    // Using free API: https://some-random-api.ml/canvas/wanted?avatar=URL
    // We need to upload image somewhere or send URL. Since we have buffer, we need to upload image to a hosting service or use base64

    // For simplicity, save imageBuffer locally and upload to imgBB (or similar) or use a free API accepting base64 (some-random-api.ml accepts URL only)
    // Here let's assume the replied image is already a URL or use a proxy service that allows base64

    // We'll save the image to /tmp and upload to an anonymous img hosting, or you can use your own

    // For demo, let's try an alternative: if the user replied with an image, get its URL from WhatsApp directly (contextInfo), else fallback

    // Since Baileys does not provide direct URLs, it's complex. 
    // We'll save the image to disk, upload it to imgBB via API, then call wanted API with that URL.

    // Save image locally
    const tempPath = path.join(__dirname, 'temp.jpg');
    fs.writeFileSync(tempPath, imageBuffer);

    // Upload to ImgBB (you need API key)
    const imgbbApiKey = 'YOUR_IMGBB_API_KEY'; // You have to get one from https://api.imgbb.com/

    const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', null, {
      params: {
        key: imgbbApiKey,
        image: imageBuffer.toString('base64')
      }
    });

    const imgUrl = imgbbResponse.data.data.url;

    // Call wanted API
    const wantedUrl = `https://some-random-api.ml/canvas/wanted?avatar=${encodeURIComponent(imgUrl)}`;

    // Download the wanted image
    const wantedImageResponse = await axios.get(wantedUrl, { responseType: 'arraybuffer' });
    const wantedImageBuffer = Buffer.from(wantedImageResponse.data, 'binary');

    // Send wanted image
    await conn.sendMessage(from, { image: wantedImageBuffer, caption: '*Wanted Poster!*' }, { quoted: mek });

    // Cleanup
    fs.unlinkSync(tempPath);

  } catch (e) {
    console.error('Wanted Command Error:', e);
    reply('Failed to create Wanted poster. Please try again.');
  }
});
