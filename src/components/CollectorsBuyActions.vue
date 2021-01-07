<template>
    <div>
      <!--<h1>{{ labels.buyCard }}</h1>-->
      <div class="buy-cards itemgrid">
        <div v-for="(card, index) in itemsOnSale.slice().reverse()" :key="index">
          <CollectorsCard 
            :card="card" 
            :availableAction="card.available" 
            @doAction="buyCard(card)"/>
          
          <div class="cardcost" v-for="(value,key) in raiseValue" :key="key">
            <p v-if="card.item===key">{{value}}</p>
          </div>
        </div>
        <div v-for="(p, index) in placement" :key="'A' + index">
          <button class="button"
            v-if="p.playerId===null"
            :disabled="notYourTurn() || cannotAfford(p.cost)" 
            @click="placeBottle(p)" >
            ${{p.cost}}p
          </button>
          <div class="bottlePlace" :style="{backgroundColor: players[p.playerId].color}" v-if="p.playerId !== null">
          </div>
        </div>
      </div>
          <div class="itemsAvailable" v-show="aboutToBuyItem" v-if="player">
              <h1 class = "buyItemHeadings">
                Välj ett kort från spelplanen:
              </h1>
              <div class="buyItemCardGrid">
                <div class="itemsFromBoard" v-for="(card, index) in itemsOnSale" :key="index">
                  <CollectorsCard 
                  :card="card" 
                  :availableAction="card.available" 
                  @doAction="buyCard(card)"/>
                </div>
              </div>
                <h1 class="buyItemHeadings">
                  Välj ett kort från handen:
                </h1>
              <div class= "buyItemCardGrid">
                <div class="itemsFromHand" v-for="(card,index) in player.hand" :key="'A'+index">
                  <CollectorsCard 
                  :card="card" 
                  :availableAction="card.available" 
                  @doAction="buyCard(card)"/>
                </div>
              </div>  
              <div class="buttonGrid">
               <button class="cancelBuy" @click="hideWindow(currentPlacementCost)">Avbryt köp</button>
              </div>
          </div>
    </div>

</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsBuyActions',
  components: {
    CollectorsCard
  },
  data: function(){
      return{
       currentValues:{
         fastaval: this.raiseValue.fastaval,
         movie: this.raiseValue.movie,
         technology: this.raiseValue.technology,
         figures: this.raiseValue.figures,
         music: this.raiseValue.music,
         currentPlacementCost: null}
       
       

       };
},

  props: {
    labels: Object,
    player: Object,
    players: Object,
    itemsOnSale: Array,
    marketValues: Object,
    placement: Array,
    raiseValue:Object,
    aboutToBuyItem: Boolean,
    notYourTurn: Function  },

  methods: {
    log(value,key){
        console.log("value "+value+" key"+key);

    },
    cannotAfford: function (cost) {
      let minCost = 100;
      for(let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key]
      }
      return (this.player.money < minCost);
    },
    cardCost: function (card) {
     
      for(const key in this.raiseValue){
        if(key ==card.market){
          return this.currentValues[key]

        }
      }  return 0;
    
      },
      cardCostUppdate: function (cost) {
     
        
        this.currentValues.fastaval=this.raiseValue.fastaval+cost;
        this.currentValues.movie=this.raiseValue.movie+cost;
        this.currentValues.technology=this.raiseValue.technology+cost;
        this.currentValues.figures=this.raiseValue.figures+cost;
        this.currentValues.music=this.raiseValue.music+cost;

      
  },
    
    placeBottle: function (p) {
      this.currentPlacementCost = p.cost;
      this.cardCostUppdate(p.cost);
      this.$emit('placeBottle', p.cost);
      
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost) {
      for (let i = 0; i < this.itemsOnSale.length; i += 1) {
        
        if (this.currentValues[this.itemsOnSale[i].item] <= this.player.money) {
          this.$set(this.itemsOnSale[i], "available", true);
        }
        else {
          this.$set(this.itemsOnSale[i], "available", false);
        }
        this.chosenPlacementCost = cost;
        
      }
      
      for (let i = 0; i < this.player.hand.length; i += 1) {
        console.log(this.player.hand[i].item);
        if (this.currentValues[this.player.hand[i].item] <= this.player.money) {
          this.$set(this.player.hand[i],"available" ,true);
          this.chosenPlacementCost = cost;
          
          console.log(this.player.hand[i].available)
        }
        else {

          this.$set(this.player.hand[i], "available", false);
          
          this.chosenPlacementCost = cost;
        }
      }
    },
    buyCard: function (card) {
      console.log("inne i buyCard")
      var cardFromHandAvailable=false;
       for (let i = 0; i < this.player.hand.length; i += 1) {
        if(this.player.hand[i].available==true ){
          
          cardFromHandAvailable=true;
          
          console.log("kom in i buyCard loopen");
          break;

        }
        }
      if (card.available || cardFromHandAvailable ) {
        console.log("kom in i buyCard if satsen mannen");
        this.cardCostUppdate(0)
        this.$emit('buyCard', card)
        this.highlightAvailableCards(0)
      }
     
    },

    hideWindow: function(cost){
      
      this.$emit('cancelBuy', cost);
    }


    // notYourTurn: function () {
    //   return (this.player.turn== false)
    // }
}
  }
  

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .buy-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
  }
  .button{
    float:left;
    font-size: 1vw;
    justify-content: space-around;
    margin:1vw;
    padding:0.2vw;
    color: black;
    background-color: #ffbe9e;
    border-radius:1vw;
    box-shadow: 0 0.3vw #999;
  }
  .button:active{
    background-color: #da855a;
    box-shadow: 0 0.2vw #999;
    transform: translateY(0.1vw);
  }
  .button:hover{
    background-color: #da855a;
  }
  .cardcost{
    text-align: center;
    color: black;
    font-weight: bold;
    font-size: 1vw;
  }
  .itemgrid{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding: 1vw;
    margin: 1vw;
    justify-items: center;
    border-color: grey;
    border-radius: 2vw;
  }

/*Nedan är all css för rutan man får upp vid kortköp*/
  .itemsAvailable {
  display: grid;
  position: absolute;
  grid-template-rows: 15% 30% 15% 30% auto;
  width: 60vw;
  height: 45vw;
  background-color: #f8dcce;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-65%, -30%);  
  }

  .buyItemCardGrid{
    display: grid;
    align-content: center;
    grid-auto-flow: column;
    grid-column: 1/6;
  }

  .buyItemHeadings{
    justify-content: center;
    text-align: center;
    color: black;
    grid-column: 1/6;
  }

  .itemsFromBoard{
    display: grid;
    justify-items:center;
    align-items: center;
    zoom: 2;
    overflow: hidden;
  }

  .itemsFromHand{
    display: grid;
    justify-items:center;
    align-items: center;
    zoom: 2;
    overflow: hidden;

  }
  .buttonGrid{
    justify-content: center;
    display: grid;
    grid-column: 1/6;
  }

  .cancelBuy{
    width: 20vw;
    font-weight: bold;
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

</style>
