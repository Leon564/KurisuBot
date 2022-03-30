const axios = require('axios');
const sharp = require("sharp");
const path =require('path');

async function ImageDownloadAndResize(url, name) {

  try {
    if (!name) name = Date.now();
    var file = path.join(__dirname, '..', `/temp/${name}.jpg`)
    const image = await axios.get(url, { responseType: "arraybuffer" });
    await sharp(image.data).resize(1000).jpeg({ quality: 80 }).toFile(file);
    return file;
  } catch (err) {
    return false;
  }

}

module.exports = ImageDownloadAndResize
