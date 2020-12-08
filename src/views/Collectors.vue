
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
        <CollectorsStartAuction v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :auctionCards="auctionCards"
        :marketValues="marketValues"
        :placement="auctionPlacement"
        @startAuction="startAuction($event)"
        @placeBottle="placeBottle('auction', $event)"/>
      
      <div></div>
      <button v-if="players[playerId]" :disabled="this.gameStarted" @click="startTurn()">
      Slumpa startare. 
      </button>
      <button v-if="players[playerId]" :disabled="!players[playerId].turn" @click="nextPlayer()">
      Nästa spelare. 
      </button>
      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>

        <!--Raise value div. with 4 random cards in it at the moment-->
       <!--Raise value div. with 4 random cards in it at the moment 
       They are diplayed in the correct raiseValue columm-->
        
      <CollectorsRaiseValue v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :raiseItems="raiseItems"/> 
       
      <br> 
     
      <section id="wrapper">
      <div id="grid">
        <div class="player playerLeft" v-on:click="expandLeftBoard"  v-bind:class="{ active: leftIsActive }">
          PlayerLeft
          <!--Here are the player specific things-->
        </div>
        <div class="player playerTop" v-on:click="expandTopBoard"  v-bind:class="{ active: topIsActive }">
          PlayerTop
          <!--Here are the player specific things-->
        </div>
        <div class="player playerRight" v-on:click="expandRightBoard"  v-bind:class="{ active: rightIsActive }">
          PlayerRight
          <!--Here are the player specific things-->
        </div>
        <div class="skills">
          <div class="skillsgrid">
            <CollectorsCard v-for="(card, index) in skillsOnSale" :card="card" :key="index"/>
          </div>
        </div>
        <div class="cardslots auction">
          <div class="auctiongrid">
            <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/>
          </div>
        </div>
        <div class="cardslots raiseValue">
          <div class="raiseValuegrid">
            <CollectorsCard v-for="(card, index) in raiseItems" :card="card" :key="index"/>
          </div>
        </div>
        
        
          <!-- Gav en class som beror på bolean isActive. Den ändras mellan true och false i 'expandPlayerBoard'-->
        <div class="cardslots hand playerboard" v-if="players[playerId]" v-on:click="expandPlayerBoard"  v-bind:class="{ active: isActive }"> 
          Hand
          <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="buyCard(card)" :key="index"/>
        </div>
        

        <!--

                    VIKTIGT!!!

        Just nu är Skills och Items slotsen för spelarens items/skills. Här måste vi göra så att dessa är för spelplanen
        det vill säga flytta in köpegrejerna in i divarna här. Sen måste det göras nya divvar inne i spelarens hand (som borde bli player board eller
        liknande istället. Här ska Hand, Items, skills visas som de visas nu. Alla kort måste skalas om i visningen enligt samma princip som rutorna.

        -->

        <div class="items">
          <div class="itemgrid">
            <CollectorsCard v-for="(card, index) in itemsOnSale" :card="card" :key="index"/>
          <!--<CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>-->
          </div>
        </div>
        <div class="work">
          
          <!--{{index}}; LÄGG TILL SÅ DET ÄR ITEMS ON SALE HÄR SOM SYNS -->
          Work
        </div>

        <div class="gridedge1">
          Ruta för att visa grid lättare: 1
          <br>
           Det är runda: ,{{ round }}
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
import CollectorsRaiseValue from '@/components/CollectorsRaiseValue.vue'
import CollectorsStartAuction from '@/components/CollectorsStartAuction.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsSkillActions,
    CollectorsRaiseValue,
    CollectorsStartAuction

  },
  data: function () {
    return {
      gameStarted: false,
      isActive: false,
      leftIsActive: false,
      rightIsActive: false,
      topIsActive: false,

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
      playerid: 0,
      round: 0,
      startingPlayerId: null,
      
      scalefactor: window.innerWidth/8000   //  Denna är viktig för att skala om korten. Däremot beror denna på skärmstorleken på ett dumnt sätt.
                                            //  Jag hoppas att jag kan lösa detta inom kort. /Björn 
    }
  },
  computed: {
    playerId: function() { return this.$store.state.playerId},
  },
  mounted() {
  window.addEventListener('resize', () => {
    this.scalefactor = window.innerWidth/8000   // Här är funktionen för skalningen. Denna gör specifikt så att det ändras baserat på skärmskalan.
    })
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
        this.raiseItems=d.raiseItems;
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

    this.$store.state.socket.on('collectorsAuctionStarted',
      function(d) {
        console.log(d.playerId, "started auction");
        this.players = d.players;
        this.auctionCards = d.auctionCards;
      }.bind(this)
    );

    this.$store.state.socket.on('playerPicked',
      function(d) {
        console.log( "spelare vald");
        this.gameStarted = true;
        this.players = d.players;
        this.round = d.round;
         console.log( "Det är runda: " + this.round);
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
    expandLeftBoard: function(){
      console.log("Left click mf");
      this.leftIsActive = !this.leftIsActive;
      console.log("status: "+ this.leftIsActive);
    },
    expandRightBoard: function(){
      console.log("Right click mf");
      this.rightIsActive = !this.rightIsActive;
      console.log("status: "+ this.rightIsActive);
    },
    expandTopBoard: function(){
      console.log("Top click mf");
      this.topIsActive = !this.topIsActive;
      console.log("status: "+ this.topIsActive);
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
          cost: this.chosenPlacementCost
        }
      );

    },

     startAuction: function (card) {
      console.log("startAuction", card);
      this.$store.state.socket.emit('collectorsStartAuction', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.chosenPlacementCost
        }
      );

    },


    startTurn: function () {
      console.log("hola",);
  
      this.$store.state.socket.emit('startTurn', {
        roomId:this.$route.params.id
        }
      );
    },
    nextPlayer: function () {
      this.$store.state.socket.emit('nextPlayer', {
        roomId: this.$route.params.id,
        
        playerId: this.playerId,
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
    grid-row: 1;
    grid-template-columns: repeat(auto-fill, 12vw); /* Det här är en koddel som bestämmer avståndet mellan korten, typ. */
    grid-template-rows: repeat(auto-fill, 12vw);
    /*justify-content: space-evenly;*/
  }
  .card{
    position: relative;
  }
  /* transform: scale(0.5)translate(-50%,-50%);*/
  
  .cardslots div {
    
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
  }
  
  .cardslots div:hover {
    transform: scale(1)translate(-25%,0);
    z-index: 1;
  }

  #wrapper{
    margin: 5vw;
    padding: 5vw;
    justify-self: center;
  }

  #grid {
    display: grid;
    grid-gap: 1vw;
    margin: 2vw;
    justify-content:center;   /* dessa 2 centrerar horisontellt respektive vertikalt */
    align-items:center;
    min-height: 0;
    object-fit: contain;
  }
  /*
  Här kan vi testa att sätta en storlek på grid eller wrapper och göra om storlekarna nedan till t.ex. %avParent för att få till så det hamnar inne i skärmen.
  Det här är bara en påminnelse till mig själv /Björn
  */

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
    grid-column: 2;
    grid-row: 1;
    background-color: #7e2174;
    text-align:center;
    height:10vw;
  }
  /*  
      På alla dessa finns max-height eller motsvarande, dessa får vi leka runt med tills vi hittar något bra
      Men korten måste skalas bra innan vi kan göra detta ordentligt
  */
  .playerTop{
    grid-column: 3;
    grid-row: 1;
    background-color: #19b3a7;
    height: 10vw;
    text-align: center;
  }
  .playerRight{
    grid-column: 4;
    grid-row: 1;
    background-color: #ca9e68;
    text-align:center;
    height:10vw;
  }
  .playerboard{  /* Denna ska göras om till "Player board" eller liknande där handen inkluderas*/
    border-radius: 15px;
    background-color: rgb(70, 181, 214); /* Choose colour based on the 4 player colours */
    grid-column: 2 /span 3;
    grid-row: 5;
    min-height: 0;
    margin-top: -10%;
    align-self: end;
  }


/* Hover över spelarområdena*/
  .playerboard:hover{
    background-color: rgb(95, 216, 253);
  }
  .playerLeft:hover{
   background-color:#c236b4;
  }
  .playerRight:hover{
    background-color: #fdc683;
  }
  .playerTop:hover{
    background-color: #20ccbe;
  }

  
/* Om man klickar på handen aktiveras denna. Denna ger attribut bara om isActive på divven = true */
  .playerboard.active{
    background-color: rgb(95, 216, 253);
    margin-top: -100%;
    height: 50vh;
    align-self: end;
    width: 110%;
    justify-self: center;
    z-index: 1;
  }

/* Om man klickar på spelaren i topp */
 .playerTop.active{
    background-color: #20ccbe;
    text-align: center;
    height: 80%;
    width: 250%;
    justify-self: center;
    margin-left: initial;
    margin-top: 100px;
    z-index: 1;
  }

/* Om man klickar på spelaren till vänster */
.playerLeft.active {
    background-color:#c236b4;
    margin-right: -100%;
    width: 250%;
    height: 80%;
    justify-self:self-start;
    margin-top: 100px;
    z-index: 1;
  }

/* Om man klickar på spelaren till höger */
  .playerRight.active {
    background-color: #fdc683;
    width: 250%;
    height: 80%;
    justify-self: end;
    margin-top: 100px;
    z-index: 1;
  }

  /*
  Här nedan är CSS specifika för kortrutorna
  */

  .items{
    border-radius: 15px;
    background-color:#f8dcce;
    grid-column: 2 /span 3;
    grid-row: 2;
    margin-top: 2.5vw;
    margin-right: 2.5vw;
    contain:content;
    justify-content:center;
    align-content:center;
  }
  .itemgrid{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;/*20% 20% 20% 20% 20%;*/
    /*padding-top: 2vw;
    padding-left: 2vw;*/
    padding:2vw;
  }

  .skills{
    border-radius: 15px;
    background-color: #dfeccc;
    grid-column: 2 /span 3;
    grid-row: 3;
    margin-right: 2.5vw;
    contain:content;
    justify-content:center;
    align-content:center;
  }
  .skillsgrid{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding-top: 2vw;        /* Detta måste göras om... Otroligt ful lösning för tillfället. */
    padding-left: 2vw;
    padding:2vw;
  }

  .raiseValue{
    border-radius: 15px;
    background-color: #cfdcf2;
    grid-column: 2 /span 3;
    grid-row: 4;      /* This might need to change to 32 when we implement cards with padding-left: 2vw in here. */ 
    margin-bottom: 2.5vw;
    margin-right: 2.5vw;
  }
  .raiseValuegrid{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding:2vw;
  }
  .auction{
    border-radius: 15px;
    background-color: #f5f2cc;
    grid-column: 1;
    grid-row: 2 /span 3;
    width: 15vw;
    height: 37vw; /* items+skills+raise value+distanceBetween på ett ungefär*/
  }
  .auctiongrid{
    display:grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  }
  .auctiongrid div{
    zoom: 0.4;
  }
  .work{
    text-align:center;
    border-radius: 15px;
    background-color: grey;
    grid-column: 5;
    grid-row: 2 /span 3;
    height: 37vw;
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

/*                      NOTES: 
    Here are notes from the supervision sessions

    https://stackoverflow.com/questions/47219272/how-can-i-use-window-size-in-vue-how-do-i-detect-the-soft-keyboard
    split image into tiles: https://codepen.io/Escu/pen/KVLBYP
    

*/