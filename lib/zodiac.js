const { fetchJson } = require('fetch-json')

const zodiac = async (signo) => {
  return fetchJson.get(`http://amadeus-api.herokuapp.com/api/zodiac?sign=${signo.toLowerCase()}`).then((h) => {
    if (h.title) {
      return `*${h.sign}*\n*${h.title}*\n\n${h.predict}`
    } else {
      var s = '';
      for (var i = 0; i < h.signs.length; i++) {
        s = s + "✔" + h.signs[i] + " ";
      }
      return `*Signos*\n${s}`;
    }
  }).catch(function (err) {
    console.log(err)
    return ('ocurrio un error, el servidor no esta disponible');
  })
  

}

const loveCalc = async (name1, name2) => {
  var n2 = name2 ? name2 : 'kurisu-bot';
  const result = await fetchJson.get(`http://amadeus-api.herokuapp.com/api/lovecalc?n1=${name1}&n2=${n2}`)
  return result.imagen;
}

module.exports = {
  zodiac,
  loveCalc
}
