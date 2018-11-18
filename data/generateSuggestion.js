'use strict'

const axios = require('axios')

const locationIqCommon = (lat, lng, buildingType) => axios.get(`https://us1.locationiq.com/v1/nearby.php?key=374751e184aa9e&lat=${lat}&lon=${lng}&tag=${buildingType}&radius=1000&format=json`)

const randomizeArray = (length) => Math.round(Math.random() * (length - 1))
const randomizer = (array) => array[randomizeArray(array.length)]

const lang = {
  pub: 'Have a drink at',
  park: 'Go dogging at',
  cinema: 'Watch blade 2 at'
}

const generateSuggestion = (lat, lng) => {
  console.log(lat, lng)
  const buildingTypes = ['pub', 'cinema', 'park']
  const buildingType = randomizer(buildingTypes)
  return locationIqCommon(lat, lng, buildingType).then(response => {
    console.log('response', response)
    const buildings = response.data
    console.log('buildings.data', buildings)
    return `${lang[buildingType]} ${randomizer(buildings).name}`
  }).catch(e => {
    console.log('e', e)
    return `Suck a dick`
  })
}

module.exports = {
  generateSuggestion: generateSuggestion
}
