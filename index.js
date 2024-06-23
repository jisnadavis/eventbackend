const express = require('express')
const { connectdb } = require('./src/config/db')
const Userrouter = require('./src/api/routes/user')
const { eventrouter } = require('./src/api/routes/event')
const { connectcloudinary } = require('./src/config/cloudinary')
const attenderouter = require('./src/api/routes/attendes')

require('dotenv').config()
const app = express()
connectdb()

connectcloudinary()
app.use(express.json())
app.use('/api/v1/users', Userrouter)
app.use('/api/v1/events', eventrouter)
app.use('/api/v1/attende', attenderouter)

app.listen(3000, () => {
  console.log('http://localhost:3000')
})