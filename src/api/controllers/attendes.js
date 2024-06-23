const mongoose = require('mongoose')
const Attendee = require('../modelos/attendes')
const Eventos = require('../modelos/event')
const getattendees = async (req, res, next) => {
  try {
    const attendee = await Attendee.find().populate('eventId', 'title').exec()
    return res.status(200).json(attendee)
  } catch (error) {
    console.log(error)
    return res.status(400).json('there is no event to show')
  }
}
const createAttendee = async (req, res, next) => {
  try {
    const { name, phoneNumber, eventId, registrationDate } = req.body

    const event = await Eventos.findById(eventId)
    if (!event) {
      return res.status(400).json({ error: 'Invalid event ID' })
    }

    const attendee = new Attendee({
      name,
      phoneNumber,
      eventId,
      registrationDate
    })

    await attendee.save()
    return res.status(201).json(attendee)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error creating attendee')
  }
}
const updateAttendee = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, phoneNumber, eventId } = req.body

    // Find the attendee by ID and update their information
    const updatedAttendee = await Attendee.findByIdAndUpdate(
      id,
      { name, phoneNumber, eventId },
      { new: true, runValidators: true }
    )

    if (!updatedAttendee) {
      return res.status(404).json({ error: 'Attendee not found' })
    }

    return res.status(200).json(updatedAttendee)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error updating attendee')
  }
}
const deleteAttendee = async (req, res, next) => {
  try {
    const { id } = req.params

    const deletedAttendee = await Attendee.findByIdAndDelete(id)

    if (!deletedAttendee) {
      return res.status(404).json({ error: 'Attendee not found' })
    }

    return res.status(200).json({ message: 'Attendee deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error deleting attendee')
  }
}

module.exports = {
  getattendees,
  createAttendee,
  updateAttendee,
  deleteAttendee
}
