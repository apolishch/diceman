<template>
  <div id="app">
    <roll-dice/>
  </div>
</template>

<script>
import RollDice from './components/RollDice'

export default {
  name: 'app',
  components: {
    'roll-dice': RollDice
  }
}
</script>

<style>
body {
  overflow: hidden;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: url('/assets/Diceman-background.png') no-repeat center;
  background-size: cover;
  height: 100vh;
}

img {
  width: 100%;
  height: auto;
}
</style>
