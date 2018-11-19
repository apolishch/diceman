'use strict'
const generateSuggestion = require('../data/generateSuggestion').generateSuggestion
const roll = (req, res, next) => {
  let {body: {lat, lng}} = req
  console.log(lat)
  console.log(lng)
  lat = 51.5207258
  lng = -0.0935002
  return generateSuggestion(lat, lng).then(suggestion => {
    console.log(suggestion)
    res.status(200).send(suggestion)
  })
}

module.exports = {
  roll: roll
}
