<!--Hejsan kompisar. Här är koden så att vi får ut raise value. Imorgon kommer jag sitta för att räkna hur många värden det 

Nu läggs kort in här automatiskt. Finns ingen uträkning för hur mycket poäng man får än. 

-->

<template>
  <div>
    <!--<h1>{{labels.raiseValue}}</h1>-->
    <div class="wrapper1 raiseValuegrid">
      <div class="valueGrid">
        <div v-for="values in marketOrder" :key="values">
          <div class="valueSlot">
            <img class="valueIcon" :src="getIcon(values)" />
            <p class="valueValue">
              {{ values }}
              <br />
              {{ cardCost(values) }}
            </p>
          </div>
        </div>
      </div>
      <div class="valueGrid">
        <div v-for="(p, index) in placement" :key="'A' + index">
          <button
            class="button"
            v-if="p.playerId === null"
            :disabled="notYourTurn() || cannotAfford(p.cost)"
            @click="placeBottle(p)"
          >
            ${{ p.cost }}
            {{ p.amountOfCards + labels.card }}
          </button>
          <div
            class="bottlePlace"
            :style="{ backgroundColor: players[p.playerId].color }"
            v-if="p.playerId !== null"
          ></div>
        </div>
      </div>
    </div>
    <div class="raiseCardsAvailable" v-show="aboutToRaiseValue" v-if="player">
      <h1 class="raiseValueHeadings">{{labels.pickFromPlayerBoard}}</h1>
      <div class="raiseValueCardGrid">
        <div class="cardsFromBoard">
          <div class="auctionCard">
<<<<<<< HEAD
            <h6 class="auctionOrSkill" v-if="auctionCard.market!=undefined">Välj kort från auktionspool</h6>
=======
            <h6 class="auctionOrSkill" v-if="auctionCard.market!=undefined">{{labels.pickFromAuction}}</h6>
>>>>>>> cbb5fa7162202c4bea2d4d8e87a56a6315903050
            <div class="card">
              <CollectorsCard
                :card="auctionCard"
                :availableAction="auctionCard.available"
                @doAction="raiseValueNow(auctionCard)"
              />
            </div>
          </div>
          <div class="skillCard">
<<<<<<< HEAD
            <h6 class="auctionOrSkill" v-if="skillOnSale.market!=undefined">Välj kort från skillpool</h6>
=======
            <h6 class="auctionOrSkill" v-if="skillOnSale.market!=undefined">{{labels.pickFromSkills}}</h6>
>>>>>>> cbb5fa7162202c4bea2d4d8e87a56a6315903050
            <div class="card">
              <CollectorsCard
                :card="skillOnSale"
                :availableAction="skillOnSale.available"
                @doAction="raiseValueNow(skillOnSale)"
              />
            </div>
          </div>
        </div>
      </div>
      <h1 class="raiseValueHeadings">{{labels.pickFromHand}}</h1>
      <div class="raiseValueCardGrid">
        <div
          class="cardsFromHand"
          v-for="(card, index) in player.hand"
          :key="'B' + index"
        >
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="raiseValueNow(card)"
          />
        </div>
      </div>
       <div class="buttonGrid">
<<<<<<< HEAD
               <button class="cancelBuy" @click="hideWindow()">{{labels.cancelBuy}}</button>
=======
               <button class="cancelBuy" :disabled="cantCancel" @click="hideWindow()">{{labels.cancelBuy}}</button>
>>>>>>> cbb5fa7162202c4bea2d4d8e87a56a6315903050
              </div>
    </div>
   
  </div>
  
</template>

<script>
import CollectorsCard from "@/components/CollectorsCard.vue";

export default {
  name: "CollectorsRaiseValue",
  components: {
    CollectorsCard,
  },
  data: function () {
    return {
      marketOrder: ["fastaval", "figures", "music", "movie", "tech"],
      currentPlacementAmount: null,
      currentPlacement: null,
<<<<<<< HEAD
=======
      cantCancel: false,
>>>>>>> cbb5fa7162202c4bea2d4d8e87a56a6315903050
    };
  },

  props: {
    labels: Object,
    player: Object,
    players: Object,
    raiseItems: Array,
    raiseValue: Object,
    auctionCard: Object,
    skillOnSale: Object,
    placement: Array,
    marketValues: Object,
    notYourTurn: Function,
    aboutToRaiseValue: Boolean,
    checkAmountOfRaiseValue: Function,
  },
  methods: {
    log() {
      console.log("hejsan " + this.raiseItems);
    },
    cardCost: function (values) {
      switch (values) {
        case "fastaval":
          return this.raiseValue.fastaval;
        case "figures":
          return this.raiseValue.figures;
        case "music":
          return this.raiseValue.music;
        case "movie":
          return this.raiseValue.movie;
        case "tech":
          return this.raiseValue.technology;
        default:
          return null;
      }
    },
    //Iconerna för varje kategori
    getIcon: function (category) {
      switch (category) {
        case "fastaval":
          return require("../../public/images/fastaval.png");
        case "figures":
          return require("../../public/images/figures.png");
        case "music":
          return require("../../public/images/music.png");
        case "movie":
          return require("../../public/images/movie.png");
        case "tech":
          return require("../../public/images/tech.png");
        default:
          return null;
      }
    },

    raiseValueNow: function(card){
      if(this.currentPlacementAmount === 2){
        this.$emit('raiseValueFirstCard', card);
<<<<<<< HEAD
=======
        this.cantCancel = true;
>>>>>>> cbb5fa7162202c4bea2d4d8e87a56a6315903050
        this.currentPlacementAmount = 1;
      }
      else{
        this.$emit('raiseValue', card);
<<<<<<< HEAD
=======
        this.cantCancel = false;
>>>>>>> cbb5fa7162202c4bea2d4d8e87a56a6315903050
        console.log(card, "kortet i raise value");
      }
    },

    placeBottle: function (p) {
      this.currentPlacementAmount = p.amountOfCards;
<<<<<<< HEAD
=======
      if(!this.checkAmountOfRaiseValue()){
        this.currentPlacementAmount = 1;
      }
>>>>>>> cbb5fa7162202c4bea2d4d8e87a56a6315903050
      this.currentPlacement = p;
      console.log(this.currentPlacementAmount);
      this.$emit("placeBottle", p);
      this.highlightAvailableCards(p.cost);
    },


    cannotAfford: function (cost) {
      let minCost = 100;
      for (let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key];
      }
      return this.player.money < minCost;
    },


    highlightAvailableCards: function (cost=100) {

      if (this.marketValues[this.auctionCard.item] <= this.player.money - cost) {
        this.$set(this.auctionCard, "available", true);
        this.chosenPlacementCost = cost; 
      }
      else {
        this.$set(this.auctionCard, "available", false);
        this.chosenPlacementCost = cost; 
      }
      
      if (this.marketValues[this.skillOnSale.item] <= this.player.money - cost) {
        this.$set(this.skillOnSale, "available", true);
        this.chosenPlacementCost = cost; 
      }
      else {
        this.$set(this.skillOnSale, "available", false);
        this.chosenPlacementCost = cost; 
      }

      
      for (let i = 0; i < this.player.hand.length; i += 1) {
        if (this.marketValues[this.player.hand[i].item] <= this.player.money - cost) {
          this.$set(this.player.hand[i], "available", true);
          this.chosenPlacementCost = cost;
        }
        else {
          this.$set(this.player.hand[i], "available", false);
          this.chosenPlacementCost = cost; 
        }
      }
    },

    hideWindow: function(){
      
      this.$emit('cancelBuy', this.currentPlacement);
    }
  },
};
//
//highlight last card from items and last card from auction pool and skill pool
// Highlight hand.
// If click from hand then ad it to the market pool acording to the number of seals.
// så vi behöver positions för dem. därför behöver vi in hit skicka med skillsONSale och AuctionOnSale.
//
//
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper1 {
  display: grid;
  grid-template-rows: repeat(auto-fill, 130px);
  padding-left: 0.5vw;
}
.raiseValuegrid {
  display: grid;
  grid-template-rows: 2.5vw 2.5vw 2.5vw 2.5vw 2.5vw;
  justify-self: space-evenly;
  text-align: center;
  text-align: -webkit-center;
  margin-bottom: 2vw;
}
.cardslots {
  display: grid;
  grid-row: 1;
  grid-template-rows: repeat(auto-fill, 0px);
  justify-items: center;
}
.valueSlot {
  height: auto;
  display: grid;
  color: black;
  background-color: #94b5ee;
  margin-block-start: 1em;
  margin-block-end: auto;
  border-radius: 0.5vw;
  font-size: 0.8vw;
}

.valueIcon {
  width: 1vw;
  height: 1vw;
  margin: auto;
  grid-column: 1;
}

.valueValue {
  grid-column: 2;
  margin: auto;
}
.button {
  float: left;
  font-size: 1vw;
  justify-content: space-around;
  margin: 1vw;
  padding: 0.2vw;
  color: black;
  background-color: rgb(130, 226, 255);
  border-radius: 1vw;
  box-shadow: 0 0.3vw #999;
}
.button:active {
  background-color:rgb(95, 216, 253);
  box-shadow: 0 0.2vw #999;
  transform: translateY(0.1vw);
}
.button:hover {
  background-color: rgb(95, 216, 253);
}
.bottlePlace {
  background-image: url(/images/player-bottle.png);
    height: 2.5vw;
    margin-top: 1vw;
    width: 2.5vw;
    background-color: rgb(95, 216, 253);
    border-radius: 4vw;
    border-style: ridge;
    box-shadow: 0.1vw 0.1vw rgba(0, 0, 0, 0.692);
    border-width: 0.2vw;
    border-color: rgba(77, 58, 58, 0.658);
    z-index: 60;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.valueGrid {
  display: grid;
  grid-row: 1/2;
  grid-auto-flow: row;
}

.auctionOrSkill{
  display: contents;
}

.card{
  display: grid;
  justify-content: center;
}

/*Nedan är all css för rutan man får upp vid kortköp*/
  .raiseCardsAvailable {
  display: grid;
  position: absolute;
  grid-template-rows: 10% 45% 10% auto;
  width: 60vw;
  height: 40vw;
  background-color: #cfdcf2;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-110%, -70%);  
  }

  .raiseValueCardGrid{
    display: grid;
    align-content: center;
    grid-auto-flow: column;
    grid-column: 1/6;
  }

  .raiseValueHeadings{
    justify-content: center;
    text-align: center;
    color: black;
    grid-column: 1/6;
    font-size: large;
  }

  .cardsFromBoard{
    display: grid;
    justify-items:center;
    align-items: center;
    zoom: 2;
    overflow: hidden;
    grid-auto-flow: column;
  }

  .cardsFromHand{
    display: grid;
    justify-items:center;
    align-items: center;
    zoom: 2;
    overflow: hidden;

  }
  .buttonGrid{
    color: inherit;
    justify-content: center;
    position: absolute;
    
    top: -0.15625vw;
    right: -0.078125vw;
  }


  .cancelBuy{
    border-top-right-radius: 30%;
    border:solid;
    background-color: rgb(95, 216, 253);
    filter:brightness(105%);
    width: 5.208vw;
    height: 5.208vw;
    font-size: 1vw;
    font-weight: bold;
    box-shadow: 0.0520833vw 0.26041vw 0.3125vw rgba(0, 0, 10, 2), 0 0.0520833vw 0.20833333333333334vw rgba(0, 0, 10, 0.24);
  }
  .cancelBuy:hover{
    background-color: rgb(72, 172, 202);
  }

/*
  .available-to-choose {
    animation: jiggle 1s ease-in-out;
    animation-iteration-count:infinite;
    box-shadow: 0 0 10px yellow;
  }

  @keyframes jiggle {
    0% {transform:rotate(0.5deg);}
    50% {transform:rotate(-0.5deg);}
    100% {transform:rotate(0.5deg);}
  }
*/
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
