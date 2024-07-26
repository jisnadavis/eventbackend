const express = require('express')
const { connectdb } = require('./src/config/db')
const Userrouter = require('./src/api/routes/user')
const { eventrouter } = require('./src/api/routes/event')
const { connectcloudinary } = require('./src/config/cloudinary')
const attenderouter = require('./src/api/routes/attendes')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization' // Allowed headers
  })
)

connectdb()

connectcloudinary()
app.use(express.json())
app.use('/api/v1/users', Userrouter)
app.use('/api/v1/events', eventrouter)
app.use('/api/v1/attende', attenderouter)

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
