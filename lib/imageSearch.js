const uploadImage = require('../utils/uploadImage.js')
const reverseImageSearch = require('reverse-image-search-google')
const { fetchJson } = require('fetch-json');
var gis = require('g-i-s');

const searchByImg = async (img, random = false) => { 
  const upf = await uploadImage(img);
  if (upf.error) return { title: "...", url: "Ocurrio un error, intente mas tarde" };
  var result = await fetchJson.get('https://node-reverse-image-search.herokuapp.com/?imageUrl=' + encodeURIComponent(upf))
  result.shift();
  if (random) result = [result[Math.floor(Math.random() * result.length)]];
  return { text: `Resultado: ${result[0].title}\nEnlace: ${result[0].url}` }
}


const searchByText = async (query, rand) => {
  return new Promise(async (resolve, reject) => {

    gis(query, async (err, result) => {
      if (err) return reject({ text: 'error' })
      if (!result[0]) return reject({ text: 'Sin resultados' })
      if (rand) return resolve(result[Math.floor(Math.random() * result.length)])
      return resolve(result[0]);

    });

  })


}

module.exports = {
  searchByImg,
  searchByText
}