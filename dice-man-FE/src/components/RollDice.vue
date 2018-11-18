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
    <div>
      <span>{{ long }}</span>,<span>{{ lat }}</span>
    </div>
    <template v-if="rollResult">
      <div class="event-card">
        <h1>{{ rollResult.name }}</h1>
        <img :src="rollResult.featured_image">
      </div>
    </template>
  </div>
</template>

<script>
import RollDice from '@/services/RollDice'

  export default {
    data () {
      return {
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
        const coords = {
          lat: this.lat,
          long: this.long
        }
        const result = await RollDice.getEvent(coords)
        this.rollResult = result.data.restaurant
      },
      getCurrentLocation () {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
        navigator.geolocation.getCurrentPosition(this.success, this.error, options)
      },
      error(error) {
        console.error(`ERROR(${error.code}): ${error.message}`)
      },
      success (pos) {
        const crd = pos.coords
        this.lat = crd.latitude
        this.long = crd.longitude
        this.accuracy = crd.accuracy
      }
    }
  }
</script>

<style scoped>
.event-card {
}
</style>