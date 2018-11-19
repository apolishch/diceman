<template>
  <div>
    <img src="/assets/DicemanLogo.png" alt="Logo"/>

    <!--
        <div>
        <button @click="getCurrentLocation">Get My Location</button>
        </div>
    -->

    <div>
      <label for="location">Co ordinates</label>
      <input name="location" type="text" v-model="location"/>

      <button class="rollButton" @click="rollDice">
        <img src="/assets/location-icon.png" alt="location"/>
        Invoke My Location
      </button>
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

    mounted () {
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
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.rollButton {
    display: block;
    margin: 20px auto;
    padding: 18px 25px;
    background-color: #4A90E2;
    border: 1px solid white;
    border-radius: 3px;
    color: white;
    vertical-align: middle;
}

.rollButton img {
    height: 18px;
    vertical-align: middle;
}

</style>
