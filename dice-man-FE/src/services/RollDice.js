import Api from '@/services/Api'

export default {
  getEvent (coords) {
    return Api().post('/roll', coords)
  },

  getCoords (search) {
    return Api().get('/geocode', {
      params: {
        search: search
      }
    })
  }
}
