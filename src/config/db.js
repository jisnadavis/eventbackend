const mongoose = require('mongoose')
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('connectado con exito')
  } catch (error) {
    console.log(error)
    console.log('no puede connectar con db')
  }
}
module.exports = { connectdb }
