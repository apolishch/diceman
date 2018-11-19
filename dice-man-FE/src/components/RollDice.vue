<template>
  <div class="rollDicePage">
    <div class="dicemanLogoWrapper">
      <img src="/assets/DicemanLogo.png" alt="Logo"/>
    </div>

    <!--
        <div>
        <button @click="getCurrentLocation">Get My Location</button>
        </div>
    -->

    <div>
      <button class="rollButton" @click="getCurrentLocation">
        <img src="/assets/location-icon.png" alt="location"/>
        Invoke My Location
      </button>

      <button class="rollButton" @click="searchLocation">
        <img src="/assets/location-icon.png" alt="location"/>
        Invoke Search
      </button>

      <span>
        {{ location }}
      </span>
    </div>

    <div>
        <label for="search">Search Location</label>
        <input name="search" type="text" v-model="search"/>
    </div>

    <button class="rollButton" @click="rollDice">
      <img src="/assets/location-icon.png" alt="location"/>
      His will be done
    </button>

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
        search: null,
        loading: false,
        location: 'Nowhere',
        lng: null,
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
        const eventResult  = await RollDice.getEvent({
          lat: this.lat,
          lng: this.lng
        })
        this.rollResult = eventResult.data
      },

      async getCurrentLocation () {
        // this.loading = true
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
        await navigator.geolocation.getCurrentPosition(this.searchLocation, this.error, options)
      },

      async searchLocation (pos) {
        console.log('search', pos && pos.coords ? `${pos.coords.latitude}, ${pos.coords.longitude}` : this.search)
        const searchResult = await RollDice.searchLocation(pos && pos.coords ? `${pos.coords.latitude}, ${pos.coords.longitude}` : this.search)
        this.lat = searchResult.data.lat
        this.lng = searchResult.data.lng
        this.location = searchResult.data.displayName
      },

      error (error) {
        console.error(`ERROR(${error.code}): ${error.message}`)
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

.dicemanLogoWrapper {
  margin-bottom: 10px;
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
    width: 18px;
    vertical-align: middle;
}

</style>
