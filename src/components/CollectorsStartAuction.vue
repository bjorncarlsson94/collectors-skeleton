<template>
  <div>
    <!--<h1>{{ labels.startAuction }}</h1>-->
    <div class="start-auction auctiongrid">
      <div class="auctionColumn">
        <div class="cards" v-for="(card, index) in auctionCards" :key="index">
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="startAuction(card)"
          />
        </div>
        <!--{{ cardCost(card) }}-->
      </div>
      <div class="auctionColumn">
        <div class="buttons" v-for="(p, index) in placement" :key="'A' + index">
          <button class="button"
            v-if="p.playerId===null"
            :disabled="notYourTurn() || cannotAfford(p.cost)" 
            @click="placeBottle(p)" >
            ${{p.cost}}
          </button>
          <div class="bottlePlace" :style="{backgroundColor: players[p.playerId].color}" v-if="p.playerId !== null">
            <!-- {{p.playerId}} -->
          </div>
        </div>
      </div>
    </div>

    <div class="auctionCardsAvailable" v-show="aboutToStartAuction" v-if="player">
      <h1 class="startAuctionHeadings">Välj ett kort från spelplanen:</h1>
      <div class="startAuctionCardGrid">
        <div
          class="cardsFromBoard"
          v-for="(card, index) in auctionCards"
          :key="index"
        >
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="startAuction(card)"
          />
        </div>
      </div>
      <h1 class="startAuctionHeadings">Välj ett kort från handen:</h1>
      <div class="startAuctionCardGrid">
        <div
          class="cardsFromHand"
          v-for="(card, index) in player.hand"
          :key="'A' + index"
        >
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="secretOption(card)"
          />
        </div>
      </div>
      <div class="buttonGrid">
               <button class="cancelBuy" @click="hideWindow(chosenPlacementCost)">{{labels.cancelBuy}}</button>
              </div>
    </div>
    <div class="secretOptionBox" v-show="secretOptionBoxAvailable">
      <div class="secretOptionText">How do you wanna auction this card?</div>
      <button class="secretOptionBoxButton A" @click="secretChoice(false)" >Face up</button>
      <button class="secretOptionBoxButton B" @click="secretChoice(true)" >Face down</button>
    </div>
  </div>
</template>

<script>
import CollectorsCard from "@/components/CollectorsCard.vue";

export default {
  name: "CollectorsStartAuction",
  components: {
    CollectorsCard,
  },
  props: {
    labels: Object,
    player: Object,
    players: Object,
    auctionCards: Array,
    marketValues: Object,
    placement: Array,
    hiddenAuctionCard: Boolean,
    notYourTurn: Function,
    hiddenAuctionCardFN: Function,
    aboutToStartAuction: Boolean
  },
   data: function () {
      return {
        secretOptionBoxAvailable: false,
        secretOptionCard: Object,
     };
  },
  methods: {
    cannotAfford: function (cost) {
      let minCost = 100;
      for (let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key];
      }
      return this.player.money < minCost;
    },
    cardCost: function (card) {
      return this.marketValues[card.market];
    },
    placeBottle: function (p) {
      this.$emit("placeBottle", p.cost);
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost = 100) {
      for (let i = 0; i < this.auctionCards.length; i += 1) {
        if (
          this.marketValues[this.auctionCards[i].item] <=
          this.player.money - cost
        ) {
          this.$set(this.auctionCards[i], "available", true);
        } else {
          this.$set(this.auctionCards[i], "available", false);
        }
        this.chosenPlacementCost = cost;
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        if (
          this.marketValues[this.player.hand[i].item] <=
          this.player.money - cost
        ) {
          this.$set(this.player.hand[i], "available", true);
          this.chosenPlacementCost = cost;
        } else {
          this.$set(this.player.hand[i], "available", false);
          this.chosenPlacementCost = cost;
        }
      }
    },

    secretOption: function (card){
      //this.aboutToStartAuction = false;
      this.secretOptionCard = card;
      this.secretOptionBoxAvailable = true; 
      this.highlightAvailableCards(); 
    },
    secretChoice: function (ifSecret){
      if(ifSecret){
        this.hiddenAuctionCardFN();
      }
      this.$emit("startAuction", this.secretOptionCard);
      this.secretOptionBoxAvailable = false;  
    },
    startAuction: function (card) {
      if (card.available) {
        console.log(card);
        this.$emit("startAuction", card);
        this.highlightAvailableCards();
      }
    },
    hideWindow: function(cost){
      
      this.$emit('cancelBuy', cost);
    }
    // notYourTurn: function () {
    //   return (this.player.turn== false)
    // }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.start-auction {
  display: grid;
}
.button {
  float: left;
  font-size: 1vw;
  justify-content: space-around;
  margin: 2.5vw;
  padding: 0.2vw;
  color: black;
  background-color: #f5ef9e;
  border-radius: 1vw;
  box-shadow: 0 0.3vw #999;
}
.button:active {
  background-color: #d6ce58;
  box-shadow: 0 0.2vw #999;
  transform: translateY(0.1vw);
}
.button:hover {
  background-color: #d6ce58;
}
.auctiongrid {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  padding: 1vw;
}
.cards {
  grid-column: 1;
  grid-row: repeat(auto-fill, 1);
  justify-self: center;
  align-self: center;
}
.buttons {
  grid-column: 2;
  color: black;
  justify-self: center;
  align-self: center;
}
.secretOptionText {   
    color: black;
    grid-column: 1/5;
    text-align: center;
    margin: auto;
    font-size: 2vw;
}
.secretOptionBox {
    display: grid;
    position: absolute;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 3fr 3fr 1fr;
    width: 30vw;
    height: 12vw;
    background-color: #fff782;
    border-radius: 2vw;
    border-style: solid;
    border-width: 0.4vw;
    border-color: black;
    z-index: 50;
    top: 22%;
    left: 50%;
    padding: 1vw;
}
.secretOptionBoxButton {
  color: black;
  cursor: pointer;
  margin: 0.5vw;
  font-size: 1.5vw;
}
.A {
  grid-column: 2;
}
.B {
  grid-column: 3;
}
/*Nedan är all css för rutan man får upp vid kortköp*/
.auctionCardsAvailable {
  display: grid;
  position: absolute;
  grid-template-rows: 15% 35% 15% auto;
  width: 60vw;
  height: 40vw;
  background-color: #f5efa0;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-20%, -45%);  
}

  .startAuctionCardGrid{
    display: grid;
    align-content: center;
    grid-auto-flow: column;
    grid-column: 1/6;
  }

  .startAuctionHeadings{
    justify-content: center;
    text-align: center;
    color: black;
    grid-column: 1/6;
  }

  .cardsFromBoard{
    display: grid;
    justify-items:center;
    align-items: center;
    zoom: 2;
    overflow: hidden;
  }

  .cardsFromHand{
    display: grid;
    justify-items:center;
    align-items: center;
    zoom: 2;
    overflow: hidden;

  }


.bottlePlace {
 background-image: url(/images/player-bottle.png);
    margin-top: 0vw;
    height: 3vw;
    width: 3vw;
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
.buttonGrid{
    justify-content: center;
    display: grid;
    grid-column: 1/6;
  }


.auctionColumn{
  grid-row: 1/2;
  grid-auto-flow: row;
}
</style>