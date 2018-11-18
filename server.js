// @flow
'use strict'

const express = require('express')
const expressBoom = require('express-boom')
const bodyParser = require('body-parser')
const timeout = require('connect-timeout')
const morgan = require('morgan')
const roll = require('./routes/roll').roll

const port = process.env.PORT || 5790

let app = express()

app.use(morgan('dev'))

app.use(bodyParser.json({limit: '500kb'}))
app.use(expressBoom())
app.use(timeout('5s'))

app.get('/health', (req, res) => res.status(204).send())

app.post('/roll', roll)

app.all('*', (req, res) => res.status(404).send())

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(err.message)
  }
})

app.listen(port, () => console.log('listening on port', port))
