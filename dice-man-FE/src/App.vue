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
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
