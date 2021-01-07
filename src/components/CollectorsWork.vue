<template>
  <div class="work">
    <div class="workgrid">
      <!-- <h1>{{ labels.workTitle }}</h1>
    <button id="helpButton" value="?" v-on:click="helpButtonPressed"/> -->
      <button
        class="workslot"
        id="workslot5"
        :style="{ backgroundImage: 'url(' + getWorkslot5Image() + ')' }"
        v-on:click="recycleBottle4thRound"
      />
      <button
        class="workslot"
        id="workslot4"
        v-on:click="recycleBottle"
      />
      <button
        class="workslot"
        id="workslot3"
        v-on:click="drawTwoCards"
      />
      <button
        class="workslot"
        id="workslot2"
        v-on:click="drawACardAndFirstPlayerToken"
      />
      <button
        class="workslot"
        id="workslot1"
        v-on:click="drawCardAndPassiveIncome"
      />
    </div>
    <div
      class="bottlePlace"
      id="workBottle0"
      v-if="this.workPlacement.drawTwoCards !== null"
      :style="{
        backgroundColor: players[this.workPlacement.drawTwoCards].color,
      }"
    ></div>
    <div
      class="bottlePlace"
      id="workBottle1"
      v-if="this.workPlacement.drawACardAndFirstPlayerToken !== null"
      :style="{
        backgroundColor:
          players[this.workPlacement.drawACardAndFirstPlayerToken].color,
      }"
    ></div>
    <div
      class="bottlePlace"
      id="workBottle2"
      v-if="this.workPlacement.drawCardAndPassiveIncome !== null"
      :style="{
        backgroundColor:
          players[this.workPlacement.drawCardAndPassiveIncome].color,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "CollectorsWork",
  components: {},
  props: {
    labels: Object,
    player: Object,
    players: Object,
    round: Number,
    workPlacement: Object, //Finns en flaska här? true/false
    //drawTwoCards = 0
    //drawACardAndFirstPlayerToken = 0
    //drawCardAndPassiveIncome = 0
  },
  methods: {
    //  (this.workPlacement[0] === false) detta är en fuling quick fix tänk silvertejp. Det funkar det är det viktigaste än så länge.
    helpButtonPressed: function() {},
    //Lägg en flaska här och dra 2st kort
    drawTwoCards: function() {
      console.log(this.workPlacement);
      if (this.workPlacement.drawTwoCards === null && this.player.bottles > 0) {
        this.applySkills();
        this.$emit("workDrawTwoCards");
        this.placeWorker("drawTwoCards");
      } else {
        alert("Antingen för få flaskor eller så är platsen upptagen");
      }
    },
    //Lägg en flaska här och dra ett kort samt ta First Player Token
    drawACardAndFirstPlayerToken: function() {
      if (
        this.workPlacement.drawACardAndFirstPlayerToken === null &&
        this.player.bottles > 0 &&
        !this.player.firstPlayerToken
      ) {
        this.applySkills();
        this.$emit("drawACardAndFirstPlayerToken");
        this.placeWorker("drawACardAndFirstPlayerToken");
      } else {
        alert("Antingen för få flaskor eller så är platsen upptagen");
      }
    },
    //Lägg en flaska här och dra ett kort samt ett kort som passiv inkomst
    drawCardAndPassiveIncome: function() {
      console.log("workPlacement:");
      console.log(this.workPlacement);
      console.log("----------------");
      if (
        this.workPlacement.drawCardAndPassiveIncome === null &&
        this.player.bottles > 0
      ) {
        this.applySkills();
        this.$emit("drawCardAndPassiveIncome");
        this.placeWorker("drawCardAndPassiveIncome");
      } else {
        alert("Antingen för få flaskor eller så är platsen upptagen");
      }
    },
    //Panta en flaska så får du en peng, går att gö hur många gånger som helst
    recycleBottle: function() {
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
    recycleBottle4thRound: function() {
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
    placeWorker: function(where) {
      console.log("setWorkPlacement");
      this.$emit("placeWorker", where);
    },
    applySkills: function() {
      console.log("applySKills()");
      var extraCard = false;
      var extraMoney = false;
      let cards = this.player.skills;
      for (var i = 0; i < this.player.skills.length; i++) {
        console.log(cards[i].skill);
        if (cards[i].skill === "workerIncome" && !extraMoney) {
          console.log("workerIncome applied");
          extraMoney = true;
          this.$emit("addMoney", 2);
        } else if (cards[i].skill === "workerCard" && !extraCard) {
          extraCard = true;
          console.log("workerCard applied");
          this.$emit("drawCard");
        }
      }
      console.log("*************")
    },
    getWorkslot5Image: function() {
      // quarter_tile_1st.png, quarter_tile_2nd.png, quarter_tile_3rd.png, Work5_png.png
      switch (this.round) {
        case 0:
          return "/images/quarter_tile_1st.png";
        case 1:
          return "/images/quarter_tile_1st.png";
        case 2:
          return "/images/quarter_tile_2nd.png";
        case 3:
          return "/images/quarter_tile_3rd.png";
        case 4:
          return "/images/Work5_png.png";
      }
    },
    /*showPopup: function(typeOfAlert){
      if(typeOfAlert=="aaa"){


      }else if(typeOfAlert=="aa"){


      }
      else if(typeOfAlert=="aaaa"){

        
      }
      else if(typeOfAlert=="aaaaa"){

        
      }
      else if(typeOfAlert=="aaaaa"){

        
      }

    }*/
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
  position: relative;
}

.workgrid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 5vw 5vw 5vw 5vw 5vw;
  grid-gap: 0.5vw;
  padding: 1.5vw;
  position: relative;
}
.workgrid div {
  background-color: rgb(207, 207, 207);
  border-radius: 1vw;
  border-style: dotted;
  border-color: black;
  height: 5vw;
  width: auto;
  position: relative;
}

.workslot:hover {
  background-color: rgb(177, 177, 177);
}

#workslot1 {
  background-image: url("/images/Work1_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 5;
}
#workslot2 {
  background-image: url("/images/Work2_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 4;
}
#workslot3 {
  background-image: url("/images/Work3_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 3;
}
#workslot4 {
  background-image: url("/images/Work4_png.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 2;
}
/*
  quarter_tile_1st.png, quarter_tile_2nd.png, quarter_tile_3rd.png, Work5_png.png
*/
#workslot5 {
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  grid-row: 1;
}
.bottlePlace {
  background-image: url(/images/player-bottle.png);
  margin-top: 0.5vw;
  height: 3vw;
  width: 3vw;
  background-color: black;
  border-radius: 1.5vw;
  z-index: 60;
  position: absolute;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
#workBottle0 {
  top: 43%;
  left: 16%;
}
#workBottle1 {
  top: 61%;
  left: 16%;
}
#workBottle2 {
  top: 80%;
  left: 16%;
}
</style>
