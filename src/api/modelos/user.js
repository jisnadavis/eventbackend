const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userschema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['organizer', 'staff'],
      default: 'staff'
    }
  },
  { timestamps: true }
)

userschema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})
const User = mongoose.model('users', userschema, 'users')
module.exports = User
