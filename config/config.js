require('dotenv').config()
module.exports = {
  'prefix': process.env.prefix || "!",//Your bot prefix example: "!"
  'imgbb_apikey': process.env.imgbb_apikey,//your imgbb api key
  'BgApikey': process.env.BgApikey,//your remove.bg api key
  'Bot_Number': process.env.Bot_Number,//your bot number
  'stickerTypes':['circle','cropped','default','full']//sticker types by wa-sticker-formatter
};
