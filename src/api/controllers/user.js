const { generatesign } = require('../../utils/jwt')
const User = require('../modelos/user')
const bcrypt = require('bcrypt')

const getusers = async (req, res, next) => {
  try {
    const user = await User.find().select('-password')
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json('error')
  }
}
const registeruser = async (req, res, next) => {
  try {
    const newuser = new User(req.body)
    newuser.role = 'staff'
    console.log(newuser.role)
    const userexsist = await User.findOne({ email: newuser.email })
    if (userexsist) {
      return res.status(409).json('the email is already exisst')
    }

    const saveuser = await newuser.save()
    return res.status(201).json(saveuser)
  } catch (error) {
    console.log(error)
    return res.status(400).json('cant register user')
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'email or password is incorrect' })
    }
    const ispasswordvalid = bcrypt.compareSync(password, user.password)
    if (!ispasswordvalid) {
      return res.status(400).json({ message: 'email or password is invalid' })
    }
    if (ispasswordvalid) {
      const token = generatesign(user._id)
      console.log(token)
      return res.status(200).json({ token, user })
    }
  } catch (error) {
    console.error('Error occurred:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}
const updateuserrole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body
    if (!['organizer', 'staff'].includes(role)) {
      return res.status(400).json('Invalid role')
    }
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).json('User not found')
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json('Internal server error')
  }
}
const deleteuser = async (req, res) => {
  try {
    const { id } = req.params
    const requestingUser = req.user
    const userToDelete = await User.findById(id)
    if (!userToDelete) {
      return res.status(404).json('User not found')
    }
    if (
      requestingUser._id.toString() !== id &&
      requestingUser.role !== 'organizer'
    ) {
      return res.status(403).json('Access denied')
    }

    await User.findByIdAndDelete(id)

    return res
      .status(200)
      .json({ message: 'User deleted successfully', element: userToDelete })
  } catch (error) {
    console.error(error)
    return res.status(500).json('Internal server error')
  }
}
module.exports = { getusers, registeruser, updateuserrole, login, deleteuser }
