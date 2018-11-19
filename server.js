// @flow
'use strict'

const express = require('express')
const expressBoom = require('express-boom')
const bodyParser = require('body-parser')
const timeout = require('connect-timeout')
const morgan = require('morgan')
const roll = require('./routes/roll').roll
const geocode = require('./routes/geocode').geocode
const path = require('path')
const cors = require('cors')
const port = process.env.PORT || 5790

let app = express()

app.use(cors())
app.use(morgan('dev'))

app.use(bodyParser.json({limit: '500kb'}))
app.use(expressBoom())
app.use(timeout('5s'))
app.use(express.static('dice-man-FE/dist'))
app.get('/health', (req, res) => res.status(204).send())

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/dice-man-FE/dist/index.html'))
})

app.post('/roll', roll)
app.get('/geocode', geocode)

app.all('*', (req, res) => res.status(404).send())

app.use((err, req, res, next) => {
  if (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

app.listen(port, () => console.log('listening on port', port))
