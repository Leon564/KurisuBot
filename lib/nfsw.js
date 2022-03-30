const { fetchJson } = require("fetch-json");
const utils = require("../utils");
const fs = require("fs");
async function randomnfsw(callback) {
  const result = await fetchJson.get(
    `http://amadeus-api.herokuapp.com/api/nfsw/waifu`
  );
  const image = await utils.imageDownloadAndResize(result.result.url);
  await callback({ image, name: result.result.title });
  fs.unlinkSync(image);
  return true;
}

async function randomyaoinfsw(callback) {
  const result = await fetchJson.get(
    `http://amadeus-api.herokuapp.com/api/nfsw/yaoi`
  );
  const image = await utils.imageDownloadAndResize(result.result.url);
  await callback({ image, name: result.result.title });
  fs.unlinkSync(image);
  return true;
}

module.exports = {
  randomnfsw,
  randomyaoinfsw,
};
