<!--Hejsan kompisar. Här är koden så att vi får ut raise value. Imorgon kommer jag sitta för att räkna hur många värden det 

Nu läggs kort in här automatiskt. Finns ingen uträkning för hur mycket poäng man får än. 

-->

<template>
  <div>
    <!--<h1>{{labels.raiseValue}}</h1>-->
    <div class="wrapper1 raiseValuegrid">
      <div v-for="values in marketOrder" :key="values">
        <div class="valueSlot">
          <img class="valueIcon" src="/images/player-bottle.png" />
          <p class="valueValue">
            {{ values }}
            <br />
            {{ cardCost(values) }}
          </p>
        </div>

        <div class="cardslots" v-for="(card, index) in raiseItems" :key="index">
          <div v-if="card.market == values">
            <CollectorsCard :card="card" :availableAction="card.available" />
          </div>
        </div>
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
  data: function() {
    return {
      marketOrder: ["fastaval", "figures", "music", "movie", "tech"],
    };
  },

  props: {
    labels: Object,
    player: Object,
    raiseItems: Array,
    raiseValue: Object,
  },
  methods: {
    log() {
      console.log("hejsan " + this.raiseItems);
    },
    cardCost: function(values) {
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
}
.raiseValuegrid {
  display: grid;
  grid-template-rows: 2.5vw 2.5vw 2.5vw 2.5vw 2.5vw;
  padding: 1vw;
  justify-self: space-evenly;
  text-align: center;
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
  margin-block-end: 1em;
  border-radius: 0.5vw;
  font-size: 0.8vw;
}

.valueIcon {
  width: 20px;
  height: 20px;
  margin: auto;
  grid-column: 1;
}

.valueValue {
  grid-column: 2;
  margin: auto;
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
