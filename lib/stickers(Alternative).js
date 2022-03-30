const WSF = require("wa-sticker-formatter"); //3.6.0 because 4.x.x animated gif is bug in bayleys with compress video
const utils = require("../utils");
const { fetchJson } = require("fetch-json");

const stickerFromImage = async (imageBuffer, pack, author, type) => {
  var sticker = false;
  if (author || pack) {
    sticker = new WSF.Sticker(imageBuffer, {
      crop: true,
      pack: pack ? pack : "Stikers",
      author: author ? author : "Kurisu",
      quality: 10,
      type,
    });
  } else {
    sticker = new WSF.Sticker(imageBuffer, { crop: true, quality: 10, type });
  }

  await sticker.build();
  const sticBuffer = await sticker.get();
  return sticBuffer;
};

const stickerFromVideo = async (imageBuffer, pack, author, type) => {
  //const result = await utils.compressVideo(imageBuffer, null);
  result = imageBuffer;
  var sticker = false;
  if (author || pack) {
    sticker = new WSF.Sticker(result, {
      crop: true,
      pack: pack ? pack : "Stikers",
      author: author ? author : "Kurisu",
      quality: 10,
      type,
    });
  } else {
    sticker = new WSF.Sticker(result, { crop: true, quality: 10, type });
  }
  await sticker.build();
  const sticBuffer = await sticker.get();
  return sticBuffer;
};

const doge = async () => {
  const result = await fetchJson.get(
    "http://amadeus-api.herokuapp.com/api/sticker/doge"
  );
  var sticker = new WSF.Sticker(result.img, {
    pack: "Stikers-anime",
    author: "Kurisu",
    quality: 10,
    type: "full",
  });
  await sticker.build();
  const sticBuffer = await sticker.get();
  return sticBuffer;
};

const snime = async () => {
  const result = await fetchJson.get(
    "http://amadeus-api.herokuapp.com/api/sticker/snime"
  );
  var sticker = new WSF.Sticker(result.img, {
    pack: "Stikers-anime",
    author: "Kurisu",
    quality: 10,
    type: "full",
  });
  await sticker.build();
  const sticBuffer = await sticker.get();
  return sticBuffer;
};

const stickerBGFromImage = async (buffer, pack, author, type) => {
  var image = await utils.removeBg(buffer);

  var sticker = false;
  if (author || pack) {
    sticker = new WSF.Sticker(image, {
      crop: true,
      pack: pack ? pack : "Stikers",
      author: author ? author : "Kurisu",
    });
  } else {
    sticker = new WSF.Sticker(image, { crop: true });
  }

  await sticker.build();
  const sticBuffer = await sticker.get();
  return sticBuffer;
};

module.exports = {
  stickerFromImage,
  stickerFromVideo,
  doge,
  snime,
  stickerBGFromImage,
};
