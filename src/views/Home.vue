<template>
  <div class="center">
    <div>
      <h1>Collectors</h1>
      <ul>
        <li class="gameSetUp" v-for="i in 3" :key="i">
          <a @click="setupCollectors(i+1, 'en')">Set up a game of Collectors for {{i+1}} players</a>.
        </li>
      </ul>

      <br>
      
      <ul>
        <li class="gameSetUp" v-for="i in 3" :key="i">
          <a @click="setupCollectors(i+1, 'se')">Spela Collectors med {{i+1}} spelare</a>.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  created: function () {
    this.$store.commit('SET_ROOM_ID');
  },
  methods: {
    setupCollectors: function (playerCount, lang="en") {
      this.$store.commit('SETUP_GAME', {roomId: this.$store.state.roomId, 
        playerCount: playerCount,
        lang: lang });
      this.$router.push("/room/" + this.$store.state.roomId);
    },
  }
}
</script>
<style scoped>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 1em;
  }

  .gameSetUp{
    background-color:rgb(212, 129, 129);
    width: 15vw;
    border-radius: 15vh;
    padding: 0.5vw;
    margin: 1vw;
  }
  
</style>
