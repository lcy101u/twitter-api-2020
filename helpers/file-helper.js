const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (file === undefined) return resolve(null)
    return imgur.uploadFile(file[0].path)
      .then(img => {
        const imgLink = img ? img.link : null
        resolve(imgLink)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  imgurFileHandler
}
