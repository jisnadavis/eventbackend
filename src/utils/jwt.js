const jwt = require('jsonwebtoken')
const generatesign = (id) => {
  return jwt.sign({ id }, process.env.jwt_token, { expiresIn: '30d' })
}
const verifytoken = (token) => {
  try {
    return jwt.verify(token, process.env.jwt_token)
  } catch (error) {
    throw new Error('Token verification failed')
  }
}
module.exports = { generatesign, verifytoken }
