const { isorganizer } = require('../../middleware/isorganizer')
const {
  getattendees,
  createAttendee,
  updateAttendee,
  deleteAttendee
} = require('../controllers/attendes')

const attenderouter = require('express').Router()
attenderouter.get('/', isorganizer, getattendees)
attenderouter.post('/', createAttendee)
attenderouter.put('/:phonenumber', updateAttendee)
attenderouter.delete('/:phonenumber', isorganizer, deleteAttendee)
module.exports = attenderouter
