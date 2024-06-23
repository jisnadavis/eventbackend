const Eventos = require('../modelos/event')
const multer = require('multer')
const mongoose = require('mongoose')
const { deletefile } = require('../../utils/delete')

const geteventos = async (req, res, next) => {
  try {
    const eventos = await Eventos.find()
      .populate('eventorganizer', 'name')
      .exec()
    return res.status(200).json(eventos)
  } catch (error) {
    console.log(error)
    return res.status(400).json('error in showing errors')
  }
}
const createevent = async (req, res, next) => {
  try {
    const { title, date, location, description } = req.body
    const requestinguser = req.user
    console.log(requestinguser.role, requestinguser.name)

    // Validate date
    const parsedDate = new Date(date)
    if (isNaN(parsedDate)) {
      return res
        .status(400)
        .json({ message: 'Invalid date format. Use yyyy-mm-dd' })
    }

    // Use requesting user ID as event organizer
    const organizerArray = [new mongoose.Types.ObjectId(requestinguser.id)]

    // Create new event
    const newEvent = new Eventos({
      title,
      date: parsedDate,
      location,
      description,
      eventimg: req.file.path,
      eventorganizer: organizerArray
    })

    await newEvent.save()

    return res.status(201).json(newEvent)
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ message: 'Unable to create an event', error: error.message })
  }
}

const updateevent = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, date, location, description, eventorganizer } = req.body
    const requestinguser = req.user

    if (!requestinguser || !requestinguser.id) {
      return res.status(401).json({ message: 'Unauthorized: No user found' })
    }
    // Find the existing event
    const oldevent = await Eventos.findById(id)
    if (!oldevent) {
      return res.status(404).json({ message: 'Event not found' })
    }
    if (oldevent.eventorganizer.toString() !== requestinguser.id) {
      return res
        .status(403)
        .json({ message: 'You are not the organizer of this event' })
    }

    if (title) oldevent.title = title

    if (date) {
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        oldevent.date = parsedDate
      } else {
        return res.status(400).json({ message: 'Invalid date format' })
      }
    }

    if (location) oldevent.location = location
    if (description) oldevent.description = description

    if (eventorganizer) {
      try {
        const organizerArray = JSON.parse(eventorganizer)
        oldevent.eventorganizer = organizerArray.map((id) => {
          if (mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id)
          } else {
            throw new Error(`Invalid ObjectId: ${id}`)
          }
        })
      } catch (err) {
        return res
          .status(400)
          .json({ message: 'Invalid event organizer format' })
      }
    }

    if (req.file) {
      if (oldevent.eventimg) {
        try {
          console.log('Deleting old image:', oldevent.eventimg)
          deletefile(oldevent.eventimg)
        } catch (error) {
          console.error('Error deleting file:', error.message)
        }
      }
      oldevent.eventimg = req.file.path
    }

    // Save the updated event
    const eventupdated = await oldevent.save()

    return res.status(200).json(eventupdated)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Unable to update event')
  }
}
const deleteevent = async (req, res, next) => {
  try {
    const { id } = req.params
    const requestinguser = req.user

    if (!requestinguser || !requestinguser.id) {
      return res.status(401).json({ message: 'Unauthorized: No user found' })
    }

    const eventto = await Eventos.findById(id)
    if (!eventto) {
      return res.status(404).json('Event not found')
    }

    if (!eventto.eventorganizer.includes(requestinguser.id)) {
      return res.status(403).json({
        message:
          'You cannot delete the event because you are not an organizer of this event'
      })
    }

    const eventtodelete = await Eventos.findByIdAndDelete(id)
    if (eventtodelete.eventimg) {
      try {
        console.log('Deleting image:', eventtodelete.eventimg)
        deletefile(eventtodelete.eventimg)
      } catch (error) {
        console.error('Error deleting file:', error.message)
      }
    }

    return res.status(200).json(eventtodelete)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Unable to delete event')
  }
}

module.exports = { geteventos, createevent, updateevent, deleteevent }
