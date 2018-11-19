'use strict'
const axios = require('axios')
const moment = require('moment-timezone')
const dayOfWeekMapping = require('../consts/dayOfWeekMapping').dayOfWeekMapping
const hourSanitizer = require('../utils/hourSanitizer').hourSanitizer

const locationIqCommon = (lat, lng, buildingType) => axios.get(`https://us1.locationiq.com/v1/nearby.php?key=374751e184aa9e&lat=${lat}&lon=${lng}&tag=${buildingType}&radius=1000&format=json`)
const zomatoSpecials = (lat, lng) => axios.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lng}`, { headers: { 'user-key': '7835bf209a55dcf3b85f263d75ebbf38' } })
const recentMovies = () => axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=0eae24cb637469dc039c8ffee60e0b6b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=2018-10-01`)
const reverseGeocode = (lat, lng) => axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=374751e184aa9e&lat=${lat}&lon=${lng}&format=json`)
const nokiaFetchLandmarks = (lat, lng) => axios.get(`https://places.cit.api.here.com/places/v1/discover/explore?app_id=wa1oln3GOvlxfEeeUgYj&app_code=9kic1ARs38mJfJSD7Z9aOw&at=${lat},${lng}&pretty`)
const predictHq = (lat, lng) => {
  const timeBound = moment().format('YYYY-MM-DD')
  return axios.get(`https://api.predicthq.com/v1/events/?within=3000m@${lat},${lng}&start.gte=${encodeURIComponent(timeBound)}&start.lte=${encodeURIComponent(timeBound)}`, {
    headers: {Authorization: `Bearer BZUy6O3xXmDzy52CWkr8OqqyM0Hzii`}
  })
}
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
  pub: [
    'Have a drink at',
    'Have a shot of tequila at',
    'Have a pint of stout at',
    'Have a pint of ale at',
    'Have a cider at',
    'Have a whisky on the rocks at',
    'Check out the beer selection at'
  ],
  park: [
    'Go for a run at',
    'Go for a walk at',
    'Go feed some squirrels at',
    'Strike up a conversation with a stranger at'
  ],
  place_of_worship: [
    'Kneel and praise sukaldari in',
    'Talk to a religious leader at',
    'Contemplate the universe at',
    'Look at the facade of',
    'Get into a religious argument at'
  ],
  supermarket: [
    'Buy a whole chicken from',
    `Spend exactly ${Number.parseFloat(Math.random() * 20).toFixed(2)} at`,
    'Check out the beer selection at'
  ]
}
const nokiaHereLang = {
  'snacks-fast-food': [
    'Buy a stranger something from',
    'Pick up and then put down everything in the self service section of'
  ],
  'restaurant': [
    'Buy the second most expensive main at',
    'Buy the vegetarian option at',
    'Buy 4 starters at',
    'Sit down, and only order a packet of crisps at',
    'Flirt with the waitstaff at'
  ],
  'going-out': [
    'Order three Irish Carbombs at'
  ],
  'food-drink': [
    'Go have a cup of coffee at',
    'Go have a sandwich at',
    'Go do 10 pushups at'
  ],
  'dance-night-club': [
    'Take somebody home from',
    'Dance until closing time at',
    'Talk to at least 20 strangers at'
  ],
  'bar-pub': [
    'Go ask the barman to serve you what he would serve a fratparty on spring break, at',
    'Go talk to three strangers at',
    'Have a drink of your choice at'
  ]
}

const wildCardLang = [
  'Run into the nearest open door and howl like a wolf.',
  'Follow the next stranger you see without speaking for 10 minutes',
  'Do 10 pushups',
  "Ask the next person you see for their phone number in batman's voice",
  'Scream the lyrics to Shakira - Whenever Wherever at the top of your voice. Immitate the dance moves'
]

const generateSuggestion = (lat, lng) => {
  console.log(lat, lng)
  const apiTypes = ['locationIq', 'zomato', 'wildcard', 'cinema', 'nokia', 'predictHq']
  const api = randomizer(apiTypes)

  switch (api) {
    case 'locationIq':
      const buildingType = randomizer(locationIqBuildingTypes)
      return locationIqCommon(lat, lng, buildingType).then(response => {
        const buildings = response.data
        console.log('buildings.data', buildings)
        const building = randomizer(buildings)
        console.log('building', building)
        return `${randomizer(locationIqLang[buildingType])} ${building.name}, location ${building.lat}, ${building.lon}`
      }).catch(e => {
        console.log('e', e)
        return randomizer(wildCardLang)
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
        return randomizer(wildCardLang)
      })
    case 'nokia':
      return nokiaFetchLandmarks(lat, lng)
        .then(response => {
          const filteredItems = response.data.results.items.filter((item) => {
            if (item.openingHours && item.openingHours.text) {
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
          return `${randomizer(nokiaHereLang[categoryId])} ${title}. Located at: ${vicinity}`
        })
    case 'predictHq':
      return predictHq(lat, lng).then(result => {
        const items = result.data.results
        console.log('items', items)
        const item = randomizer(result.data.results)
        console.log('item', item)
        return reverseGeocode(item.location[1], item.location[0]).then(res => {
          return `Go watch ${item.title} \n starting ${moment.tz(item.start, item.timezone).format('HH:mm')} \n at ${res.data.display_name}`
        })
      }).catch(e => {
        console.log('e', e)
        return randomizer(wildCardLang)
      })
    case 'wildcard':
      return Promise.resolve().then(() => {
        return randomizer(wildCardLang)
      })
  }
}

module.exports = {
  generateSuggestion: generateSuggestion
}
