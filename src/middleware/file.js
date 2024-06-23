const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const createcloudinarystorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowedformats: ['jpg', 'png', 'jpeg', 'webp']
    }
  })
}
const uploadfolder = (folder) => {
  const storage = createcloudinarystorage(folder)
  return multer({ storage })
}
module.exports = { uploadfolder }
