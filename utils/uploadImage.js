const imgbbUploader = require("imgbb-uploader");
const config = require('../config/config.js');
const path = require('path');
var fs = require('fs');

const uploadImage = async (img, name, expiration, format = 'jpg') => {
  if (!img) return { error: true, reason: 'empty image' };
  return new Promise(async (resolve, reject) => {    
    var fileDelete = false;    
    if (typeof(img)=='object') {      
      let pathh = path.join(__dirname, '..' ,'/temp/' + Date.now() + '.' + format);
      fs.writeFileSync(pathh, img);
      img = pathh;
      fileDelete = true;
    }    
    var _name = name ? name : Date.now();
    var _expiration = expiration ? expiration : 120;

    
    const options = {
      apiKey: config.imgbb_apikey,
      imagePath: img,
      name: _name,
      expiration: _expiration
    };
    
    imgbbUploader(options)
      .then((response) => { if (fileDelete) fs.unlinkSync(img);  return resolve(response.url) })
      .catch((error) => { return reject({ error: true, reason: error })});
  
  })
}


module.exports = uploadImage;
