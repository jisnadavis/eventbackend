const mongoose = require('mongoose')
const Attendee = require('../modelos/attendes')
const Eventos = require('../modelos/event')
const getattendees = async (req, res, next) => {
  try {
    const requestinguser = req.user

    // Validate user existence
    if (!requestinguser || !requestinguser.id) {
      return res.status(401).json({ message: 'Unauthorized: No user found' })
    }

    // Fetch all events organized by the requesting user
    const events = await Eventos.find({
      eventorganizer: requestinguser.id
    }).select('_id')

    // Extract event IDs
    const eventIds = events.map((event) => event._id)

    // Fetch attendees for the user's events
    const attendees = await Attendee.find({ eventId: { $in: eventIds } })
      .populate('eventId', 'title')
      .exec()

    return res.status(200).json(attendees)
  } catch (error) {
    console.log(error)
    return res.status(400).json('There is no event to show')
  }
}

const createAttendee = async (req, res, next) => {
  try {
    const { name, phoneNumber, eventId, registrationDate, emailId } = req.body
    const existingattendee = await Attendee.findOne({
      phoneNumber: phoneNumber
    })
    if (existingattendee) {
      return res.status(400).json('the phone number is already exisist')
    }
    const event = await Eventos.findById(eventId)
    if (!event) {
      return res.status(400).json({ error: 'Invalid event ID' })
    }

    const attendee = new Attendee({
      name,
      phoneNumber,
      eventId,
      registrationDate,
      emailId
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
    const { phonenumber } = req.params // This should be the name of the attendee
    const { name, phoneNumber, eventId, emailId } = req.body

    // Find the attendee by name and update their information
    const updatedAttendee = await Attendee.findOneAndUpdate(
      { phoneNumber: phonenumber },
      { name, phoneNumber, eventId, emailId },
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
    const { phonenumber } = req.params
    const requestinguser = req.user

    // Find the attendee by name
    const attendee = await Attendee.findOne({ phoneNumber: phonenumber })
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' })
    }

    // Populate the eventId field to get event details
    const event = await Eventos.findById(attendee.eventId)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    // Check if the requesting user is the organizer of the event
    if (event.eventorganizer.toString() !== requestinguser.id) {
      return res.status(403).json({
        error: 'You are not authorized to delete this attendee'
      })
    }

    // Delete the attendee
    await Attendee.deleteOne({ phoneNumber: phonenumber })

    return res.status(200).json({ message: 'Attendee deleted successfully' })
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error deleting attendee')
  }
}

module.exports = {
  getattendees,
  createAttendee,
  updateAttendee,
  deleteAttendee
}
