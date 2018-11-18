// @flow
'use strict'

import express from 'express'
import expressBoom from 'express-boom'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
import morgan from 'morgan'
import {roll} from './routes/roll'

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
