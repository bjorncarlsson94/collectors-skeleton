<template>
  <div class="work">
    <div class="workgrid">
      <!-- <h1>{{ labels.workTitle }}</h1>
    <button id="helpButton" value="?" v-on:click="helpButtonPressed"></button> -->
      <button class="workslot5" v-on:click="recycleBottle4thRound"></button>
      <button class="workslot4" v-on:click="recycleBottle"></button>
      <button class="workslot3" v-on:click="drawTwoCards"></button>
      <button class="workslot2" v-on:click="drawACard"></button>
      <button class="workslot1" v-on:click="drawCardAndPassiveIncome"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CollectorsWork",
  components: {},
  props: {
    labels: Object,
    player: Object,
    round: Number,
  },
  methods: {
    helpButtonPressed: function () {},
    drawTwoCards: function () {
      this.$emit("collectorsWorkDrawTwoCards", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
    },
    drawACard: function () {
      if (this.player.bottles > 0) {
        this.$emit("drawCard");
      }
    },
    drawCardAndPassiveIncome: function () {
      console.log("Not implemented :'^(");
      if (this.player.bottles > 0) {
        //this.$emit("drawCardAndPassiveIncome");
      }
    },
    recycleBottle: function () {
      //Här ska en flaska växlas för pengar
      //Än så länge är inte den där spess panten för 4de omgången impelemterad!!!!
      console.log("pant knappen trycks");
      if (this.player.bottles > 0) {
        console.log("player bottles > 0");
        this.$emit("recycleBottle");
      } else {
        alert("Too few bottles :^(");
      }
    },
    recycleBottle4thRound: function () {
      console.log("Panta 4 trycks");
      if (this.round === 4 && this.player.bottles > 0) {
        console.log("Är runda 4 och har 1+ flaskor");
        this.$emit("recycleBottle4thRound");
      } else if (this.round !== 4) {
        alert("Not round 4");
      } else if (!(this.player.bottles > 0)) {
        alert("Too few bottles :^(");
      }
    },
  },
};
</script>

<style scoped>
/*
#helpButton {
  border-radius: 50%;
  background-color: blue;
  width: 50px;
  height: 50px;
}

.buttons {
  display: grid;
  width: 100px;
  height: 50px;
}
*/

/*OBS följande funkar inte riktigt som det ska*/

.work {
  text-align: center;
  border-radius: 2vw;
  background-color: grey;
  grid-column: 3;
  grid-row: 1 / span 2;
  height: 37vw;
  width: 15vw;
  justify-self: left;
}

.workgrid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 5vw 5vw 5vw 5vw 5vw;
  grid-gap: 2vw;
  padding: 2vw;
}
.workgrid div {
  background-color: rgb(207, 207, 207);
  border-radius: 1vw;
  border-style: dotted;
  border-color: black;
  height: 5vw;
  width: auto;
}

.workslot1 {
  background-image: url("/images/Work1_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 5;
}
.workslot2 {
  background-image: url("/images/Work2_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 4;
}
.workslot3 {
  background-image: url("/images/Work3_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 3;
}
.workslot4 {
  background-image: url("/images/Work4_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 2;
}
.workslot5 {
  background-image: url("/images/Work5_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 1;
}
</style>
