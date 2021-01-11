<template>
  <div class="center">
    <div>
      <div class="outer">
      <h1>Collectors</h1>
        <div class="gameSetUp" v-for="i in 3" :key="i"> 
          <button class="buttons" @click="setupCollectors(i+1, 'en')">Set up a game of Collectors for {{i+1}} players</button>
        </div>
      <br>
        <div>
          <div class="gameSetUp" v-for="i in 3" :key="i">
            <button class="buttons" @click="setupCollectors(i+1, 'se')">Spela Collectors med {{i+1}} spelare</button>
          </div>
        </div>
        <br>
        <div class="gameSetUp"> 
          <button class="buttons" onClick="window.open('https://youtu.be/EBf3e07n5yk');">Click here for tutorial</button>
          </div> 
      </div>
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
    setupCollectors: function (playerCount, lang) {
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
    background-image: url("/images/collectors-cards-new.png");
  }
  .outer{
    width: 25vw;
    background-color: rgb(103, 151, 223);
    border-radius: 1vw;
    padding: 2vw;
    z-index: 20;
    border-style:solid;
    border-width: 0.5vw;
    border-color: rgb(66, 66, 66);
  }
  .gameSetUp{
    width: 20vw;
    border-radius: 15vh;
    padding: 0.5vw;
  }
  .buttons{
    display:inline-block;
    color: black;
    background-color: rgb(206, 210, 255);
    border-radius:1vw;
    box-shadow: 0 0.3vw rgb(101, 105, 151);
    cursor: pointer;
    font-size: 1vw;
    z-index: 20;
  }
  .buttons:active{
    background-color: rgb(255, 178, 149);
    box-shadow: 0 0.2vw rgb(101, 105, 151);
    transform: translateY(0.1vw);
  }
  .buttons:hover{
    background-color: rgb(255, 182, 155);
  }
  
</style>
