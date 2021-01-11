<template>
  <div>
    <div class="auctionCardPayment" v-show="auctionCardPaymentActive">
      Cards to pay with:
      <button
        class="handPaymentButton"
        v-if="players[playerId]"
        @click="payWithHand()"
      >
        x
      </button>
      <div class="handPayment">
        <CollectorsCard
          v-for="(card, index) in players[playerId].hand"
          :card="card"
          :availableAction="card.available"
          @doAction="bidWithCard(card)"
          :key="index"
        />
      </div>
    </div>

    <div
      class="upforAuction"
      v-show="auctionActive"
      v-bind:class="{ turnhighlight: players[playerId].turn }"
      v-if="players[playerId]"
    >
      <div
        class="hiddenAuctionCard"
        v-show="hiddenAuctionCard"
        v-if="players[playerId]"
      ></div>
      <div class="help1" @click="auctionHelpHover">?</div>
      <h2 class="auctionHeader">{{ labels.auction }}</h2>
      <div class="auctionLeader">
        Leader: {{ auctionLeaderName(auctionLeaderId) }}
      </div>
      <div class="auctionBid" v-show="bid > auctionPrice">{{ bid }}$</div>
      <div class="auctionBidLess" v-show="bid <= auctionPrice">{{ bid }}$</div>
      <div class="auctionMoney">{{ auctionPrice }}$</div>
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
        class="auctionCardPaymentButton"
        v-if="players[playerId]"
        :disabled="!players[playerId].turn"
        @click="payWithHand()"
      ></button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="
          !players[playerId].turn ||
          (1 > auctionPrice && 1 > bid && !bidIsNotPossible()) ||
          auctionPrice < bid
        "
        @click="placeBid()"
      >
        Skip
      </button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="
          bid < auctionPrice + 1 ||
          !players[playerId].turn ||
          !(players[playerId].money + cardBidTotal > auctionPrice)
        "
        @click="placeBid()"
      >
        {{ labels.placeBid }}
      </button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="!players[playerId].turn || bid - cardBidTotal <= 0"
        @click="subBid()"
      >
        -
      </button>
      <button
        class="auctionButtons"
        v-if="players[playerId]"
        :disabled="
          !players[playerId].turn ||
          players[playerId].money + cardBidTotal < bid + 1
        "
        @click="addBid()"
      >
        +
      </button>
    </div>
    <div class="auctionPlaceBidHelp" v-if="this.auctionHelpShow">
      <div>
        <h3>
          <strong>{{ labels.auctionHelp.title }}</strong>
        </h3>
        <p>{{ labels.auctionHelp.intro }}</p>
      </div>
      <div>
        <h3>
          <strong>{{ labels.auctionHelp.areaInfoTitle }}</strong>
        </h3>
        <p>{{ labels.auctionHelp.areaInfo1 }}</p>
        <p>{{ labels.auctionHelp.areaInfo2 }}</p>
        <p>{{ labels.auctionHelp.areaInfo3 }}</p>
        <p>{{ labels.auctionHelp.areaInfo4 }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import CollectorsCard from "@/components/CollectorsCard.vue";

export default {
  name: "CollectorsAuction",
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
    hiddenAuctionCard: Boolean,
    auctionMiniActiveNow: Function,
    addBid: Function,
    subBid: Function,
    auctionCardPaymentActive: Boolean,
    openCloseBuyWithCard: Function,
    biddingCards: Array,
    cardBidTotal: Number,
    addNumber: Function,
  },
  data: function () {
    return {
      auctionHelpShow: false,
    };
  },
  // data: function () {
  //    return {
  //      notEnough: false
  //   };
  // },

  methods: {
    auctionLeaderName: function (playerId) {
      if (playerId !== null) {
        return this.players[playerId].name;
      }
    },
    payWithHand: function () {
      for (let i = 0; i < this.players[this.playerId].hand.length; i += 1) {
        this.$set(this.players[this.playerId].hand[i], "available", true);
      }
      this.openCloseBuyWithCard();
    },
    bidIsNotPossible: function () {
      let moneyTot = this.players[this.playerId].money;
      for (let i = 0; i < this.players[this.playerId].hand.length; i += 1) {
        moneyTot += this.players[this.playerId].hand[i].value;
      }
      if (moneyTot < 1) {
        return true;
      } else {
        return false;
      }
    },
    bidWithCard: function (card) {
      let c = null;
      this.addNumber(card.value);
      this.addBid();
      if (card.value == 2) {
        this.addBid();
      }

      for (let i = 0; i < this.players[this.playerId].hand.length; i += 1) {
        this.$set(this.players[this.playerId].hand[i], "available", false);
      }

      for (let i = 0; i < this.players[this.playerId].hand.length; i += 1) {
        // since card comes from the client, it is NOT the same object (reference)
        // so we need to compare properties for determining equality
        if (
          this.players[this.playerId].hand[i].x === card.x &&
          this.players[this.playerId].hand[i].y === card.y
        ) {
          c = this.players[this.playerId].hand.splice(i, 1);
          break;
        }
      }
      this.biddingCards.push(...c);
      this.openCloseBuyWithCard();
    },

    placeBid: function () {
      this.$store.state.socket.emit("auctionBid", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        players: this.players,
        bid: this.bid,
        auctionPrice: this.auctionPrice,
      });
    },
    auctionHelpHover: function () {
      this.auctionHelpShow = !this.auctionHelpShow;
    },
  },
};
</script>
 <style>
.upforAuction {
  display: grid;
  position: absolute;
  grid-template-rows: 20% 15% 43% auto;
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
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
.auctionCardPaymentButton {
  background-image: url(/images/card-payment.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 4.5vw;
  margin: 1vw;
  grid-row: 3;
  grid-column: 4;
  height: 40%;
  align-self: end;
  background-color: rgb(180, 180, 180);
  cursor: pointer;
  box-shadow: 0 0.3vw #999;
  border-radius: 2vw;
  border: 0vw;
}

.auctionCardPayment {
  display: grid;
  position: absolute;
  grid-template-rows: 1fr 5fr;
  width: 70vw;
  height: 25vw;
  background-color: deepskyblue;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3vw;
  text-align: center;
  color: black;
}
.hiddenAuctionCard {
  z-index: 53;
  width: 24.5vw;
  height: 31.1vw;
  background-image: url(/images/back-of-card.png);
  border-radius: 1vw;
  position: absolute;
  zoom: 0.835;
  align-content: center;
  transition: auto;
  transform: translate(48%, 23%);
  background-size: contain;
  background-repeat: no-repeat;
}
.handPayment {
  zoom: 2.5;
  display: grid;
  grid-template-columns: repeat(auto-fit, 5.4vw);
  padding: 0.5vw;
  height: 80%;
  background-color: lightblue;
  border-radius: 2vw;
  grid-row: 2;
  align-content: center;
}
.upforAuction.turnhighlight {
  filter: brightness(110%);
  border-color: rgb(199, 199, 199);
  box-shadow: 0 0 1vw rgb(199, 199, 199);
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
.auctionBidLess {
  grid-row: 3;
  font-size: 5vw;
  grid-column-start: 4;
  text-align: center;
  color: red;
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
.handPaymentButton {
  background-color: red;
  grid-row: 1;
  width: 4vw;
  text-align: center;
  border: 0;
  top: -1vw;
  right: -1vw;
  border-radius: inherit;
  height: 4vw;
  font-size: 2vw;
  align-self: right;
  position: absolute;
  cursor: pointer;
}
.help1 {
  width: 3.0833vw;
  height: 3.0833vw;
  border-radius: 50%;
  position: absolute;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
  cursor: pointer;
  border: solid;
  border-color: black;
  border-width: 0.02604vw;
  box-shadow: 0 0.2604vw 0.3125vw rgba(0, 0, 0, 0.466),
    0 0.05208vw 0.20833vw rgba(0, 0, 0, 0.24);
}
.auctionPlaceBidHelp {
  -webkit-animation: auctionSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: auctionSlide 0.5s forwards;
  animation-delay: 0.01;
  background-color: #90917b;
  --scrollbarBG: #90917b;
  --thumbBG: #f5ef9e;
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);

  border-radius: 1vw;
  -webkit-box-shadow: 0px 0px 0.3125vw 0.3125vw rgba(102, 163, 255, 0.59);
  box-shadow: 0px 0px 0.3125vw 0.3125vw rgba(102, 163, 255, 0.59);
  background-color: inherit;
  padding: 1vw;

  max-width: 19.791666666666668vw;
  min-width: 14vw;
  max-height: 43.833333333333332vw;
  overflow-y: auto;
  position: absolute;
  z-index: 51;
  word-wrap: break-word;
  display: inline;
  font-size: 1vw;
  left: -5.2083vw;
  width: 5.208vvw;
  height: 30vw;
  background: #b1c592;
}
.auctionPlaceBidHelp div {
  background-color: #f5ef9e;
  padding: 0.26041vw;
  margin-bottom: 0.10416vw;
  border: solid;
  border-width: 0.0104166vw;
  border-color: black;
  border-radius: 0.5vw;
}
.auctionPlaceBidHelp h3 {
  border-radius: 0.5vw;
  padding: 0.55vw;

  border: solid;
  border-width: 0.0104166vw;
  border-color: black;
  background-color: #90917b;
}
.auctionPlaceBidHelp p {
  background-color: #90917b;
  border-radius: 0.5vw;
  margin-top: -0.52vw;
  padding: 0.55vw;
  border: solid;
  border-width: 0.0104166vw;
  border-color: black;
}
@-webkit-keyframes auctionSlide {
  0% {
    left: 0%;
  }
  0% {
    top: 13%;
  }

  100% {
    left: 4%;
  }
  100% {
    top: 13%;
  }
}

@keyframes auctionSlide {
  0% {
    left: 0%;
  }
  0% {
    top: 13%;
  }

  100% {
    left: 4%;
  }
  100% {
    top: 13%;
  }
}
</style>