const {
  getattendees,
  createAttendee,
  updateAttendee,
  deleteAttendee
} = require('../controllers/attendes')

const attenderouter = require('express').Router()
attenderouter.get('/', getattendees)
attenderouter.post('/', createAttendee)
attenderouter.put('/:id', updateAttendee)
attenderouter.delete('/:id', deleteAttendee)
module.exports = attenderouter
