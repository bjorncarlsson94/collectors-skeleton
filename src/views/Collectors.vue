<template>
  <div>
    <main>
      {{buyPlacement}} {{chosenPlacementCost}}
      <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"/>
      {{skillPlacement}} {{chosenPlacementCost}}
      <CollectorsSkillActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :skillsOnSale="skillsOnSale"
        :marketValues="marketValues"
        :placement="skillPlacement"
        @buySkill="buySkill($event)"
        @placeBottle="placeBottle('skill', $event)"/>
      
      <div></div>
      <button v-if="players[playerId]" @click="startTurn()">
      Slumpa startare. 
      </button>
      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>
      HEAD
      <section id="grid">
        <div class="player playerLeft">
          PlayerLeft
          <!--Here are the player specific things-->
        </div>
        <div class="player playerTop">
          PlayerTop
          <!--Here are the player specific things-->
        </div>
        <div class="player playerRight">
          PlayerRight
          <!--Here are the player specific things-->
        </div>
        <div class="cardslots skills">
          Skills
          <CollectorsCard v-for="(card, index) in skillsOnSale" :card="card" :key="index"/>
        </div>
        <div class="cardslots auction">
          Auction
          <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/>
        </div>
        <div class="cardslots raiseValue">
          Raise Value
          <!-- Här måste vi fixa en RAISE VALUE CARDS som med item, skill, auction etc-->
        </div>
        
        
          <!-- Gav en class som beror på bolean isActive. Den ändras mellan true och false i 'expandPlayerBoard'-->
        <div class="cardslots playerboard" v-if="players[playerId]" v-on:click="expandPlayerBoard"  v-bind:class="{ active: isActive }"> 
          Hand
          <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="buyCard(card)" :key="index"/>
          

        </div>
        <!--

                    VIKTIGT!!!

        Just nu är Skills och Items slotsen för spelarens items/skills. Här måste vi göra så att dessa är för spelplanen
        det vill säga flytta in köpegrejerna in i divarna här. Sen måste det göras nya divvar inne i spelarens hand (som borde bli player board eller
        liknande istället. Här ska Hand, Items, skills visas som de visas nu. Alla kort måste skalas om i visningen enligt samma princip som rutorna.
        -->

        <div class="cardslots items" v-if="players[playerId]">
          Items
          <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
        </div>
        <div class="gridedge1">
          Ruta för att visa grid lättare: 1
          <br>
          Här kan man t.ex. ha en logga
        </div>
        <div class="gridedge2">
          Ruta för att visa grid lättare: 2
          <br>
          Här kan man t.ex. ha korthögen
        </div>
        <div class="gridedge3">
          Ruta för att visa grid lättare: 3
          <br>
          Här kan man t.ex. ha vissa viktiga knappar
        </div>
        <div class="gridedge4">
          Ruta för att visa grid lättare: 4
          <br>
          Här kan man t.ex. ha vissa viktiga meny-knappar
        </div>
      </section>

    </main>
    {{players}}
    {{marketValues}}
    <button v-if="players[playerId]" @click="players[playerId].money += 1">
      fake more money
    </button>
    <footer>
        <p>
          {{ labels.invite }}
          <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </p>
    </footer>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import CollectorsCard from '@/components/CollectorsCard.vue'
import CollectorsBuyActions from '@/components/CollectorsBuyActions.vue'
import CollectorsSkillActions from '@/components/CollectorsSkillActions.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsSkillActions

  },
  data: function () {
    return {
      isActive: false,
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0,
                  y: 0 },
      labels: {},
      players: {},
      // playerId: {
      //   hand: [],
      //   money: 1,
      //   points: 0,
      //   skills: [],
      //   items: [],
      //   income: [],
      //   secret: []
      // }
      buyPlacement: [],
      skillPlacement: [],
      auctionPlacement: [],
      marketPlacement: [],
      chosenPlacementCost: null,
      marketValues: { fastaval: 0,
                     movie: 0,
                     technology: 0,
                     figures: 0,
                     music: 0 },
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      playerid: 0
    }
  },
  computed: {
    playerId: function() { return this.$store.state.playerId}
  },
  watch: {
    players: function(newP, oldP) {
      console.log(newP, oldP)
      for (let p in this.players) {
        for(let c = 0; c < this.players[p].hand.length; c += 1) {
          if (typeof this.players[p].hand[c].item !== "undefined")
          this.$set(this.players[p].hand[c], "available", false);
        }
      }
    }
  },
  created: function () {
    this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
    //TODO! Fix this ugly hack
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);

    this.$store.state.socket.emit('collectorsLoaded',
      { roomId: this.$route.params.id,
        playerId: this.playerId } );

    this.$store.state.socket.on('collectorsInitialize',
      function(d) {
        this.labels = d.labels;
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.marketValues = d.marketValues;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
      }.bind(this));

    this.$store.state.socket.on('collectorsBottlePlaced',
      function(d) {
        this.buyPlacement = d.buyPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
      }.bind(this));

    this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d );

    this.$store.state.socket.on('collectorsCardDrawn',
      function(d) {
          //this has been refactored to not single out one player's cards
          //better to update the state of all cards
          this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsCardBought',
      function(d) {
        console.log(d.playerId, "bought a card");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
      }.bind(this)
    );
    this.$store.state.socket.on('collectorsSkillBought',
      function(d) {
        console.log(d.playerId, "bought a skill");
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
      }.bind(this)
    );
    this.$store.state.socket.on('firstPlayerPicked',
      function(d) {
        console.log( "spelare vald");
        this.players = d.players;
      }.bind(this)
    );
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },

    expandPlayerBoard: function(){
      console.log("Click click mf");
      this.isActive = !this.isActive;
      console.log("status: "+ this.isActive);
    },

    placeBottle: function (action, cost) {
      this.chosenPlacementCost = cost;
      this.$store.state.socket.emit('collectorsPlaceBottle', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          action: action,
          cost: cost,
        }
      );
    },
    drawCard: function () {
      this.$store.state.socket.emit('collectorsDrawCard', {
          roomId: this.$route.params.id,
          playerId: this.playerId
        }
      );
    },
    buyCard: function (card) {
      console.log("buyCard", card);
      this.$store.state.socket.emit('collectorsBuyCard', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.marketValues[card.market] + this.chosenPlacementCost
        }
      );

    },
     buySkill: function (card) {
      console.log("buySkill", card);
      this.$store.state.socket.emit('collectorsBuySkill', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.marketValues[card.market] + this.chosenPlacementCost
        }
      );

    },
    startTurn: function () {
      console.log("hola",);
  
      this.$store.state.socket.emit('startTurn', {
        roomId:this.$route.params.id
        }
      );

    }

  },
}
</script>
<style scoped>
  header {
    user-select: none;
    position: fixed;
    width:100%;
    pointer-events: none;
  }
  main {
    user-select: none;
  }
  footer {
    margin-top: 5em auto;
  }
  footer a {
    text-decoration: none;
    border-bottom: 2px dotted ivory;
  }
  footer a:visited {
    color:ivory;
  }
  .cardslots {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px); /* Det här är en koddel som bestämmer avståndet mellan korten, typ. */
    grid-template-rows: repeat(auto-fill, 180px);
  }
  .cardslots div {
    transform: scale(0.5)translate(-50%,-50%);
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
  }
  .cardslots div:hover {
    transform: scale(1)translate(-25%,0);
    z-index: 1;
  }

  #grid {
    display: grid;
    grid-gap: 1.5vw;
    margin: 2vw;
    justify-content:center;   /* dessa 2 centrerar horisontellt respektive vertikalt */
    align-items:center;
  }
  /*
  Om det inte går så bra med centrering etc kan vi testa att göra om allt till en 3x3 grid
  med att 2x2 platsen (mitten) har ett inre grid som är 3x3 där:

  Auction: column 1 row /span 3,
  Items column 2 /span 2 row 1,
  Skills column 2 /span 2 row 2,
  Raise Value column 2 /span 2 row 3

  */

  .player{
    padding: 1vw;
  }
  .cardslots{
    padding: 1vw;
  }

  /*
  Här nedan är CSS specifika för player rutorna
  */

  .player{
    border-radius: 15px;
  }
  .playerLeft{
    grid-column: 1;
    grid-row: 2 /span 3;
    background-color: #7e2174;
    height: 25vw;
  }
  /*  
      På alla dessa finns max-height eller motsvarande, dessa får vi leka runt med tills vi hittar något bra
      Men korten måste skalas bra innan vi kan göra detta ordentligt
  */
  .playerTop{
    grid-column: 2 /span 3;
    grid-row: 1;
    background-color: #19b3a7;
    height: 10vw;
    max-width: 25vw;
    text-align: center;
    margin-left: 11vw; /* Denna måste också justeras, nu är den framhöftad för att centrera Player Top någorlunda */
  }
  .playerRight{
    grid-column: 5;
    grid-row: 2 /span 3;
    background-color: #ca9e68;
    height: 25vw;
  }
  .playerboard{  /* Denna ska göras om till "Player board" eller liknande där handen inkluderas*/
    border-radius: 15px;
    background-color: rgb(217, 240, 247); /* Choose colour based on the 4 player colours */
    grid-column: 2 /span 3;
    grid-row: 5;
  }

  .playerboard:hover{
    background-color: hotpink;
  }

  
/* Om man klickar på handen aktiveras denna. Denna ger attribut bara om isActive på divven = true */
  .active{
    background-color: hotpink;
    height: 300%;
    align-self: end;
    width: 110%;
    justify-self: center;
  }





  /*
  Här nedan är CSS specifika för kortrutorna
  */

  .items{
    border-radius: 15px;
    background-color:#f8dcce;
    grid-column: 3 /span 2;
    grid-row: 2;
    width: 30vw;
    height: 10vw;
  }
  .skills{
    border-radius: 15px;
    background-color: #dfeccc;
    grid-column: 3 /span 2;
    grid-row: 3;
    width: 30vw;
    height: 10vw;
  }
  .raiseValue{
    border-radius: 15px;
    background-color: #cfdcf2;
    grid-column: 3 /span 2;
    grid-row: 4;
    width: 30vw;
    height: 10vw;
  }
  .auction{
    border-radius: 15px;
    background-color: #f5f2cc;
    grid-column: 2;
    grid-row: 2 /span 3;
    max-width: 15vw;
  }

  /*
  Dessa nedan är bara provisoriska och ska göras om eller tas bort i slutändan.
  */

  .gridedge1{
    grid-column: 1;
    grid-row: 1;
    background-color:rgb(194, 194, 194);
    border-radius: 10px;
    padding:20px;
    height: 10vw;
  }
  .gridedge2{
    grid-column: 5;
    grid-row: 1;
    background-color:rgb(194, 194, 194);
    border-radius: 10px;
    padding:20px;
    height: 10vw;
  }
  .gridedge3{
    grid-column: 1;
    grid-row: 5;
    background-color:rgb(194, 194, 194);
    border-radius: 10px;
    padding:20px;
    height: 10vw;
  }
  .gridedge4{
    grid-column: 5;
    grid-row: 5;
    background-color:rgb(194, 194, 194);
    border-radius: 10px;
    padding:20px;
    height: 10vw;
  }




  @media screen and (max-width: 800px) {
    main {
      width:90vw;
    }
  }
</style>
