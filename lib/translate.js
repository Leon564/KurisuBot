const translatte = require('translatte');

async function translate(lang, message) {  
  var result = "";
  await translatte(message, { to: lang }).then(res => {
    result = "Traduccion a " + lang + ": " + res.text;
  }).catch(err => {
    result = err.message;
  });
  return result;
}

module.exports = translate;
