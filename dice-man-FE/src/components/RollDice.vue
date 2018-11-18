<template>
  <div>
    <h1>Roll the dice</h1>
    <div>
      <button @click="getCurrentLocation">Get my location</button>
    </div>
    <div>
      <label for="location">Co ordinates</label>
      <input name="location" type="text" v-model="location"/>
      <button @click="rollDice">roll</button>
    </div>
    <template v-if="rollResult">
      <div class="event-card">
        <h2>{{ rollResult }}</h2>
        <!-- <h1>{{ rollResult.name }}</h1>
        <img :src="rollResult.featured_image"> -->
      </div>
    </template>
    <div v-if="loading" class="loading">
      <h1>Loading...</h1>
    </div>
  </div>
</template>

<script>
import RollDice from '@/services/RollDice'

  export default {
    data () {
      return {
        loading: false,
        location: null,
        long: null,
        lat: null,
        accuracy: null,
        rollResult: null
      }
    },
    created () {
      this.getCurrentLocation()
    },
    methods: {
      async rollDice () {
        // const coords = { lat: this.lat, long: this.long }
        const coords = this.location.split(',')
        const coordsObj = {
          lat: coords[0],
          lng: coords[1]
        }
        const result = await RollDice.getEvent(coordsObj)
        this.rollResult = result.data
      },
      getCurrentLocation () {
        this.loading = true
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
        navigator.geolocation.getCurrentPosition(this.success, this.error, options)
      },
      error (error) {
        console.error(`ERROR(${error.code}): ${error.message}`)
        this.loading = false
      },
      success (pos) {
        const crd = pos.coords
        this.lat = crd.latitude
        this.long = crd.longitude
        this.accuracy = crd.accuracy
        this.location = `${this.lat},${this.long}`
        this.loading = false
      }
    }
  }
</script>

<style scoped>
.loading {
  position: absolute;
  width: 100vh;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}
</style>