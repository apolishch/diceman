'use strict'
const axios = require('axios')
const moment = require('moment')
const dayOfWeekMapping = require('../consts/dayOfWeekMapping').dayOfWeekMapping
const hourSanitizer = require('../utils/hourSanitizer').hourSanitizer

const locationIqCommon = (lat, lng, buildingType) => axios.get(`https://us1.locationiq.com/v1/nearby.php?key=374751e184aa9e&lat=${lat}&lon=${lng}&tag=${buildingType}&radius=1000&format=json`)
const zomatoSpecials = (lat, lng) => axios.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lng}`, { headers: { 'user-key': '7835bf209a55dcf3b85f263d75ebbf38' } })
const recentMovies = () => axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=0eae24cb637469dc039c8ffee60e0b6b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=2018-10-01`)

const nokiaFetchLandmarks = (lat, lng) => axios.get(`https://places.cit.api.here.com/places/v1/discover/explore?app_id=wa1oln3GOvlxfEeeUgYj&app_code=9kic1ARs38mJfJSD7Z9aOw&at=${lat},${lng}&pretty`)

const randomizeArray = (length) => Math.round(Math.random() * (length - 1))
const randomizer = (array) => array[randomizeArray(array.length)]

const locationIqBuildingTypes = ['pub', 'park', 'place_of_worship', 'supermarket']
const nokiaHereCategories = [
  'snacks-fast-food',
  'restaurant',
  'going-out',
  'food-drink',
  'dance-night-club'
]
const locationIqLang = {
  pub: 'Have a drink at',
  park: 'Go dogging at',
  place_of_worship: 'Kneel and praise sukaldari in',
  supermarket: 'Buy a whole chicken from'
}
const nokiaHereLang = {
  'snacks-fast-food': 'Buy a stranger something from',
  'restaurant': 'Buy the second most expensive main at',
  'going-out': 'Go get wankered(start with three Irish Carbombs) at',
  'food-drink': 'Go have a cup of coffee at',
  'dance-night-club': 'Take somebody home from',
  'bar-pub': 'Go ask the barman to serve you what he would serve fratparty on spring break at'
}

const generateSuggestion = (lat, lng) => {
  console.log(lat, lng)
  const apiTypes = ['locationIq', 'zomato', 'wildcard', 'cinema', 'nokia']
  const api = randomizer(apiTypes)

  switch (api) {
    case 'locationIq':
      const buildingType = randomizer(locationIqBuildingTypes)
      return locationIqCommon(lat, lng, buildingType).then(response => {
        const buildings = response.data
        console.log('buildings.data', buildings)
        const building = randomizer(buildings)
        console.log('building', building)
        return `${locationIqLang[buildingType]} ${building.name}, location ${building.lat}, ${building.lon}`
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
      }).catch(e => {
        console.log('e', e)
        return `Suck a dick`
      })
    case 'nokia':
      return nokiaFetchLandmarks(lat, lng)
        .then(response => {
          const filteredItems = response.data.results.items.filter((item) => {
            if(item.openingHours && item.openingHours.text) {
              let openingTimes = item.openingHours.text.split('-').map((el) => el.trim())
              openingTimes[1] = openingTimes[1].split(': ')
              openingTimes = openingTimes.reduce((memo, item) => {
                if (Array.isArray(item)) {
                  item.forEach(element => {
                    memo.push(element)
                  })
                } else {
                  memo.push(item)
                }
                return memo
              }, [])

              const startDay = dayOfWeekMapping[openingTimes[0]]
              const endDay = dayOfWeekMapping[openingTimes[1]]
              const timeNow = moment()
              if ((timeNow.weekday() >= startDay) && (timeNow.weekday() <= endDay)) {
                return ((timeNow.hour() >= parseInt(openingTimes[2].split(':')[0], 10)) &&
                        (timeNow.hour() < parseInt(hourSanitizer(openingTimes[3].split(':')[0]), 10)))
              }
            }
          })
          const {category: {id: categoryId}, title, vicinity} = randomizer(filteredItems)
          return `${nokiaHereLang[categoryId]} ${title}. Located at: ${vicinity}`
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
