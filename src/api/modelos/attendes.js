const mongoose = require('mongoose')

const attendeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  phoneNumber: {
    type: String,
    required: false,
    trim: true
  },
  eventId: [{ type: mongoose.Types.ObjectId, ref: 'events' }],
  checkedIn: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
})

const Attendee = mongoose.model('attendees', attendeeSchema, 'attendees')

module.exports = Attendee
