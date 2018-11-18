'use strict'
const generateSuggestion = require('../data/generateSuggestion').generateSuggestion
const roll = (req, res, next) => {
  const {body: {lat, lng}} = req
  return generateSuggestion(lat, lng).then(suggestion => {
    console.log(suggestion)
    res.status(200).send(suggestion)
  })
}

module.exports = {
  roll: roll
}
