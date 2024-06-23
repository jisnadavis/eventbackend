const { uploadfolder } = require('../../middleware/file')
const { isorganizer } = require('../../middleware/isorganizer')
const {
  geteventos,
  createevent,
  updateevent,
  deleteevent
} = require('../controllers/event')

const eventrouter = require('express').Router()
eventrouter.get('/', geteventos)
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