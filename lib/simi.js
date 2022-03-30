const {fetchJson} = require('fetch-json')
const {removeAccents} = require('../utils')
const simi= async(msg)=>{
  const req= await fetchJson.get(`https://api.simsimi.net/v2/?text=${removeAccents(msg)}&lc=es`);
  return(req.success)
}

module.exports=simi;