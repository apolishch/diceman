'use strict'
const axios = require('axios')

const generateSuggestion = (lat, lng) => {
  return axios.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lng}`, { headers: { 'user-key': '7835bf209a55dcf3b85f263d75ebbf38' } }).then(res => {
    const restaurants = res.data.nearby_restaurants
    return restaurants[Math.round(Math.random() * restaurants.length)]
  })
  // return {lat, lng, idea: "Go to Dirty Dicks. Ask the barman what you would order if you were a sorority girl on hell week."}
}

module.exports = {
  generateSuggestion: generateSuggestion
}
