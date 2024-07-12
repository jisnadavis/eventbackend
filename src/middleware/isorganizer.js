const User = require('../api/modelos/user')
const { verifytoken } = require('../utils/jwt')

const isorganizer = async (req, res, next) => {
  try {
    const isauth = req.headers.authorization
    console.log(isauth)
    const parsedtoken = isauth.split(' ')
    const token = parsedtoken[1]
    console.log(token)
    const { id } = verifytoken(token)
    const user = await User.findById(id)
    req.user = user
    console.log(user.id)
    console.log(user.role)
    user.password = null

    if (user.role === 'organizer') {
      next()
    } else {
      return res.status(403).json('you are not an organizer')
    }
  } catch (error) {
    console.log(error)
    res.status(400).json('no esta authorizado')
  }
}
module.exports = { isorganizer }
