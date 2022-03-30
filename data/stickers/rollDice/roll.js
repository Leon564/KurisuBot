const path = require("path");

const randomroll = async (num) => {
  if(!num)num=Math.floor(Math.random() * (7 - 1) + 1);  
  const dice = num > 0 && num <= 6 ? path.join(__dirname, `/${num}.webp`):`Error` 
  return dice;
}

module.exports=randomroll;