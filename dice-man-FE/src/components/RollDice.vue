<template>
  <div class="rollDicePage">

    <!--
        <div>
        <button @click="getCurrentLocation">Get My Location</button>
        </div>
    -->

    <div class="locationWrapper">
      <div class="dicemanLogoWrapper">
        <img src="/assets/DicemanLogo.png" alt="Logo"/>
      </div>
      <div class="row">
        <div class="col-md-5">
          <button class="primaryButton" @click="getCurrentLocation">
            <img src="/assets/location-icon.png" alt="location"/>
            Invoke My Location
          </button>
        </div>

        <div class="col-md-7">
          <button class="primaryButton searchButton" @click="searchLocation">
            <img src="/assets/search-icon.png" alt="location"/>
            Invoke Search
          </button>
        </div>
      </div>
    </div>

    <div>
        <label for="search">Search Location</label>
        <input name="search" type="text" v-model="search"/>
    </div>

    <div class="locationDisplay">
      <span>
        {{ location }}
      </span>
    </div>

    <div @click="rollDice">
      <DiceButton/>
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
import DiceButton from '@/components/DiceButton'
import RollDice from '@/services/RollDice'

  export default {
    components: {
      DiceButton
    },

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
        const searchQuery = pos && pos.coords ? `${pos.coords.latitude}, ${pos.coords.longitude}` : this.search
        if (searchQuery) {
          const searchResult = await RollDice.searchLocation(searchQuery)
          this.lat = searchResult.data.lat
          this.lng = searchResult.data.lng
          this.location = searchResult.data.displayName
        } else {
          this.location = 'Invalid Search'
        }
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

.locationWrapper {
  padding: 10% 20% 40px 20%;
}

.dicemanLogoWrapper {
  margin-bottom: 30px;
}

.locationDisplay {
  margin: 10px;
}

.primaryButton {
    display: block;
    margin: 20px auto;
    padding: 18px 25px;
    background-color: #4A90E2;
    border: 1px solid white;
    border-radius: 8px;
    color: white;
    vertical-align: middle;
    width: 100%;
}

.primaryButton.searchButton {
  background-color: RGBA(77, 144, 226, 0.24)
}

.primaryButton img {
    width: 18px;
    vertical-align: middle;
}

</style>
