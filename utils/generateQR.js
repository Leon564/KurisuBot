const qrcode = require('qrcode')
const fs = require('fs');

const generateQR = async function (input,output) {
    output=output?output:'./qrcode.png'
    rawData = await qrcode.toDataURL(input, { scale: 8 })
    dataBase64 = rawData.replace(/^data:image\/png;base64,/, "")
    fs.writeFileSync(output, dataBase64, 'base64')
    console.log("Success generate image qr")
}
module.exports = generateQR;