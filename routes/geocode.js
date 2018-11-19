'use strict'

const axios = require('axios')

const locationIqGeocode = (search) => axios.get(`https://eu1.locationiq.com/v1/search.php?key=374751e184aa9e&q=${search}&format=json`)

const geocode = (req, res, next) => {
  let {query: {search}} = req
  console.log('search', search)
  return locationIqGeocode(search).then(response => {
    console.log('location', response.data[0])
    const location = response.data[0]
    return res.status(200).send({lat: location.lat, lng: location.lon, displayName: location.display_name})
  })
}

module.exports = {
  geocode: geocode
}
