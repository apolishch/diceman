'use strict'
const generateSuggestion = require('../data/generateSuggestion').generateSuggestion
const roll = (req, res, next) => {
  const {body: {lat, lng}} = req
  res.status(200).send(generateSuggestion(lat, lng))
}

module.exports = {
  roll: roll
}
