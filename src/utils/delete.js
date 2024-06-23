const cloudinary = require('cloudinary').v2
const deletefile = (url) => {
  console.log(url)
  const array = url.split('/')
  const name = array.at(-1).split('.')[0]
  const public_id = `${array.at(-2)}/${name}`
  console.log(public_id)
  cloudinary.uploader.destroy(public_id, (error, result) => {
    if (error) {
      console.error('Error deleting file from Cloudinary:', error)
    } else {
      console.log('Image deleted:', result)
    }
  })
}
module.exports = { deletefile }
