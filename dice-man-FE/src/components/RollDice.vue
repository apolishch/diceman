<template>
  <div>
    <h1>Roll the dice</h1>
    <button @click="getCurrentLocation">get my location</button>
    <input type="text" v-model="location"/>
    <button @click="rollDice($event)">roll</button>
    <div>
      <span>{{ long }}</span>
      <span>{{ lat }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        location: null,
        long: null,
        lat: null,
      }
    },
    methods: {
      rollDice (location) {
        console.log(location)
      },
      getCurrentLocation () {
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        function success(pos) {
          const crd = pos.coords
          console.log('success')
          console.log(crd.latitude)
          console.log(crd.longitude)
          this.lat = crd.latitude
          this.long = crd.longitude
          this.accuracy = crd.accuracy
        }

        function error(err) {
          console.error(`ERROR(${err.code}): ${err.message}`)
        }

        navigator.geolocation.getCurrentPosition(success, error, options)
      }
    }
  }
</script>

<style scoped lang="scss">

</style>