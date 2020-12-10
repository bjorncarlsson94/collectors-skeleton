<template>
    <div>
      <!--<h1>{{ labels.buyCard }}</h1>-->
      <div class="auctionCardView">
              <CollectorsCard v-for="(card, index) in player.hand" :card="card" :availableAction="card.available" @doAction="buyCard(card)" :key="index"/>
              </div>
              <button class="auctionButtons" v-if="player" @click="auctionBoard()">
            <!--visa aktion--> 
          </button>
          <button
            
            :disabled="notYourTurn() || cannotAfford()" 
            >hej
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
    auctionPrice: Object,
    auctionActive: Boolean 
  },
  methods: {
    cannotAfford: function () {
      return (this.player.money < this.auctionPrice);
    },
    buyCard: function (card) {
      if (card.available) {
        this.$emit('buyCard', card)
        this.highlightAvailableCards()
      }
    },
    notYourTurn: function () {
      return (this.player.turn== false)
    },
    auctionBoard: function(){
      console.log("auction rutaa");
      this.auctionActive = !this.auctionActive;
      console.log("status: "+ this.auctionActive);
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
