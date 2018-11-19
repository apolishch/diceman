import Api from '@/services/Api'

export default {
  getEvent (coords) {
    return Api().post('/roll', coords)
  },

  searchLocation (search) {
    return Api().get('/geocode', {
      params: {
        search: search
      }
    })
  }
}
