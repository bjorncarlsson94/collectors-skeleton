
<template>
  <div>
    <main>
      <section id="wrapper">
      <div id="grid">
          <div class="otherPlayers">
          <div class="player player2" v-on:click="expandLeftBoard"  v-bind:class="{ active: leftIsActive }">
            {{labels.player2}}
            <!--Here are the player specific things-->
          </div>
          <div class="player player3" v-on:click="expandTopBoard"  v-bind:class="{ active: topIsActive }">
            {{labels.player3}}
            <!--Here are the player specific things-->
          </div>
          <div class="player player4" v-on:click="expandRightBoard"  v-bind:class="{ active: rightIsActive }">
            {{labels.player4}}
            <!--Here are the player specific things-->
          </div>
        </div>
        <div class="skills">
          <div class="skillsgrid">
            <CollectorsSkillActions v-if="players[playerId]"
                :labels="labels"
                :player="players[playerId]"
                :skillsOnSale="skillsOnSale"
                :marketValues="marketValues"
                :placement="skillPlacement"
                @buySkill="buySkill($event)"
                @placeBottle="placeBottle('skill', $event)"/>
          </div>
        </div>
        <div class="auction">
          <div class="auctiongrid">
              <CollectorsStartAuction v-if="players[playerId]"
                :labels="labels"
                :player="players[playerId]"
                :auctionCards="auctionCards"
                :marketValues="marketValues"
                :placement="auctionPlacement"
                @startAuction="startAuction($event)"
                @placeBottle="placeBottle('auction', $event)"/>
          </div>
        </div>
        <div class="upforAuction" v-show="auctionActive" v-if="players[playerId]">
          <div class="auctionLeader">
             Leader: {{auctionLeaderId}}
             </div>
             <div class="auctionBid">
             {{bid-auctionPrice}}+
             </div>
             <div class="auctionMoney">
             {{bid}}$
          </div>
          <div class="auctionCardView">
            <CollectorsCard v-for="(card, index) in cardInAuction" :card="card" :key="index"/>
          </div>
          
          <button class="auctionButtons" v-if="players[playerId]" :disabled="0<bid-auctionPrice || !players[playerId].turn || bid<1" @click="placeBid()">
            Skip 
          </button>
          <button class="auctionButtons" v-if="players[playerId]" :disabled="bid<auctionPrice+1 || !players[playerId].turn" @click="placeBid()">
            Place bid 
          </button>
          <button class="auctionButtons" v-if="players[playerId]" :disabled="!players[playerId].turn || bid<auctionPrice+1" @click="bid -= 1">
            -
          </button>
          <button class="auctionButtons" v-if="players[playerId]" :disabled="!players[playerId].turn || players[playerId].money<bid+1" @click="bid += 1">
             +
          </button>
        </div>
        <div class="raiseValue">
          <div class="raiseValuegrid">
            <CollectorsRaiseValue v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :raiseItems="raiseItems"
              :raiseValue="raiseValue"/>
          </div>
        </div>
        
        
          <!-- Gav en class som beror på bolean isActive. Den ändras mellan true och false i 'expandPlayerBoard'-->
          
          <div
            class="playerboard"
            v-if="players[playerId]"
            @click="expandPlayerBoard()"
            v-bind:class="{ active: isActive }"
          >
            <!-- Visas när handen är stängd-->
            <div v-if="!isActive">
            
            <h1>Your board</h1>
            <h1>Total collection value:</h1>
            </div>
            
            
            <!-- Visas när handen är öppen-->
            <div class= "playerBoardGrid" v-if="isActive">
             
              <div class= "boardCollection" >
              <div class="help"><p>?</p></div>
                <div class="boardcollectiongrid">
                
                <div class= "playercollection">
                  Collection:
                  <div class="collectioncards">
                  <CollectorsCard
                  v-for="(card, index) in players[playerId].items"
                    :card="card"
                    :availableAction="card.available"
                    @doAction="buyCard(card)"
                    :key="index"
                  />
                  </div>
                  </div>
                <div>  
                  Hidden:
                </div>
                <div>
                  Total value:
                </div>
              </div>

              </div>
              <div class = "boardSkills">
              Skills:
                <div class="skillsinhand">
                <CollectorsCard
                  v-for="(card, index) in players[playerId].skills"
                 :card="card"
                 :availableAction="card.available"
                 @doAction="buyCard(card)"
                 :key="index"
               />
               </div>
             </div>
             <div class = "boardHand">
              <p id="handTitle">Hand:</p>
              <div class= "cardsinhand">
                <CollectorsCard
                  v-for="(card, index) in players[playerId].hand"
                 :card="card"
                 :availableAction="card.available"
                 @doAction="buyCard(card)"              
                 :key="index"
               />
               </div>
             </div>

            <div class="boardNextTurnInfo">Next turn info</div>

          </div>
        </div>
        
        <button v-if="isActive" @click="closeBoard" class="boardclosebutton">
              Close!
              </button>
        
        
        <!--

                    VIKTIGT!!!

        Just nu är Skills och Items slotsen för spelarens items/skills. Här måste vi göra så att dessa är för spelplanen
        det vill säga flytta in köpegrejerna in i divarna här. Sen måste det göras nya divvar inne i spelarens hand (som borde bli player board eller
        liknande istället. Här ska Hand, Items, skills visas som de visas nu. Alla kort måste skalas om i visningen enligt samma princip som rutorna.

        -->

        <div class="items">
          <div class="itemgrid">
            <CollectorsBuyActions v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :itemsOnSale="itemsOnSale"
              :marketValues="marketValues"
              :placement="buyPlacement"
              :raiseValue="raiseValue"
              @buyCard="buyCard($event)"
              @placeBottle="placeBottle('buy', $event)"/>
          <!--<CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>-->
          </div>
        </div>
        <div class="work">
          <div class="workgrid">
            <div class="workslot5"></div>
            <div class="workslot4"></div>
            <div class="workslot3"></div>
            <div class="workslot2"></div>
            <div class="workslot1"></div>
          </div>
        </div>

        <div class="roundCounter">
          <p>
            {{labels.roundcounter}} {{ round }}
          </p>
          <p>
            Det är {{ currentPlayer() }} tur att spela!
          </p>
        </div>
        <div class="drawCardSpace">
          <div class="buttons">
            <button @click="drawCard">
            {{ labels.draw }}
            </button>
          </div>
        </div>
        <div class="gridedge3">
          Ruta för att visa grid lättare: 3
          <br>
          Här kan man t.ex. ha vissa viktiga knappar
        </div>
        <div class="menuSpace">
          <button v-if="players[playerId]" :disabled="this.gameStarted" @click="startTurn()">
            {{labels.randomplayer}}
          </button>
          <button v-if="players[playerId]" :disabled="!players[playerId].turn" @click="nextPlayer()">
            {{labels.endTurn}}
            </button>
          <button v-if="players[playerId]" @click="auctionBoard()">
            {{labels.showAuction}} 
          </button>
          <button  @click="moveCards()">
           hola olle testa här :) 
          </button>
        </div>
      </div>
      </section>
     
    </main>
    
    {{players}}
    {{raiseValue}}
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
    CollectorsStartAuction,

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
      cardInAuction:[],
      raiseItems:[],
      raiseValue:{ fastaval: 0,
                     movie: 0,
                     technology: 0,
                     figures: 0,
                     music: 0 },
      playerid: 0,
      round: 0,
      startingPlayerId: null,
      auctionAvailable: false,
      auctionActive: false,
      currentPlayerId: null,
      auctionPrice: 0,
      bid: 0,
      auctionLeaderId: null,
      auctionWinnerId: null,
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
        this.cardInAuction = d.cardInAuction;
        this.auctionPrice = d.auctionPrice
        //här skapas både raise Item och Raise value. innan denna körs så finns inget rum. Följ raise Value till datahandler.
        this.raiseItems=d.raiseItems;
        this.raiseValue=d.raiseValue;
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
        console.log(d.playerId, "started auction "+ this.cardInAuction);
        this.players = d.players;
        this.auctionCards = d.auctionCards;
        this.cardInAuction = d.cardInAuction;
        this.auctionActive = true;
        this.auctionPrice = 0;

      }.bind(this)
    );

    this.$store.state.socket.on('auctionRound',
      function(d) {
        if (d.auctionLeaderId == null){
          this.auctionPrice = 0;
          this.auctionLeaderId = null;
          this.bid = 0;
          this.cardInAuction = d.cardInAuction;
          this.auctionActive = false;
        }
        else {
          this.auctionPrice = d.auctionPrice;
          this.auctionLeaderId = d.auctionLeaderId;
          this.players = d.players;
          this.bid = d.auctionPrice;
          this.cardInAuction = d.cardInAuction;
      }
        this.players = d.players;
      }.bind(this)
    );
     this.$store.state.socket.on('cardsMoved',
      function(d) {
        this.raiseValue=d.raiseValue;
        this.raiseItems=d.raiseItems;
        this.skillsOnSale=d.skillsOnSale;
        this.itemsOnSale=d.itemsOnSale;
        this.auctionCards=d.auctionCards;
        this.players = d.players;
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
    currentPlayer: function (){
      var keys = Object.keys(this.players);
      
      for (var i = 0; i < keys.length; i++){
        if (this.players[keys[i]].turn == true){
          this.currentPlayerId = keys[i];
        }
      }
      return this.currentPlayerId
    },
    auctionBoard: function(){
      console.log("auction rutaa");
      this.auctionActive = !this.auctionActive;
      console.log("status: "+ this.auctionActive);
    },
    expandPlayerBoard: function(){
      console.log("Player click");
      
      // Sätter till true för att öppna brädet
      if(this.isActive === true)
			{
				return;
      }

      this.openBoard();
			
      
      /* Stänger de andra */
      this.rightIsActive = false;
      this.topIsActive = false;
      this.leftIsActive = false;

      console.log("Status: "+ this.isActive);
    },
    openBoard: function(){
      console.log("Open board");
      // Sätter till true för att öppna brädet
        this.isActive = true;
      console.log("Status: "+ this.isActive);
    },
    closeBoard: function(){
      console.log("Close BUTTON!");
      
      // Sätter till false för att stänga brädet
      this.isActive = false;

      console.log("Status: "+ this.isActive);
    },
    expandLeftBoard: function(){
      console.log("Left click");
      this.leftIsActive = !this.leftIsActive;
      
      /* Stänger de andra */
      this.rightIsActive = false;
      this.topIsActive = false;
      this.isActive = false;

      console.log("status: "+ this.leftIsActive);
    },
    expandRightBoard: function(){
      console.log("Right click");
      this.rightIsActive = !this.rightIsActive;
      
      /* Stänger de andra */
      this.leftIsActive = false;
      this.topIsActive = false;
      this.isActive = false;
      console.log("status: "+ this.rightIsActive);
    },
    expandTopBoard: function(){
      console.log("Top click");
      this.topIsActive = !this.topIsActive;

      /* Stänger de andra */
      this.leftIsActive = false;
      this.rightIsActive = false;
      this.isActive = false;

      console.log("status: "+ this.topIsActive);
    },

    placeBottle: function (action, cost) {
      if (action==='auction'){
        this.auctionAvailable = true;
      }
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
          cost: this.chosenPlacementCost
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
      this.auctionAvailable = false;
      this.$store.state.socket.emit('collectorsStartAuction', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.chosenPlacementCost
        }
        
      );

    },


    buyCardOrAuction: function(card){
      if(this.auctionAvailable == true){
        console.log("Starta en auktion");
        return this.startAuction(card)
      }
      else{
        console.log("Köp ett kort istället");
        return this.buyCard(card)
      }
    },



    placeBid: function () {
      console.log("bid innan:"+this.bid);
       this.$store.state.socket.emit('auctionBid', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          bid: this.bid,
          auctionPrice: this.auctionPrice
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
    moveCards: function(){
      this.$store.state.socket.emit('moveCards', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        
        }

      );
    },
    nextPlayer: function () {
      this.$store.state.socket.emit('nextPlayer', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        auctionActive: this.auctionActive
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
  .helpText{
    width: 100%;
    height: 100%;
    display: table-cell;
    vertical-align: middle;

  }

  #wrapper{
    padding: 5vw;
    justify-self: center;
    position: relative;
  }

  #grid {
    display: grid;
    grid-gap: 0.5vw;
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
    border-radius: 2vw;
  }
  .otherPlayers{
    grid-column: 6;
    grid-row: 2;
  }
  .player2{
    grid-column: 2;
    grid-row: 1;
    background-color: #7e2174;
    text-align:center;
    height:2vw;
    width: 7vw;
    font-size: 1.5vw;
    margin-bottom: 0.5vw;
  }
  .player3{
    grid-column: 3;
    grid-row: 1;
    background-color: #19b3a7;
    height: 2vw;
    width: 7vw;
    text-align: center;
    font-size: 1.5vw;
    margin-bottom: 0.5vw;
  }
  .player4{
    grid-column: 4;
    grid-row: 1;
    background-color: #ca9e68;
    text-align:center;
    height:2vw;
    width: 7vw;
    font-size: 1.5vw;
  }
  .playerboard{ 
    border-radius: 2vw;
    background-color: rgb(70, 181, 214); /* Choose colour based on the 4 player colours */
    grid-column: 1 /span 4;
    grid-row: 3;
    height: 5vw;
    width: 20vw;
    padding:2vw;
    justify-self:center;
    align-self: flex-end;
    font-size: 1vw;
    
    cursor: pointer;
  }

/* Hover över spelarområdena*/
  .playerboard:hover{
    background-color: rgb(95, 216, 253);
  }
  .player2:hover{
   background-color:#c236b4;
  }
  .player4:hover{
    background-color: #e9b77a;
  }
  .player3:hover{
    background-color: #20ccbe;
  }
  
  /* Om man klickar på handen aktiveras denna. Denna ger attribut bara om isActive på divven = true */
  .playerboard.active {
    background-color: rgb(95, 216, 253);
    margin-top: -110%;
    width: 50vw;
    height: 25vw;
    align-self: end;
    justify-self: center;
    z-index: 1;
    font-size: 1vw;
    cursor:default;
  }

  .playerBoardGrid{
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 2fr;
    border-radius: 2vw;
    height: 100%;
  }

  .boardCollection{
    grid-row: 1/4;
    grid-column: 1 /3;
    border-radius: 2vw 0 0 0;
    background-color:#ca6058;
    padding: 1vw;
    overflow: hidden;
  }

  .boardcollectiongrid{
    display: grid;
    position: relative;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 4fr 1fr;
    height: 100%;
  }

  .playercollection{ 
    grid-row: 1;
    grid-column: 1;
    background-color:#d47871;
    border-radius: 2vw;
  }
  .collectioncards{
    display: grid;
    grid-template-columns: repeat(auto-fill, 1.5vw);
  }

  .boardHand{
    grid-row: 4;
    grid-column: 1 / 3;
    overflow: hidden;
    background-color: #e9e78a;
    
    border-radius: 0 0 0 2vw;
    padding: 1vw;
  }
  .cardsinhand{
    display: grid;
    grid-template-columns: repeat(auto-fill, 2vw);
    padding: 0.5vw;
    background-color: #eeedb8;
    border-radius: 2vw;
  }
  #handTitle{
    position: absolute;
    background-color: gray;
    border-radius: 2vw;
  }

.boardSkills{
    border-radius: 0 2vw 0 0;
    background-color: #bddf8c;
    grid-column: 3/5;
    grid-row: 1/4;
  }

.skillsinhand{
 display: grid;
  grid-template-columns: repeat(auto-fill, 2.5vw);
  z-index: 1;
  margin: 1vw;
  border-radius: 2vw;
  background-color: #cde0b2;
  }

.boardNextTurnInfo{
  grid-row: 4;
  grid-column: 3/5;
  background-color: gray;
  border-radius: 0 0 2vw 0;
}

  .boardclosebutton{
    grid-row: 3;
    grid-column: 3;
    align-self: flex-end;
    z-index: 1;
    cursor: pointer;
  }

  /* Om man klickar på spelaren i topp */
  .player3.active{
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
  .player2.active {
    background-color:#c236b4;
    margin-right: -100%;
    width: 250%;
    height: 80%;
    justify-self:self-start;
    margin-top: 100px;
    z-index: 1;
  }

  /* Om man klickar på spelaren till höger */
  .player4.active {
    background-color: #e9b77a;
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
    border-radius: 2vw;
    background-color:#f8dcce;
    grid-column: 1 /span 2;
    grid-row: 1;
    width:31vw;
  }
  .skills{
    border-radius: 2vw;
    background-color: #dfeccc;
    grid-column: 1 /span 2;
    grid-row: 2;
    width:31vw;
  }
  .raiseValue{
    border-radius: 2vw;
    background-color: #cfdcf2;
    grid-column: 4 /span 2;
    grid-row: 2; 
    justify-content:center;
    width:31vw;
  }
  .raiseValuegrid div{
    font-size: 1vw;
    font-weight:bold;
    color: black;
  }
  .auction{
    border-radius: 2vw;
    background-color: #f5f2cc;
    grid-column: 4;
    grid-row: 1 /span 1;
    width: 32vw;
    height: 12vw; /* items+skills+raise value+distanceBetween på ett ungefär*/
    justify-content:center;
    justify-self: center;
  }
  .upforAuction{
    display: grid;
    position: absolute;
    grid-template-rows: 20% 60% auto;
    grid-template-columns: auto auto auto auto;
    width: 40vw;
    height: 40vw;
    background-color: #f5efa0;
    border-radius: 2vw;
    border-style: solid;
    border-width: 0.4vw;
    border-color: black;
    z-index:50;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
   .auctionCardView{
    zoom: 4;
    position: absolute;
    align-content: center;
    transition: auto;
    transform: translate(50%, 25%);
  }
  .auctionButtons{
    margin: 1vw;
    border: 1vw;
    border-radius: 2vw;
    font-size: 2vw;
    border-color: black;
    grid-row-start: 3;
    align-self: bottom;
    background-color:rgb(180, 180, 180);
    transition-duration: 0.2;
    cursor:pointer;
    box-shadow: 0 0.3vw #999;
  }
  .auctionButtons:hover{
    background-color: greenyellow;
  }
  .auctionMoney{
    
    grid-row: 1;
    font-size: 5vw;
    grid-column-start: 4;
    text-align: center;
    color: darkgreen;
  }
  .auctionBid{
    
    grid-row: 1;
    font-size: 5vw;
    grid-column-start: 3;
    text-align: left;
    color: rgb(0, 209, 0);
  }
  .auctionLeader{
    font-size: 2.5vw;
    grid-row: 1;
    grid-column: 1/3;
    text-align: center;
    color: rgb(0, 0, 0);
  }
  .work{
    text-align:center;
    border-radius: 2vw;
    background-color: grey;
    grid-column: 3;
    grid-row: 1 /span 2;
    height: 37vw;
    width: 15vw;
    justify-self: left;
  }
  .workgrid{
    display:grid;
    grid-template-columns: 1fr;
    grid-template-rows: 5vw 5vw 5vw 5vw 5vw;
    grid-gap: 2vw;
    padding: 2vw;
  }
  .workgrid div{
    background-color: rgb(207, 207, 207);
    border-radius: 1vw;
    border-style: dotted;
    border-color: black;
    height: 5vw;
    width: auto;
  }
  .workslot1{
    background-image: url("/images/Work1_png.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .workslot2{
    background-image: url("/images/Work2_png.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .workslot3{
    background-image: url("/images/Work3_png.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .workslot4{
    background-image: url("/images/Work4_png.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .workslot5{
    background-image: url("/images/Work5_png.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .roundCounter{
    grid-column: 1;
    grid-row: 3;
    background-color:rgb(194, 194, 194);
    border-radius: 2vw;
    padding:2vw;
    height: 8vw;
    width: 8vw;
    justify-self: center;
    text-align: center;
    font-size: 1vw;
  }
  .drawCardSpace{
    grid-column: 2;
    grid-row: 3;
    background-color:rgb(194, 194, 194);
    border-radius: 2vw;
    padding:2vw;
    height: 8vw;
    width: 3vw;
    text-align: center;
    justify-self:left;
  }
  .gridedge3{
    grid-column: 4;
    grid-row: 3;
    background-color:rgb(194, 194, 194);
    border-radius: 2vw;
    padding:2vw;
    max-height: 8vw;
    max-width: 8vw;
    font-size: 1vw;
    justify-self:center;
    align-self: flex-end;
  }
  .menuSpace{
    grid-column: 4;
    grid-row: 3;
    background-color:rgb(194, 194, 194);
    border-radius: 2vw;
    padding: 2vw;
    max-height: 10vw;
    max-width: 5vw;
    text-align: center;
    justify-self:right;
    align-self: flex-end;
  }
  .buttons{
    display:inline-block;
    color: grey;
    background-color: lightcoral;
    border-radius:1vw;
    box-shadow: 0 0.3vw #999;
  }
  .buttons:active{
    background-color: coral;
    box-shadow: 0 0.2vw #999;
    transform: translateY(0.1vw);
  }
  .buttons:hover{
    background-color: coral;
  }
  .menuSpace > * {  /* This makes the buttons in the grid element smaller - redo this with proper scaling. Arbitrary magic number right now */
    zoom: 0.8;
    
  }
  .help{
    width:40px;
    height: 40px;
    border-radius: 25px;
    position: absolute;
    right:0;
    display: flex;
    justify-content: center;
    align-items: center;
    
    background-color: blue;
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

    https://stackoverflow.com/questions/2430206/how-can-i-scale-an-image-in-a-css-sprite
    

*/