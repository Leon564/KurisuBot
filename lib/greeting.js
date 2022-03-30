const fs = require('fs');
const greetings=require('../data/greetings.json')
const greeting = async () => {
  
  return greetings[Math.floor(Math.random() * greetings.length)]
}

module.exports = greeting;