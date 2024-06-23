const { isauth } = require('../../middleware/isauth')
const { isorganizer } = require('../../middleware/isorganizer')
const {
  getusers,
  registeruser,
  login,
  updateuserrole,
  deleteuser
} = require('../controllers/user')

const Userrouter = require('express').Router()
Userrouter.get('/', [isauth], getusers)
Userrouter.post('/', registeruser)
Userrouter.post('/login', login)
Userrouter.put('/:id', [isorganizer], updateuserrole)
Userrouter.delete('/:id', [isauth], deleteuser)
module.exports = Userrouter
