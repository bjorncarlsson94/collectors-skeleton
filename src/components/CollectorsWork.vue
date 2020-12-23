<template>
  <div class="work">
    <div class="workgrid">
      <!-- <h1>{{ labels.workTitle }}</h1>
    <button id="helpButton" value="?" v-on:click="helpButtonPressed"></button> -->
      <button class="workslot5" v-on:click="recycleBottle4thRound"></button>
      <button class="workslot4" v-on:click="recycleBottle"></button>
      <button class="workslot3" v-on:click="drawTwoCards"></button>
      <button
        class="workslot2"
        v-on:click="drawACardAndFirstPlayerToken"
      ></button>
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
    workPlacement: Array, //Finns en flaska här? true/false
    //drawTwoCards = 0
    //drawACardAndFirstPlayerToken = 0
    //drawCardAndPassiveIncome = 0
  },
  methods: {
    //  (this.workPlacement[0] === false) detta är en fuling quick fix tänk silvertejp. Det funkar det är det viktigaste än så länge.
    helpButtonPressed: function () {},
    //Lägg en flaska här och dra 2st kort
    drawTwoCards: function () {
      console.log(this.workPlacement);
      if ((this.workPlacement[0] === false) && this.player.bottles > 0) {
        console.log("Kraschar innan this.workPlacement");
        this.$emit("workDrawTwoCards");
        this.placeWorker(0);
      } else {
        alert("Antingen för få flaskor eller så är platsen upptagen");
      }
    },
    //Lägg en flaska här och dra ett kort samt ta First Player Token
    drawACardAndFirstPlayerToken: function () {
      if ((this.workPlacement[1] === false) && this.player.bottles > 0 && !this.player.firstPlayerToken) {
        this.$emit("drawACardAndFirstPlayerToken");
        this.placeWorker(1);
      } else {
        alert("Antingen för få flaskor eller så är platsen upptagen");
      }
    },
    //Lägg en flaska här och dra ett kort samt ett kort som passiv inkomst
    drawCardAndPassiveIncome: function () {
      console.log(this.workPlacement[2]);
      if ((this.workPlacement[2] === false) && this.player.bottles > 0) {
        this.$emit("drawCardAndPassiveIncome");
        this.placeWorker(2);
      } else {
        alert("Antingen för få flaskor eller så är platsen upptagen");
      }
    },
    //Panta en flaska så får du en peng, går att gö hur många gånger som helst
    recycleBottle: function () {
      //Här ska en flaska växlas för pengar
      //Än så länge är inte den där spess panten för 4de omgången impelemterad!!!!
      console.log("pant knappen trycks");
      if (this.round === 4) {
        alert("Round 4 use special action!");
        return;
      }
      if (this.player.bottles > 0) {
        console.log("player bottles > 0");
        this.$emit("recycleBottle");
      } else {
        alert("Too few bottles :^(");
      }
    },
    //På fjärde omgången kan du panta en flaska och få 3 pengar ist
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
    placeWorker: function (where) {
      console.log("setWorkPlacement");
      this.$emit("placeWorker", where);
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
  grid-column: 2;
  grid-row: 2 / span 2;
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
