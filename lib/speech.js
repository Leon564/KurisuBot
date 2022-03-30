const path = require('path');
const gTTS = require('gtts');
const utils = require('../utils')
const translatte = require('translatte');

const speech = async (lang = 'es', text, name = Date.now(), callback) => {
  //var speech = res.text;
  var result = {text};
  try{
  result =await translatte(text, { to: lang })
 }
  catch(err){
    await callback(null,true);
    return;
  }
  
  
  var gtts = new gTTS(result.text, lang);
  const file = path.join(__dirname, '..', `/temp/${name}.mp3`);
  gtts.save(file, async function (err, result) {
    if (err) { await callback(null,true);return }   
    await callback(file,false);
    utils.fileDelete(file)
  });
}
module.exports = speech;