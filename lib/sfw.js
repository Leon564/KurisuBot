const { fetchJson } = require("fetch-json");
const utils = require("../utils");
const fs = require("fs");
const randomSFW = async (callback) => {
  const result = await fetchJson.get(
    `http://amadeus-api.herokuapp.com/api/sfw/waifu`
  );

  const image = await utils.imageDownloadAndResize(result.result.images[0].url);
  await callback({ image, name: result.result.images[0].tags[0].name });
  fs.unlinkSync(image);
  return true;
};

async function randomhusb(callback) {
  const result = await fetchJson.get(
    `http://amadeus-api.herokuapp.com/api/sfw/husb`
  );

  const image = await utils.imageDownloadAndResize(result.result.url);
  await callback({ image, name: result.result.title });
  fs.unlinkSync(image);
  return true;
}

module.exports = {
  randomSFW,
  randomhusb,
};
