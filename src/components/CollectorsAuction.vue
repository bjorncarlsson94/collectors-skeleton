<template>
  <div>
    <div class="upforAuction" v-show="auctionActive" v-if="players[playerId]">
      <h2 class="auctionHeader">AUCTION</h2>
      <div class="auctionLeader">Leader: {{ auctionLeaderId }}</div>
      <div class="auctionBid">{{ bid - auctionPrice }}+</div>
      <div class="auctionMoney">{{ bid }}$</div>
      <div class="auctionCardView">
        <CollectorsCard
          v-for="(card, index) in cardInAuction"
          :card="card"
          :key="index"
        />
      </div>
      <button
        class="auctionButtonMini"
        v-if="players[playerId]"
        @click="auctionMiniActiveNow()"
      ></button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="0 < bid - auctionPrice || !players[playerId].turn || bid < 1"
        @click="placeBid()"
      >
        Skip
      </button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="bid < auctionPrice + 1 || !players[playerId].turn"
        @click="placeBid()"
      >
        Place bid
      </button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="!players[playerId].turn || bid < auctionPrice + 1"
        @click="subBid()"
      >
        -
      </button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="!players[playerId].turn || players[playerId].money < bid + 1"
        @click="addBid()"
      >
        +
      </button>
    </div>
  </div>
</template>
<script>
import CollectorsCard from "@/components/CollectorsCard.vue";

export default {
  name: "CollectorsSkillActions",
  components: {
    CollectorsCard,
  },
  props: {
    auctionActive: Boolean,
    labels: Object,
    cardInAuction: Array,
    players: Object,
    bid: Number,
    auctionLeaderId: String,
    auctionPrice: Number,
    playerId: String,
    auctionMiniActiveNow: Function,
    addBid: Function,
    subBid: Function,
  },

  methods: {
    placeBid: function () {
      console.log("bid innan:" + this.bid);
      this.$store.state.socket.emit("auctionBid", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        bid: this.bid,
        auctionPrice: this.auctionPrice,
      });
    },
  },
};
</script>
 <style>
.upforAuction {
  display: grid;
  position: absolute;
  grid-template-rows: 20% 15% 43% auto;
  grid-template-columns: auto auto auto auto;
  width: 40vw;
  height: 40vw;
  background-color: #f5efa0;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.auctionCardView {
  zoom: 4;
  position: absolute;
  align-content: center;
  transition: auto;
  transform: translate(50%, 25%);
}
.auctionCardView {
  zoom: 4;
  position: absolute;
  align-content: center;
  transition: auto;
  transform: translate(50%, 25%);
}
.auctionCardViewMini {
  zoom: 1.65;
  position: absolute;
  align-content: center;
  transition: auto;
  transform: translate(5%, 40%);
}
.auctionButtonMini {
  background-image: url("https://www.pngrepo.com/download/120575/minimize.png");
  background-position: center;
  transform: rotate(270deg);
  background-repeat: no-repeat;
  background-size: 3vw;
  margin: 1vw;
  background-color: rgb(180, 180, 180);
  cursor: pointer;
  box-shadow: 0 0.3vw #999;
  border-radius: 2vw;
  border: 0vw;
}
.auctionButtons {
  margin: 1vw;
  border: 1vw;
  border-radius: 2vw;
  font-size: 2vw;
  border-color: black;
  grid-row-start: 4;
  align-self: bottom;
  background-color: rgb(180, 180, 180);
  transition-duration: 0.2;
  cursor: pointer;
  box-shadow: 0 0.3vw #999;
}
.auctionButtons:hover {
  background-color: greenyellow;
}
.auctionMoney {
  grid-row: 2;
  font-size: 5vw;
  grid-column-start: 4;
  text-align: center;
  color: darkgreen;
}
.auctionBid {
  grid-row: 3;
  font-size: 5vw;
  grid-column-start: 4;
  text-align: center;
  color: rgb(0, 209, 0);
}
.auctionLeader {
  font-size: 2.5vw;
  margin-top: 1.4vw;
  grid-row: 1;
  grid-column: 2/4;
  text-align: left;
  color: rgb(0, 0, 0);
}
.auctionHeader {
  writing-mode: vertical-rl;
  -webkit-text-orientation: upright;
  text-orientation: upright;
  margin-top: 1.6vw;
  color: black;
  font-size: 3vw;
}
</style>