const User = require('../api/modelos/user')
const { verifytoken } = require('../utils/jwt')

const isauth = async (req, res, next) => {
  try {
    const isauth = req.headers.authorization
    const parsedtoken = isauth.split(' ')
    const token = parsedtoken[1]
    const { id } = verifytoken(token)
    const user = await User.findById(id)
    req.user = user
    user.password = null
    console.log(token)
    next()
  } catch (error) {
    console.log(error)
    res.status(400).json('no esta authorizado')
  }
}
module.exports = { isauth }
