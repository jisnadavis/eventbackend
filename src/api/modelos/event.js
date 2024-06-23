const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  eventimg: { type: String, required: false },
  eventorganizer: [{ type: mongoose.Types.ObjectId, ref: 'users' }]
})
const Eventos = mongoose.model('events', eventSchema, 'events')
module.exports = Eventos
