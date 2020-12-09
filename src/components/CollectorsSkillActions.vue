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
      </div>
      <div>
        <div class="buttons" v-for="(p, index) in placement" :key="index">
          <button
            v-if="p.playerId===null"
            :disabled="notYourTurn() || cannotAfford(p.cost)" 
            @click="placeBottle(p)" >
            ${{p.cost}}
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
  name: 'CollectorsSkillActions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    marketValues: Object,
    placement: Array
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
      this.$emit('placeBottle', p.cost);
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
    notYourTurn: function () {
      return (this.player.turn== false)
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .buy-skills{
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
  }
  .buttons{
    padding: 1vw;
    display:inline-block;
  }
  .skillsgrid{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding:2vw;
    justify-items:center;
  }
</style>
