const { uploadfolder } = require('../../middleware/file')
const { isorganizer } = require('../../middleware/isorganizer')
const {
  geteventos,
  createevent,
  updateevent,
  deleteevent,
  getEventoById
} = require('../controllers/event')

const eventrouter = require('express').Router()
eventrouter.get('/', geteventos)
eventrouter.get('/:eventId', [isorganizer], getEventoById)
eventrouter.post(
  '/',
  [isorganizer],
  uploadfolder('event').single('eventimg'),
  createevent
)
eventrouter.put(
  '/:id',
  [isorganizer],
  uploadfolder('event').single('eventimg'),
  updateevent
)
eventrouter.delete('/:id', [isorganizer], deleteevent)
module.exports = { eventrouter }
