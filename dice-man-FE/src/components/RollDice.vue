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
            <div class="row buttonStyling">
              <div class="col-md-2">
                <img src="/assets/location-icon.png" alt="location"/>
              </div>
              <div class="col-md-8">
                <span>
                  Invoke My Location
                </span>
              </div>
            </div>
          </button>
        </div>

        <div class="col-md-7">
          <div class="primaryButton searchButton">
            <div class="row buttonStyling">
              <div class="col-md-2">
                <button class="searchIconButton" @click="searchLocation">
                  <img src="/assets/search-icon.png" alt="location"/>
                </button>
              </div>
              <div class="col-md-10">
                <input class="searchInput text-center text-md-left" name="search" type="text" placeholder="Search For My Location" v-model="search" @keyup.enter="searchLocation"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="locationDisplay">
        <span>
          You are here: {{ location }}
        </span>
        <span v-if="lat">
          ({{ lat }}, {{ lng }})
        </span>
      </div>
      <div @click="rollDice">
        <DiceButton/>
      </div>
      <template v-if="rollResult">
        <div class="event-card">
          <blockquote class="blockquote text-right">
            <p v-html="rollResult" class="mb-0"/>
            <footer class="blockquote-footer dicemanFooter">The Diceman</footer>
          </blockquote>
        </div>
      </template>
    </div>

    <div v-if="loading" class="loading">
      <!-- <h1>Loading...</h1> -->
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
        this.loading = true
        try {
          const eventResult = await RollDice.getEvent({
            lat: this.lat,
            lng: this.lng
          })
          console.log('eventResult', eventResult)
          this.rollResult = eventResult.data
          this.loading = false
        } catch (e) {
          console.log(e)
          this.rollResult = 'I implore you to roll again'
          this.loading = false
        }
      },

      async getCurrentLocation () {
        this.loading = true
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
        this.loading = false
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
  color: none;
}

.locationWrapper {
  padding: 10% 20% 40px 20%;
}

.dicemanLogoWrapper {
  margin-bottom: 30px;
}

.locationDisplay {
  margin: 30px 30px 0px 30px;
}

.buttonStyling {
  align-items: center;
}

.searchInput {
  color: white;
  border: none;
  width: 100%;
  background-color: RGBA(0, 0, 0, 0);
  /* text-align: center; */
}

.searchInput::placeholder {
  color: white;
  /* text-align: center; */
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

.searchIconButton {
  background-color: RGBA(0, 0, 0, 0);
  border: none;
}

.event-card {
  font-size: 2rem;
  font-weight: 500;
}

.primaryButton img {
    width: 18px;
    vertical-align: middle;
}

.dicemanFooter {
  color: white;
}

/* .blockquote {
  p:before {
    content: "&amp;"
    font-size: 3rem;
    font-weight: 900;
  }
} */

</style>
