var utils = require("../utils");
var fs = require("fs");
const path = require("path");
var sharp = require("sharp");

const wasted = async (image) => {
  const imageUrl = await utils.uploadImage(image);
  return `https://some-random-api.ml/canvas/wasted?avatar=${imageUrl}`;
};
const calendar = async (image) => {
  const imageUrl = await utils.uploadImage(image);  
  return `http://amadeus-api.herokuapp.com/api/calendar?url=${imageUrl}`;
};

const sticBufferToImage = async (buffer, callback) => {
  var pat = path.join(__dirname, "..", "/temp/" + Date.now() + ".png");
  sharp(buffer)
    .toFile(pat)
    .then(async (info) => {
      await callback(pat);
      fs.unlinkSync(pat);
    })
    .catch((err) => {      
      callback(null, {error:err});
    });
  return true;
};
const customMeme = async (image, top='', bottom='') => {
  const imageUrl = await utils.uploadImage(image);
  topText = top
    .trim()
    .replace(/\s/g, "_")
    .replace(/\?/g, "~q")
    .replace(/\%/g, "~p")
    .replace(/\#/g, "~h")
    .replace(/\//g, "~s");
  bottomText = bottom
    .trim()
    .replace(/\s/g, "_")
    .replace(/\?/g, "~q")
    .replace(/\%/g, "~p")
    .replace(/\#/g, "~h")
    .replace(/\//g, "~s");    
  return top==''?`https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${imageUrl}`:`https://api.memegen.link/images/custom/_/${bottomText}.png?background=${imageUrl}`;
};

module.exports = {
  wasted,
  sticBufferToImage,
  calendar,
  customMeme,
};
