const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const config = require('../config/config')



const removeBg = async (image) => {
  if (!image || !config.BgApikey) return 'error';
  const BgApikey = Array.isArray(config.BgApikey) ? config.BgApikey[Math.floor(Math.random() * config.BgApikey.length)] : config.BgApikey;
  var _image = image;
  var name = Date.now() + '.jpg';

  if (image.includes('.jpg' || image.includes('jpeg')) || image.includes('.png')) {
    _image = fs.readFileSync(image);
  }

  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', _image, name);
  return axios({
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: formData,
    responseType: 'arraybuffer',
    headers: {
      ...formData.getHeaders(),

      'X-Api-Key': BgApikey
    },
    encoding: null
  }).then((response) => {
    if (response.status != 200) return 'error'
    return response.data;
  }).catch((error) => {
    return console.error('Request failed:', error);
  });
}

module.exports = removeBg;
