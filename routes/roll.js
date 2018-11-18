'use strict'
const generateSuggestion = require('../data/generateSuggestion').generateSuggestion
const roll = (req, res, next) => {
  let {body: {lat, lng}} = req
  lat = 51.5207258
  lng = -0.0935002
  return generateSuggestion(lat, lng).then(suggestion => {
    return res.status(200).send(suggestion)
  })
}

module.exports = {
  roll: roll
}
