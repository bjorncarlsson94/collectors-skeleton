<template>
    <div>
      <h1>{{ labels.buyCard }}</h1>
      <div class="auctionCardView">
              <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="buyCard(card)" :key="index"/>
              </div>
              <button class="auctionButtons" v-if="players[playerId]" @click="auctionBoard()">
            <!--visa aktion--> 
          </button>
          <button
            v-if="p.playerId===null"
            :disabled="notYourTurn() || cannotAfford()" 
            ${{p.cost}}>
          </button>
    </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsAuctions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    cardInAuction: Array,
    marketValues: Object,
    auctionPrice: Object 
  },
  methods: {
    cannotAfford: function () {
      return (this.auctionPrice < minCost);
    },
    buyCard: function (card) {
      if (card.available) {
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
