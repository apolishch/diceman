'use strict'
const generateSuggestion = require('../data/generateSuggestion').generateSuggestion
const roll = (req, res, next) => {
  let {body: {lat, lng}} = req
  console.log('--- { LATLONG ---')
  console.log(lat)
  console.log(lng)
  console.log('--- } LATLONG ---')
  return generateSuggestion(lat, lng).then(suggestion => {
    console.log(suggestion)
    res.status(200).send(suggestion)
  }).catch(console.log)
}

module.exports = {
  roll: roll
}
