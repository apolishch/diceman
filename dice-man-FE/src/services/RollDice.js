import Api from '@/services/Api'

export default {
  getEvent (coords) {
    return Api().get('/roll', coords)
  }
}