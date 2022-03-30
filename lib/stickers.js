const WSF = require('wa-sticker-formatter');
const utils = require('../utils');
const { fetchJson } = require('fetch-json')


const stickerFromImage = async (buffer, pack, author, type) => {
  var sticker = false;
  if (author || pack) {
    sticker = new WSF.Sticker(buffer, { background: '', pack: pack ? pack : "Stikers", author: author ? author : 'Kurisu', quality: 10, type })
  } else {
    sticker = new WSF.Sticker(buffer, { quality: 10, type })
  }

  const sticBuffer = await sticker.toBuffer();
  return sticBuffer;
}

const stickerFromVideo = async (imageBuffer, pack, author, type) => {
  const result = await utils.compressVideo(imageBuffer, null);
  var sticker = false;
  if (author || pack) {
    sticker = new WSF.Sticker(result, { pack: pack ? pack : "Stikers", author: author ? author : 'Kurisu', id: '21', quality: 10, type })
  } else {
    sticker = new WSF.Sticker(result, { quality: 10, type })
  } 
  const sticBuffer = await sticker.toBuffer();
  return sticBuffer;

}

const doge = async () => {
  const result = await fetchJson.get('http://amadeus-api.herokuapp.com/api/sticker/doge');
  var sticker = new WSF.Sticker(result.image, { animated: true, pack: "Stikers-anime", author: 'Kurisu', quality: 10, type: 'full' })
  var sticBuffer = await sticker.toBuffer();
  return sticBuffer;
}

const snime = async () => {
  const result = await fetchJson.get('http://amadeus-api.herokuapp.com/api/sticker/snime');
  var sticker = new WSF.Sticker(result.image, { animated: true, pack: "Stikers-anime", author: 'Kurisu', quality: 10, type: 'full' })
  var sticBuffer = await sticker.toBuffer();
  return sticBuffer;
}

const stickerBGFromImage = async (buffer, pack, author, type) => {
  var image = await utils.removeBg(buffer);

  var sticker = false;
  if (author || pack) {
    sticker = new WSF.Sticker(image, { animated: false, pack: pack ? pack : "Stikers", author: author ? author : 'Kurisu', quality: 10, type })
  } else {
    sticker = new WSF.Sticker(image, { animated: false, quality: 10, type })
  }

  const sticBuffer = await sticker.toBuffer();
  return sticBuffer;
}

module.exports = {
  stickerFromImage,
  stickerFromVideo,
  doge,
  snime,
  stickerBGFromImage
}