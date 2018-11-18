//@flow
'use strict'

export const roll = (req, res, next): void => {
  const {body: {lat, lng}} = req
  res.status(200).send(generateSuggestion(lat, lng))
}
