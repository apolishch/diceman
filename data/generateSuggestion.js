'use strict'
const axios = require('axios')

const locationIqCommon = (lat, lng, buildingType) => axios.get(`https://us1.locationiq.com/v1/nearby.php?key=374751e184aa9e&lat=${lat}&lon=${lng}&tag=${buildingType}&radius=1000&format=json`)
const zomatoSpecials = (lat, lng) => axios.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lng}`, { headers: { 'user-key': '7835bf209a55dcf3b85f263d75ebbf38' } })
const recentMovies = () => axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=0eae24cb637469dc039c8ffee60e0b6b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=2018-10-01`)

const randomizeArray = (length) => Math.round(Math.random() * (length - 1))
const randomizer = (array) => array[randomizeArray(array.length)]

const locationIqBuildingTypes = ['pub', 'park', 'place_of_worship', 'supermarket']
const lang = {
  pub: 'Have a drink at',
  park: 'Go dogging at',
  place_of_worship: 'Kneel and praise sukaldari in',
  supermarket: 'Buy a whole chicken from'
}

const generateSuggestion = (lat, lng) => {
  console.log(lat, lng)
  const apiTypes = ['locationIq', 'zomato', 'wildcard', 'cinema']
  const api = randomizer(apiTypes)

  switch (api) {
    case 'locationIq':
      const buildingType = randomizer(locationIqBuildingTypes)
      return locationIqCommon(lat, lng, buildingType).then(response => {
        const buildings = response.data
        console.log('buildings.data', buildings)
        const building = randomizer(buildings)
        console.log('building', building)
        return `${lang[buildingType]} ${building.name}, location ${building.lat}, ${building.lon}`
      }).catch(e => {
        console.log('e', e)
        return `Suck a dick`
      })
    case 'zomato':
      return zomatoSpecials(lat, lng).then(res => {
        const restaurants = res.data.nearby_restaurants
        console.log('restaurants', restaurants)
        const restaurant = randomizer(restaurants).restaurant
        console.log('restaurant', restaurant)
        return `Go for dinner at ${restaurant.name}, location ${restaurant.location.zipcode}`
      })
    case 'cinema':
      return Promise.all([
        recentMovies(),
        locationIqCommon(lat, lng, 'cinema')
      ]).then(([moviesResponse, buildingsResponse]) => {
        const movies = moviesResponse.data.results
        console.log('movies', movies)
        const movie = randomizer(movies)
        console.log('movie', movie)
        const cinemas = buildingsResponse.data
        const cinema = randomizer(cinemas)
        return `Watch ${movie.title} at ${cinema.name}, location ${cinema.lat}, ${cinema.lon}`
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
