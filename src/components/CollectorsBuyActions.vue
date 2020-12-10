<template>
    <div>
      <h1>{{ labels.buyCard }}</h1>
      <div class="buy-cards">
        <div v-for="(card, index) in itemsOnSale" :key="index">
          <CollectorsCard 
            :card="card" 
            :availableAction="card.available" 
            @doAction="buyCard(card)"/>
          
        <div v-for="(value,key) in currentValues" :key="key">
            <p v-if="card.market===key">{{value}}</p>
          </div>
       
        </div>
      </div>
      <div>
        <div class="buttons" v-for="(p, index) in placement" :key="index">
          <button
            v-if="p.playerId===null"
            :disabled="notYourTurn() || cannotAfford(p.cost)" 
            @click="placeBottle(p)" >
            ${{p.cost}}p
          </button>
          <div v-if="p.playerId !== null">
            {{p.playerId}}
          </div>
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
         music: this.raiseValue.music },
       
       

       };
},

  props: {
    labels: Object,
    player: Object,
    itemsOnSale: Array,
    marketValues: Object,
    placement: Array,
    raiseValue:Object  },

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
          return this.raiseValue[key];

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
      this.cardCostUppdate(p.cost);
      this.$emit('placeBottle', p.cost);
      
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost=100) {
      for (let i = 0; i < this.itemsOnSale.length; i += 1) {
        
        if (this.marketValues[this.itemsOnSale[i].item] <= this.player.money - cost) {
          this.$set(this.itemsOnSale[i], "available", true);
        }
        else {
          this.$set(this.itemsOnSale[i], "available", false);
        }
        this.chosenPlacementCost = cost; 
        this.cardCost(this.itemsOnSale[i],cost);
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
    buyCard: function (card) {
      if (card.available) {
        
        this.cardCostUppdate(0)
        this.$emit('buyCard', card)
        this.highlightAvailableCards()
      }
     
    },
    notYourTurn: function () {
      return (this.player.turn== false)
    }
}
  }
  

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .buy-cards, .buttons {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
  }
</style>
