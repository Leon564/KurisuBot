const fs = require('fs');

const fileDelete = async (filePath) => {
  fs.unlink(filePath, function (err) {
    if (err) return {'success':false}
    return {'success':true}
  })
}

module.exports = fileDelete;