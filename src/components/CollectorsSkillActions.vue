<template>
    <div>
      <!--<h1>{{ labels.buySkill }}</h1>-->
      <div class="buy-skills skillsgrid">
        <div v-for="(card, index) in skillsOnSale" :key="index">
          <CollectorsCard 
            :card="card" 
            :availableAction="card.available" 
            @doAction="buySkill(card)"/>
     
          <!--{{ cardCost(card) }}-->
          
        </div>
        <div v-for="(p, index) in placement" :key="'A' + index">
          <button class="button"
            v-if="p.playerId===null"
            :disabled="notYourTurn() || cannotAfford(p.cost)" 
            @click="placeBottle(p)" >
            ${{p.cost}}
          </button>
          <div class="bottlePlace" :style="{backgroundColor: players[p.playerId].color}" v-if="p.playerId !== null">
          </div>
        </div>
      </div>
                <div class="skillsAvailable" v-show="aboutToBuySkill" v-if="player">
              <h1 class = "buySkillHeadings">
                {{labels.chooseCardFromPlayerBoard}}:
              </h1>
              <div class="buySkillCardGrid">
                <div class="skillsFromBoard" v-for="(card, index) in skillsOnSale" :key="index">
                  <CollectorsCard 
                  :card="card" 
                  :availableAction="card.available" 
                  @doAction="buySkill(card)"/>
                </div>
              </div>
                <h1 class="buySkillHeadings">
                  {{labels.chooseCardFromPlayerHand}}:
                </h1>
              <div class= "buySkillCardGrid">
                <div class="skillsFromHand" v-for="(card,index) in player.hand" :key="'A'+index">
                  <CollectorsCard 
                  :card="card" 
                  :availableAction="card.available" 
                  @doAction="buySkill(card)"/>
                </div>
              </div>    
              <div class="buttonGrid">
               <button class="cancelBuy" @click="hideWindow()">{{labels.cancelBuy}}</button>
              </div>
          </div>
          
    </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsSkillActions',
  components: {
    CollectorsCard
  },

    data: function () {
    return {
      chosenPlacement: null,
      currentPlacementAmount: null,
    };
  },

  props: {
    labels: Object,
    player: Object,
    players: Object,
    skillsOnSale: Array,
    marketValues:Object,
    placement: Array,
    notYourTurn: Function,
    aboutToBuySkill: Boolean
  },
  methods: {
    cannotAfford: function (cost) {
      let minCost = 100;
      for(let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key]
      }
      return (this.player.money < minCost);
    },
    cardCost: function (card) {
      return this.marketValues[card.market];
    },
    placeBottle: function (p) {
      this.chosenPlacement = p;
      this.$emit('placeBottle', p);
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost=100) {
  
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        if (this.marketValues[this.skillsOnSale[i].item] <= this.player.money - cost) {
          this.$set(this.skillsOnSale[i], "available", true);
        }
        else {
          this.$set(this.skillsOnSale[i], "available", false);
        }
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
    buySkill: function (card) {
      if (card.available) {
        this.$emit('buySkill', card)
        this.highlightAvailableCards()
      }
    },
     hideWindow: function(){
        for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        
        
          this.$set(this.skillsOnSale[i], "available", false);
    }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        
        
          this.$set(this.player.hand[i], "available", false);
    }
      this.$emit('cancelBuy', this.chosenPlacement);
    }
    // notYourTurn: function () {
    //   return (this.player.turn== false)
    // }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .buy-skills{
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
  }
  .button{
    float:left;
    font-size: 1vw;
    justify-content: space-around;
    margin: 1vw;
    padding:0.2vw;
    color: black;
    background-color: #d2ebad;
    border-radius:1vw;
    box-shadow: 0 0.3vw #999;
  }
  .button:active{
    background-color: #aeda6e;
    box-shadow: 0 0.2vw #999;
    transform: translateY(0.1vw);
  }
  .button:hover{
    background-color: #aeda6e;
  }
  .skillsgrid{
    display:grid;
    grid-template-rows: 6.4vw;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding: 1vw;
    margin: 1vw;
    justify-items: center;
    border-color: grey;
    border-radius: 2vw;
  }
/*Nedan är all css för rutan man får upp vid kortköp*/
  .skillsAvailable {
  display: grid;
  position: absolute;
  grid-template-rows: 15% 35% 15% auto;
  width: 60vw;
  height: 40vw;
  background-color: #dfeccc;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-65%, -70%);  
  }

  .buySkillCardGrid{
    display: grid;
    align-content: center;
    grid-auto-flow: column;
    grid-column: 1/6;
  }

  .buySkillHeadings{
    justify-content: center;
    text-align: center;
    color: black;
    grid-column: 1/6;
  }

  .skillsFromBoard{
    display: grid;
    justify-items:center;
    align-items: center;
    zoom: 2;
    overflow: hidden;
  }

  .skillsFromHand{
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
    background-color: #d2ebad;
    filter:brightness(105%);
    width: 5.208vw;
    height: 5.208vw;
    font-size: 1vw;
    font-weight: bold;
    box-shadow: 0.0520833vw 0.26041vw 0.3125vw rgba(0, 0, 10, 2), 0 0.0520833vw 0.20833333333333334vw rgba(0, 0, 10, 0.24);
  }
  .cancelBuy:hover{
    background-color: #aeda6e;
  }


  .bottlePlace {
    background-image: url(/images/player-bottle.png);
margin-top: 0.6vw;
    height: 2.5vw;
    width: 2.5vw;
    background-color: rgb(95, 216, 253);
    border-radius: 3vw;
    border-style: ridge;
    box-shadow: 0.1vw 0.1vw rgba(0, 0, 0, 0.692);
    border-width: 0.2vw;
    border-color: rgba(77, 58, 58, 0.658);
    z-index: 60;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>
