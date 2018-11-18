'use strict'
const axios = require('axios')

const locationIqCommon = (lat, lng, buildingType) => axios.get(`https://us1.locationiq.com/v1/nearby.php?key=374751e184aa9e&lat=${lat}&lon=${lng}&tag=${buildingType}&radius=1000&format=json`)

const zomatoSpecials = (lat, lng) => axios.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lng}`, { headers: { 'user-key': '7835bf209a55dcf3b85f263d75ebbf38' } })

const randomizeArray = (length) => Math.round(Math.random() * (length - 1))
const randomizer = (array) => array[randomizeArray(array.length)]

const locationIqBuildingTypes = ['pub', 'cinema', 'park', 'place_of_worship', 'supermarket']
const lang = {
  pub: 'Have a drink at',
  park: 'Go dogging at',
  cinema: 'Watch blade 2 at',
  place_of_worship: 'Kneel and praise sukaldari in',
  supermarket: 'Buy a whole chicken from'
}

const generateSuggestion = (lat, lng) => {
  console.log(lat, lng)
  const apiTypes = ['locationIq', 'zomato', 'wildcard']
  const api = randomizer(apiTypes)

  switch (api) {
    case 'locationIq':
      const buildingType = randomizer(locationIqBuildingTypes)
      return locationIqCommon(lat, lng, buildingType).then(response => {
        const buildings = response.data
        console.log('buildings.data', buildings)
        return `${lang[buildingType]} ${randomizer(buildings).name}`
      }).catch(e => {
        console.log('e', e)
        return `Suck a dick`
      })
    case 'zomato':
      return zomatoSpecials(lat, lng).then(res => {
        const restaurants = res.data.nearby_restaurants
        console.log('restaurants', restaurants)
        return `Go for dinner at ${randomizer(restaurants).restaurant.name}`
      })
    case 'wildcard':
      return Promise.resolve().then(() => {
        return 'Go to Dirty Dicks. Ask the barman what you would order if you were a sorority girl on hell week.'
      })
  }
}

module.exports = {
  generateSuggestion: generateSuggestion
}
