<template>
  <div class="work">
    <div class="workgrid">
      <!-- <h1>{{ labels.workTitle }}</h1>
    <button id="helpButton" value="?" v-on:click="helpButtonPressed"/> -->
      <button
        class="workslot"
        id="workslot5"
        :style="{ backgroundImage: 'url(' + getWorkslot5Image() + ')' }"
        v-on:click="quarterTilePressed"
      ><span v-if="quarterTilePressedActive" class="tooltiptext">{{labels.noBottles}}</span> </button>
      <button class="workslot" id="workslot4" v-on:click="recycleBottle"><span v-if="recycleBottleActive" class="tooltiptext">{{labels.noBottles}}</span> </button>
      <button class="workslot" id="workslot3" v-on:click="drawTwoCards"><span v-if="drawTwoCardsActive" class="tooltiptext">{{labels.noBottles}}</span> </button>
      <button
      
        class="workslot"
        id="workslot2"
        v-on:click="drawACardAndFirstPlayerToken"
      ><span v-if="drawACardAndFirstPlayerTokenActive" class="tooltiptext">{{labels.noBottles}}</span> </button>
      <button
        class="workslot"
        id="workslot1"
        v-on:click="drawCardAndPassiveIncome"
      ><span v-if="drawCardAndPassiveIncomeActive" class="tooltiptext">{{labels.noBottles}}</span> </button>
    </div>
    <div
      class="bottlePlace"
      id="workBottle0"
      v-if="this.workPlacement.drawTwoCards !== null"
      :style="{
        backgroundColor: players[this.workPlacement.drawTwoCards].color,
      }"
    />
    <div v-else />
    <div
      class="bottlePlace"
      id="workBottle1"
      v-if="this.workPlacement.drawACardAndFirstPlayerToken !== null"
      :style="{
        backgroundColor:
          players[this.workPlacement.drawACardAndFirstPlayerToken].color,
      }"
    />
    <div v-else />
    <div
      class="bottlePlace"
      id="workBottle2"
      v-if="this.workPlacement.drawCardAndPassiveIncome !== null"
      :style="{
        backgroundColor:
          players[this.workPlacement.drawCardAndPassiveIncome].color,
      }"
    />
    <div v-else />
    <div
      class="bottlePlace"
      id="workBottle5"
      v-if="this.workPlacement.quarterTile !== null"
      :style="{
        backgroundColor: players[this.workPlacement.quarterTile].color,
      }"
<<<<<<< HEAD
    />
    <div v-else />
=======
    ></div>
   
>>>>>>> 89717a6fae13268e4dfa93db01db288b96337e22
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
  data:function(){
    return{
      popUpTestActiveBol:false,
      drawCardAndPassiveIncomeActive:false,
      drawACardAndFirstPlayerTokenActive:false,
      drawTwoCardsActive:false,
      recycleBottleActive:false,
      quarterTilePressedActive:false,
    }

  },
  methods: {
    //  (this.workPlacement[0] === false) detta är en fuling quick fix tänk silvertejp. Det funkar det är det viktigaste än så länge.
    helpButtonPressed: function() {},
    //Lägg en flaska här och dra 2st kort
    drawTwoCards: function() {
      if (!this.player.turn) {
        return;
      }
      if (this.workPlacement.drawTwoCards === null && this.player.bottles > 0) {
        this.applySkills();
        this.$emit("workDrawTwoCards");
        this.$emit("addMoney", 1);
        this.placeWorker("drawTwoCards");
      } else {
         this.drawTwoCardsActive=!this.drawTwoCardsActive;
        
      }
    },
    //Lägg en flaska här och dra ett kort samt ta First Player Token
    drawACardAndFirstPlayerToken: function() {
<<<<<<< HEAD
      if (!this.player.turn) {
        return;
      }
=======
      
      
>>>>>>> 89717a6fae13268e4dfa93db01db288b96337e22
      if (
        this.workPlacement.drawACardAndFirstPlayerToken === null &&
        this.player.bottles > 0 &&
        !this.player.firstPlayerToken
      ) {
        this.applySkills();
        this.$emit("drawACardAndFirstPlayerToken");
        this.placeWorker("drawACardAndFirstPlayerToken");
      } else {
         this.drawACardAndFirstPlayerTokenActive=!this.drawACardAndFirstPlayerTokenActive;
        
      }
    },
    //Lägg en flaska här och dra ett kort samt ett kort som passiv inkomst
    drawCardAndPassiveIncome: function() {
      if (!this.player.turn) {
        return;
      }
      if (
        this.workPlacement.drawCardAndPassiveIncome === null &&
        this.player.bottles > 0
      ) {
        this.applySkills();
        this.$emit("drawCardAndPassiveIncome");
        this.placeWorker("drawCardAndPassiveIncome");
      } else {
        
         this.drawCardAndPassiveIncomeActive=!this.drawCardAndPassiveIncomeActive;
         
      }
    },
    //Panta en flaska så får du en peng, går att gö hur många gånger som helst
    recycleBottle: function() {
      if (!this.player.turn) {
        return;
      }
      if (this.round === 4) {
         this.popUpTestActive();
        alert("Round 4 use special action!");
        return;
      }
      if (this.player.bottles > 0) {
        console.log("player bottles > 0");
        this.$emit("recycleBottle");
      } else {
        
        this.recycleBottleActive=!this.recycleBottleActive;
        
      }
    },
    //På fjärde omgången kan du panta en flaska och få 3 pengar ist
    quarterTilePressed: function() {
      
      if(this.player.bottles==0){
        
        this.quarterTilePressedActive=!this.quarterTilePressedActive;

      }
      switch (this.round) {
        case 0:
          break;
        case 1:
          if (!this.player.turn) {
            return;
          }
          if (
            this.player.bottles > 0 &&
            this.workPlacement.quarterTile === null
          ) {
            this.$emit("addPassiveIncome", 2);
            this.placeWorker("quarterTile");
            this.nextPlayer();
          }
          break;
        case 2:
          if (!this.player.turn) {
            return;
          }
          if (
            this.player.bottles > 0 &&
            this.workPlacement.quarterTile === null
          ) {
            this.$emit("addPassiveIncome", 2);
            this.$emit("addMoney", 1);
            this.placeWorker("quarterTile");
            this.nextPlayer();
          }
          break;
        case 3:
          if (!this.player.turn) {
            return;
          }
          if (
            this.player.bottles > 0 &&
            this.workPlacement.quarterTile === null
          ) {
            this.$emit("addPassiveIncome", 2);
            this.$emit("addMoney", 2);
            this.placeWorker("quarterTile");
            this.nextPlayer();
          }
          break;
        case 4:
          if (!this.player.turn) {
            return;
          }
          if (this.player.bottles > 0) {
            this.$emit("recycleBottle4thRound");
            this.nextPlayer();
          }
          break;
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
      console.log("*************");
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
    popUpTestActive:function(){
      
      console.log("kom hit");
      this.popUpTestActiveBol=true;

    }
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
  border-radius: 3vw;
  z-index: 2;
  border-style: ridge;
  box-shadow: 0.1vw 0.1vw rgba(0, 0, 0, 0.692);
  border-width: 0.2vw;
  border-color: rgba(77, 58, 58, 0.658);
  position: absolute;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.tooltiptext {
  -webkit-animation: fadeinout 3s linear forwards;
    animation: fadeinout 3s linear forwards;
    opacity: 0;
  width: 120px;
  background-color: rgba(66, 57, 57, 0.897);
  color: #fff;
  position: absolute;
  border-radius: 6px;
  right: -50%;
  padding: 5px 0;
  float:right;
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
#workBottle5 {
  top: 7%;
  left: 16%;
}
@-webkit-keyframes fadeinout {
  25%{opacity:1;}
  50% { opacity: 1; }
}

@keyframes fadeinout {
  25%{opacity:1;}
  50% { opacity: 1; }
}

</style>
