<template>
  <div class="bodytest">
    <main>
      <let-it-snow v-bind="snowConf" :show="show1"></let-it-snow>
      <section id="wrapper">
        <div id="grid">
          <div class="helpBoard" @click="showHelpOptions">
            <p><strong>?</strong></p>
          </div>
          <div class="playerJoinedBox" v-show="playerJoined">
            <div class="playerText1">{{ labels.playerIntro1 }}</div>
            <input class="playerText" type="text" v-model="pname" />

            <div class="playerText2">{{ labels.playerIntro2 }}</div>
            <div
              class="colorChoice"
              v-for="index in playerColor.length"
              :key="index"
            >
              <div
                class="theColor"
                :style="{ background: playerColor[index - 1] }"
                @click="players[playerId].color = playerColor[index - 1]"
              ></div>
            </div>
            <!-- :disabled="pname == '' || players[playerId].color == null" -->
            <button class="enterPlayerInfo" @click="playerInfo()">Enter</button>
          </div>

          <div class="otherplayers">
            <div
              v-for="(player, index) in players"
              :key="index"
              :style="
                player === players[playerId]
                  ? 'display: none'
                  : 'display: inline-block'
              "
            >
              <div v-if="player != players[playerId]">
                <div
                  class="otherplayer"
                  v-bind:class="{ open: player.playerIsActive }"
                  @click="expandOtherPlayer(player)"
                  :style="{ background: player.color }"
                >
                  <div v-if="!player.playerIsActive"
                  class="otherPlayerClosed"
                  >
                  {{ player.name }} 
                  <div class="closedCardsInHand">
                        <CollectorsCard
                          v-for="(card, index) in player.hand"
                          :card="card"
                          :key="index"
                          class="otherHand otherClosed" 
                        />
                      </div>
                      
                  <div class="scoreDisplay"> Score: {{ player.currentScore }} </div>
                  
                  </div>

                  <div
                    class="playerBoardGrid"
                    v-if="player.playerIsActive === true"
                  >
                    <div class="boardCollection">
                      <div id="collectiontitle">Collection:</div>
                      <div class="boardcollectiongrid">
                        <div class="playercollection">
                          <div class="collectioncards">
                            <CollectorsCard
                              v-for="(card, index) in player.items"
                              :card="card"
                              :availableAction="card.available"
                              @doAction="buyCard(card)"
                              :key="index"
                            />
                          </div>
                        </div>
                        <div id="hidden">Hidden:</div>
                        <div class="itemicons">
                          <div> <img src="/images/fastaval.png" width="50%"> {{ player.itemValues.ifastaval }}</div>
                          <div> <img src="/images/figures.png" width="50%"> {{ player.itemValues.ifigures }}</div>
                          <div> <img src="/images/music.png" width="50%"> {{ player.itemValues.imusic }}</div>
                          <div> <img src="/images/movie.png" width="50%"> {{ player.itemValues.imovie }}</div>
                          <div> <img src="/images/tech.png" width="50%"> {{ player.itemValues.itechnology }}</div>
                        </div>

                        <div id="totalvalue">Amount of items: {{ player.itemValues.ifastaval + player.itemValues.ifigures + player.itemValues.imusic + player.itemValues.imovie + player.itemValues.itechnology}}

                        </div>
                      </div>
                    </div>
                    <div class="boardSkills">
                      Skills:
                      <div class="skillsinhand">
                        <CollectorsCard
                          v-for="(card, index) in player.skills"
                          :card="card"
                          :availableAction="card.available"
                          @doAction="buyCard(card)"
                          :key="index"
                        />
                      </div>
                    </div>
                    <div class="boardHand">
                      <div id="handTitle">Hand:</div>
                      <div class="cardsinhand">
                        <CollectorsCard
                          v-for="(card, index) in player.hand"
                          :card="card"
                          :key="index"
                          class="otherHand"
                        />
                      </div>
                    </div>

                    <div class="boardNextTurnInfo">Next turn income</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="test1"
            :class="['skills', { animate: helpAction }]"
            @click="skillsHelp()"
          >
            <div class="skillsgrid">
              <CollectorsSkillActions
                v-if="players[playerId]"
                :labels="labels"
                :players="players"
                :player="players[playerId]"
                :skillsOnSale="skillsOnSale"
                :marketValues="marketValues"
                :placement="skillPlacement"
                :notYourTurn="notYourTurn"
                :aboutToBuySkill="aboutToBuySkill"
                @buySkill="buySkill($event)"
                @placeBottle="placeBottle('skill', $event)"
              />
            </div>
          </div>
          <div
            :class="['auction', { animate: helpAction }]"
            @click="auctionHelp()"
          >
            <div class="auctiongrid">
              <CollectorsStartAuction
                v-if="players[playerId]"
                :labels="labels"
                :player="players[playerId]"
                :players="players"
                :auctionCards="auctionCards"
                :marketValues="marketValues"
                :placement="auctionPlacement"
                :hiddenAuctionCardFN="hiddenAuctionCardFN"
                :notYourTurn="notYourTurn"
                :hiddenAuctionCard="hiddenAuctionCard"
                :aboutToStartAuction="aboutToStartAuction"
                @startAuction="startAuction($event)"
                @placeBottle="placeBottle('auction', $event)"
              />
            </div>
          </div>
          <div
            class="auctionMini"
            v-show="auctionMiniActive"
            v-if="players[playerId]"
            @click="auctionMiniActiveNow()"
          >
            {{ bid }}$
            <div class="auctionCardViewMini">
              <CollectorsCard
                v-for="(card, index) in cardInAuction"
                :card="card"
                :key="index"
              />
            </div>
          </div>
          <div class="winnerAuction" v-show="winnerAvailable">
            <div class="winnerText">
              You won the auction!!! Where do you want to place your card?
            </div>
            <div class="auctionCardViewFin">
              <CollectorsCard
                v-for="(card, index) in cardInAuction"
                :card="card"
                :key="index"
              />
            </div>
            <button
              class="auctionButtonWinner button1"
              v-if="players[playerId]"
              @click="auctionOver('items')"
            >
              Items
            </button>
            <button
              class="auctionButtonWinner button2"
              v-if="players[playerId]"
              @click="auctionOver('skills')"
            >
              Skills
            </button>
            <button
              class="auctionButtonWinner button3"
              v-if="players[playerId]"
              :disabled="!hiddenAuctionCard"
              @click="auctionOver('secret')"
            >
              Secret
            </button>
            <button
              class="auctionButtonWinner button4"
              v-if="players[playerId]"
              @click="auctionOver('raiseValue')"
            >
              Market share
            </button>
          </div>
          <div class="loserAuction" v-show="loserAvailable">
            You Lost.. {{ playerName(auctionLeaderId) }} won the auction!
            <button
              class="auctionButtonLoser"
              v-if="players[playerId]"
              @click="loserAvailable = false"
            >
              OK
            </button>
          </div>
          <CollectorsAuction
            v-if="players[playerId]"
            :auctionActive="auctionActive"
            :labels="labels"
            :cardInAuction="cardInAuction"
            :players="players"
            :bid="bid"
            :auctionLeaderId="auctionLeaderId"
            :auctionPrice="auctionPrice"
            :playerId="playerId"
            :hiddenAuctionCard="hiddenAuctionCard"
            :auctionCardPaymentActive="auctionCardPaymentActive"
            :auctionMiniActiveNow="auctionMiniActiveNow"
            :openCloseBuyWithCard="openCloseBuyWithCard"
            :addBid="addBid"
            :subBid="subBid"
            :addNumber="addNumber"
            :biddingCards="biddingCards"
            :cardBidTotal="cardBidTotal"
          />

          <div
            :class="['raiseValue', { animate: helpAction }]"
            @click="raiseValueHelp()"
          >
            <div class="raiseValuegrid">
              <CollectorsRaiseValue
                v-if="players[playerId]"
                :labels="labels"
                :player="players[playerId]"
                :players="players"
                :raiseValue="raiseValue"
                :skillOnSale="getLastElement(skillsOnSale)"
                :auctionCard="getLastElement(auctionCards)"
                :placement="marketPlacement"
                :marketValues="marketValues"
                :notYourTurn="notYourTurn"
                :aboutToRaiseValue="aboutToRaiseValue"
                @placeBottle="placeBottle('market', $event)"
                @raiseValue="raisingValue($event)"
              />
            </div>
          </div>
          <!-- Gav en class som beror på bolean isActive. Den ändras mellan true och false i 'expandPlayerBoard'-->
          <div
            class="playerboard"
            :style="{ background: players[playerId].color }"
            v-if="players[playerId]"
            @click="expandPlayerBoard()"
            v-bind:class="{ active: isActive }"
          >
            <!-- Visas när handen är stängd-->
            <div v-if="!isActive">
              <div class="closedBoardGrid">
                <div class="closedBoardHand">
                  <div class="closedCardsInHand">
                    <CollectorsCard
                      v-for="(card, index) in players[playerId].hand"
                      :card="card"
                      :availableAction="card.available"
                      @doAction="buyCard(card)"
                      :key="index"
                    />
                  </div>
                </div>

                <div class="closedBoardHandBackground"></div>

                <div class="totalValue">
                  Hej
                  <!-- playerMoney -->
                <div class="playerMoney">{{ getCurrentScore() }}
                  <div class="itemicons">
                    <div> <img src="/images/fastaval.png" width="150%"> {{ players[playerId].itemValues.ifastaval }}</div>
                    <div> <img src="/images/figures.png" width="150%"> {{ players[playerId].itemValues.ifigures }}</div>
                    <div> <img src="/images/music.png" width="150%"> {{ players[playerId].itemValues.imusic }}</div>
                    <div> <img src="/images/movie.png" width="150%"> {{ players[playerId].itemValues.imovie }}</div>
                    <div> <img src="/images/tech.png" width="150%"> {{ players[playerId].itemValues.itechnology }}</div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            <!-- Visas när handen är öppen-->
            <div class="playerBoardGrid" v-if="isActive">
              <div class="help" @click="helpPlayerHandHover">
                ?
                <div id="playerHelp" v-show="helpPlayerHandActive">
                  <h3>
                    <strong>{{ labels.helpPlayerHand.title }}</strong>
                  </h3>
                  <div>
                    <h3>
                      <strong>{{ labels.helpPlayerHand.itemArea }}</strong>
                    </h3>
                    <p>{{ labels.helpPlayerHand.itemAreaText }}</p>
                  </div>
                  <div>
                    <h3>
                      <strong>{{ labels.helpPlayerHand.skillsArea }}</strong>
                    </h3>
                    <p>{{ labels.helpPlayerHand.skillsAreaText }}</p>
                  </div>
                  <div>
                    <h3>
                      <strong>{{ labels.helpPlayerHand.handArea }}</strong>
                    </h3>
                    <p>{{ labels.helpPlayerHand.handAreaText }}</p>
                  </div>
                  <div>
                    <h3>
                      <strong>{{ labels.helpPlayerHand.nextTurn }}</strong>
                    </h3>
                    <p>{{ labels.helpPlayerHand.nextTurnText }}</p>
                  </div>
                  <div id="collectiontitle">Collection:</div>
                </div>
              </div>
              <div class="boardCollection">
                <div id="collectiontitle">Collection:</div>

                <div class="boardcollectiongrid">
                  <div class="playercollection">
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
                  <div id="hidden">Hidden:</div>


                  <div class="itemicons">
                    <div> <img src="/images/fastaval.png" width="50%"> {{ players[playerId].itemValues.ifastaval }}</div>
                    <div> <img src="/images/figures.png" width="50%"> {{ players[playerId].itemValues.ifigures }}</div>
                    <div> <img src="/images/music.png" width="50%"> {{ players[playerId].itemValues.imusic }}</div>
                    <div> <img src="/images/movie.png" width="50%"> {{ players[playerId].itemValues.imovie }}</div>
                    <div> <img src="/images/tech.png" width="50%"> {{ players[playerId].itemValues.itechnology }}</div>
                  </div>
                  <div id="totalvalue">Amount of items: {{ players[playerId].itemValues.ifastaval + players[playerId].itemValues.ifigures + players[playerId].itemValues.imusic + players[playerId].itemValues.imovie + players[playerId].itemValues.itechnology}} </div>

                  
                </div>
              </div>
              <div class="boardSkills">
                <div class="skillsinhand">
                  <CollectorsCard
                    v-for="(card, index) in players[playerId].skills"
                    :card="card"
                    :availableAction="card.available"
                    @doAction="buyCard(card)"
                    :key="index"
                  />
                </div>
                <div class="skillsInfo">
                  Tjo
                  <div>bipp</div>
                  <div>bapp</div>
                  <div>bopp</div>
                </div>
              </div>
              <div class="boardHand">
                <div id="handTitle">Hand:</div>
                <div class="cardsinhand">
                  <CollectorsCard
                    v-for="(card, index) in players[playerId].hand"
                    :card="card"
                    :availableAction="card.available"
                    @doAction="buyCard(card)"
                    :key="index"
                  />
                </div>
              </div>

              <div class="boardNextTurnInfo">
                Next turn income

                <img
                  src="/images/bottle-playerboard.png"
                  class="nextturnboard"
                />
                <!-- playerMoney -->
                <div class="playerMoney">{{ getCurrentScore() }}</div>
              </div>
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

          <div :class="['items', { animate: helpAction }]" @click="itemsHelp()">
            <div class="itemgrid">
              <CollectorsBuyActions
                v-if="players[playerId]"
                :labels="labels"
                :player="players[playerId]"
                :players="players"
                :itemsOnSale="itemsOnSale"
                :marketValues="marketValues"
                :placement="buyPlacement"
                :raiseValue="raiseValue"
                :aboutToBuyItem="aboutToBuyItem"
                :notYourTurn="notYourTurn"
                @buyCard="buyCard($event)"
                @placeBottle="placeBottle('buy', $event)"
                @cancelBuy="removeBottle('buy', $event)"
              />
              <!--<CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>-->
            </div>
          </div>
          <div :class="['work', { animate: helpAction }]" @click="workHelp()">
            <CollectorsWork
              v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :players="players"
              :round="round"
              :workPlacement="workPlacement"
              @recycleBottle="recycleBottle($event)"
              @recycleBottle4thRound="recycleBottle4thRound($event)"
              @workDrawTwoCards="workDrawTwoCards($event)"
              @drawACardAndFirstPlayerToken="
                drawACardAndFirstPlayerToken($event)
              "
              @drawCardAndPassiveIncome="drawCardAndPassiveIncome($event)"
              @placeWorker="placeWorker($event)"
              @drawCard="drawCard($event)"
              @addMoney="addMoney($event)"
            />
          </div>

          <div class="roundCounter">
            <p>{{ labels.roundcounter }} {{ round }}</p>
            <p>Det är {{ currentPlayer() }} tur att spela!</p>
          </div>

          <div class="drawCardSpace">
            <div
              :class="['buttons', { animate: helpAction }]"
              @click="buttonsHelp()"
            >
              <div @click="drawCard">
                <img src="/images/back-of-card.png" class="deck" />
              </div>
            </div>
            <div class="cardCounterSpace">
              <p class="drawCardCounter">
                {{ deckLength }}
              </p>
            </div>
          </div>
          <div class="gridedge3">
            <p>{{ labels.roundcounter }} {{ round }}/4</p>
          </div>
          <div
            :class="['menuSpace', { animate: helpAction }]"
            @click="menuSpaceHelp()"
          >
            <button
              v-if="players[playerId]"
              :disabled="this.gameStarted"
              @click="startTurn()"
              class="menuButton"
            >
              {{ labels.randomplayer }}
            </button>
            <button
              v-if="players[playerId]"
              @click="auctionBoard()"
              class="menuButton"
            >
              {{ labels.showAuction }}
            </button>
            <button @click="moveCards()" class="menuButton">
              hola olle testa här :)
            </button>
            <button @click="nextPlayer()" class="menuButton">
              nästa runda :)
            </button>
            <button @click="hiddenAuctionCard = true" class="menuButton">
              hidden auction card
            </button>

            <!--
              Lägg till current value i spelaren. Så att varje spelare har koll på sin egna currentValue. 
              få det att fungera att skriva ut den ordentligt



            -->
          </div>
        </div>
      </section>
    </main>

    {{ players }}
    {{ raiseValue }}
    <button v-if="players[playerId]" @click="players[playerId].money += 1">
      fake more money
    </button>
    <button v-if="players[playerId]" @click="players[playerId].bottles += 1">
      fake more bottles
    </button>
    <button v-if="players[playerId]" @click="round += 1">
      fake more rounds
    </button>
    <HelpCollectors
      :labels="labels"
      :player="players[playerId]"
      :players="players"
      :helpAction="this.helpAction"
      :skillsHelpActive="this.skillsHelpActive"
      :auctionHelpActive="this.auctionHelpActive"
      :menuSpaceActive="this.menuSpaceActive"
      :buttonsHelpActive="this.buttonsHelpActive"
      :workHelpActive="this.workHelpActive"
      :itemsHelpActive="this.itemsHelpActive"
      :raiseValueHelpActive="this.raiseValueHelpActive"
    />

    <footer>
      <p>
        {{ labels.invite }}
        <input
          type="text"
          :value="publicPath + $route.path"
          @click="selectAll"
          readonly="readonly"
        />
      </p>
    </footer>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import CollectorsCard from "@/components/CollectorsCard.vue";
import CollectorsBuyActions from "@/components/CollectorsBuyActions.vue";
import CollectorsSkillActions from "@/components/CollectorsSkillActions.vue";
import CollectorsRaiseValue from "@/components/CollectorsRaiseValue.vue";
import CollectorsStartAuction from "@/components/CollectorsStartAuction.vue";
import CollectorsAuction from "@/components/CollectorsAuction.vue";
import CollectorsWork from "@/components/CollectorsWork.vue";
import HelpCollectors from "@/components/HelpCollectors.vue";

export default {
  name: "Collectors",
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsSkillActions,
    CollectorsRaiseValue,
    CollectorsStartAuction,
    CollectorsAuction,
    CollectorsWork,
    HelpCollectors,
  },
  data: function() {
    return {
      gameStarted: false,
      isActive: false,
      open: false,

      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0, y: 0 },
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
      workPlacement: {
        drawACardAndFirstPlayerToken: null,
        drawCardAndPassiveIncome: null,
        drawTwoCards: null,
      },
      chosenPlacementCost: null,
      marketValues: {
        fastaval: 0,
        movie: 0,
        technology: 0,
        figures: 0,
        music: 0,
      },
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      raiseItemsFromBoard: [],    //Ska den här va kvar den orsaka nån mergekonflikt så den fick va kvar
      deckLength: null,
      raiseItems: [],
      cardInAuction: [],
      raiseValue: {
        fastaval: 0,
        movie: 0,
        technology: 0,
        figures: 0,
        music: 0,
      },
      playerid: 0,
      round: 0,
    
      startingPlayerId: null,
      auctionAvailable: false,
      auctionActive: false,
      auctionMiniActive: false,
      currentPlayerId: null,
      auctionPrice: 0,
      bid: 0,
      auctionLeaderId: null,
      auctionWinner: false,
      loserAvailable: false,
      winnerAvailable: false,
      auctonStarterId: null,
      aboutToBuyItem: false,
      aboutToStartAuction: false,
      aboutToBuySkill: false,
      aboutToRaiseValue: false,
      hiddenAuctionCard: false,
      scalefactor: window.innerWidth / 8000, //  Denna är viktig för att skala om korten. Däremot beror denna på skärmstorleken på ett dumnt sätt.
      auctionCardPaymentActive: false,
      biddingCards: [],
      pname: "",
      playerJoined: false,
      playerColor: [],
      cardBidTotal: 0,
      //snow
      snowConf: {
        windPower: 1,
        speed: 3,
        count: 12,
        size: 10,
        opacity: 1,
        images: [
          "https://raw.githubusercontent.com/bob-chen/let_it_snow/master/demo/snow.png",
          "https://raw.githubusercontent.com/bob-chen/let_it_snow/master/demo/sock.png",
          "https://raw.githubusercontent.com/bob-chen/let_it_snow/master/demo/tree.png",
        ],
      },
      //  Jag hoppas att jag kan lösa detta inom kort. /Björn

      //help Active varaibles.
      helpPlayerHandActive: false,
      show1: false,
      helpAction: false,
      skillsHelpActive: false,
      auctionHelpActive: false,
      menuSpaceActive: false,
      buttonsHelpActive: false,
      workHelpActive: false,
      itemsHelpActive: false,
      raiseValueHelpActive: false,
    };
  },
  props: {},
  computed: {
    playerId: function() {
      return this.$store.state.playerId;
    },
  },
  mounted() {
    this.show1 = true;
    window.addEventListener("resize", () => {
      this.scalefactor = window.innerWidth / 8000; // Här är funktionen för skalningen. Denna gör specifikt så att det ändras baserat på skärmskalan.
    });
  },
  watch: {
    players: function(newP, oldP) {
      console.log(newP, oldP);
      for (let p in this.players) {
        for (let c = 0; c < this.players[p].hand.length; c += 1) {
          if (typeof this.players[p].hand[c].item !== "undefined")
            this.$set(this.players[p].hand[c], "available", false);
        }
      }
    },
  },
  created: function() {
    this.$store.commit("SET_PLAYER_ID", this.$route.query.id);
    //TODO! Fix this ugly hack
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);

    this.$store.state.socket.emit("collectorsLoaded", {
      roomId: this.$route.params.id,
      playerId: this.playerId,
    });

    this.$store.state.socket.on(
      "collectorsInitialize",
      function(d) {
        this.labels = d.labels;
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.marketValues = d.marketValues;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.cardInAuction = d.cardInAuction;
        this.auctionPrice = d.auctionPrice;
        this.playerColor = d.playerColor;
        //här skapas både raise Item och Raise value. innan denna körs så finns inget rum. Följ raise Value till datahandler.
        this.raiseItems = d.raiseItems;
        this.raiseValue = d.raiseValue;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
        //this.raiseItemsFromBoard = d.raiseItemsFromBoard;
        this.workPlacement = d.workPlacement;
        if (this.players[this.playerId].name == null) {
          this.playerJoinedFn();
        }
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsBottle",
      function(d) {
        this.buyPlacement = d.buyPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
        this.players = d.players;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsPointsUpdated",
      (d) => (this.points = d)
    );

    this.$store.state.socket.on(
      "collectorsGotDeckLength",
      (d) => (this.deckLength = d)
    );

    this.$store.state.socket.on(
      "collectorsCardDrawn",
      function(d) {
        //this has been refactored to not single out one player's cards
        //better to update the state of all cards
        console.log(d.playerId, "drew a card");
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsCardBought",
      function(d) {
        console.log(d.playerId, "bought a card");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.itemValues = d.itemValues;
      }.bind(this)
    );
    this.$store.state.socket.on(
      "collectorsSkillBought",
      function(d) {
        console.log(d.playerId, "bought a skill");
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsAuctionStarted",
      function(d) {
        console.log(d.playerId, "started auction " + this.cardInAuction);
        this.players = d.players;
        this.auctionCards = d.auctionCards;
        this.hiddenAuctionCard = d.hiddenAuctionCard;
        this.cardInAuction = d.cardInAuction;
        this.auctionActive = true;
        this.auctionPrice = 0;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsValueRaised",
      function(d) {
        console.log(d.playerId, "raised value");
        this.players = d.players;
        this.raiseItems = d.raiseItems;
        this.raiseValue = d.raiseValue;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.itemsOnSale = d.itemsOnSale;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "auctionRound",
      function(d) {
        console.log("är det en vinnare?" + d.auctionWinner);
        if (d.auctionWinner == true) {
          if (this.playerId == d.auctionLeaderId) {
            this.winnerSelection(true);
            this.bid = 0;
            this.cardInAuction = d.cardInAuction;
            this.auctionActive = false;
            this.auctionWinner = false;
            this.biddingCards = [];
          } else {
            this.winnerSelection(false);
            this.auctionPrice = 0;
            this.bid = 0;
            this.cardInAuction = d.cardInAuction;
            this.hiddenAuctionCard = false;
            this.auctionActive = false;
            this.auctionWinner = false;
            this.cardBidTotal = 0;
            console.log("22 längd" + this.biddingCards.length);
            if (this.biddingCards.length > 0) {
              this.restoreHand();
            }
          }
        } else {
          this.auctionPrice = d.auctionPrice;
          this.auctionLeaderId = d.auctionLeaderId;
          this.players = d.players;
          //this.bid = d.auctionPrice;
          this.cardInAuction = d.cardInAuction;
        }
        this.players = d.players;
      }.bind(this)
    );
    this.$store.state.socket.on(
      "auctionFin",
      function(d) {
        this.hiddenAuctionCard = false;
        this.raiseValue = d.raiseValue;
        this.raiseItems = d.raiseItems;
        this.players = d.players;
        this.auctionPrice = 0;
        this.cardInAuction = d.cardInAuction;
        this.winnerAvailable = false;
        this.auctionLeaderId = null;
      }.bind(this)
    );
    this.$store.state.socket.on(
      "cardsMoved",
      function(d) {
        this.raiseValue = d.raiseValue;
        this.raiseItems = d.raiseItems;
        this.skillsOnSale = d.skillsOnSale;
        this.itemsOnSale = d.itemsOnSale;
        this.auctionCards = d.auctionCards;
        this.players = d.players;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "playerPicked",
      function(d) {
        console.log("spelare vald");
        this.gameStarted = true;
        this.buyPlacement = d.buyPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
        this.players = d.players;
        this.round = d.round;
        console.log("Det är runda: " + this.round);
      }.bind(this)
    );

    this.$store.state.socket.on(
      "nameAndColorSeleced",
      function(d) {
        this.players = d.players;
        this.playerColor = d.playerColor;
      }.bind(this)
    );

    //--------WORK--------------
    this.$store.state.socket.on(
      "collectorsBottleRecycled",
      function(d) {
        console.log("Flaska pantad");
        this.players = d;
        console.log("Det krashar inte i flaska pantad");
      }.bind(this)
    );
    this.$store.state.socket.on(
      "collectorsBottleRecycled4thRound",
      function(d) {
        console.log("Flaska pantad på fjärde omgången");
        this.players = d;
        console.log("Det krashar inte i flaska pantad");
      }.bind(this)
    );
    this.$store.state.socket.on(
      "collectorsWorkCardDrawn",
      function(d) {
        console.log("2 kort dragna");
        this.players = d;
      }.bind(this)
    );
    this.$store.state.socket.on(
      "collectorsCardAndTokenDrawn",
      function(d) {
        console.log("Kort samt spela först token (work)");
        this.players = d;
      }.bind(this)
    );
    this.$store.state.socket.on(
      "collectorsCardAndPassiveIncomeDrawn",
      function(d) {
        this.players = d;
      }.bind(this)
    );
    this.$store.state.socket.on(
      "currentScores",
      function(d) {
        this.players[this.playerId].currentScore = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "workerPlaced",
      (d) => (this.workPlacement = d)
    );

    this.$store.state.socket.on(
      "moneyAdded", 
      (d) => (this.players = d)
    );
    //------------------------------

    this.$store.state.socket.emit("collectorsGetDeckLength", {
      roomId: this.$route.params.id,
    });
  },

  methods: {
    playerJoinedFn: function() {
      this.playerJoined = true;
    },
    playerInfo: function() {
      this.playerJoined = false;
      this.$store.state.socket.emit("nameAndColor", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        color: this.players[this.playerId].color,
        name: this.pname,
      });
    },
    selectAll: function(n) {
      n.target.select();
    },
    addBid: function() {
      this.bid += 1;
    },
    subBid: function() {
      this.bid -= 1;
    },

    playerName: function(pId) {
      if (pId !== null) {
        return this.players[pId].name;
      } else {
        return "";
      }
    },
    addNumber: function(add) {
      this.cardBidTotal += add;
    },
    winnerSelection: function(ifWinner) {
      if (ifWinner == true) {
        this.winnerAvailable = true;
      } else {
        this.loserAvailable = true;
      }
    },
    currentPlayer: function() {
      var keys = Object.keys(this.players);

      for (var i = 0; i < keys.length; i++) {
        if (this.players[keys[i]].turn == true) {
          this.currentPlayerId = keys[i];
          return this.players[this.currentPlayerId].name;
        }
      }
    },
    hiddenAuctionCardFN: function() {
      if (!this.hiddenAuctionCard) {
        this.hiddenAuctionCard = true;
      } else {
        this.hiddenAuctionCard = false;
      }
    },
    auctionBoard: function() {
      console.log("auction rutaa");
      this.auctionActive = !this.auctionActive;
      console.log("status: " + this.auctionActive);
    },
    expandPlayerBoard: function() {
      console.log("Player click");

      // returnerar ifall den redan är öppen
      if (this.isActive === true) {
        return;
      }

      // Sätter till true för att öppna brädet
      this.openBoard();

      /* Stänger de andra */
      this.rightIsActive = false;
      this.topIsActive = false;
      this.leftIsActive = false;

      console.log("Status: " + this.isActive);
    },
    expandOtherPlayer: function(player) {
      console.log("klicky macdicky");
      player.playerIsActive = !player.playerIsActive;

      console.log(player.name + " has opened " + player.playerIsActive);
    },
    openBoard: function() {
      console.log("Open board");
      // Sätter till true för att öppna brädet
      this.isActive = true;
      console.log("Status: " + this.isActive);
    },
    closeBoard: function() {
      console.log("Close BUTTON!");

      // Sätter till false för att stänga brädet
      this.isActive = false;
      this.playerHandHelpIsActive = false;
      console.log("Status: " + this.isActive);
    },
    expandLeftBoard: function() {
      console.log("Left click");
      this.leftIsActive = !this.leftIsActive;

      /* Stänger de andra */
      this.rightIsActive = false;
      this.topIsActive = false;
      this.isActive = false;

      console.log("status: " + this.leftIsActive);
    },
    expandRightBoard: function() {
      console.log("Right click");
      this.rightIsActive = !this.rightIsActive;

      /* Stänger de andra */
      this.leftIsActive = false;
      this.topIsActive = false;
      this.isActive = false;
      console.log("status: " + this.rightIsActive);
    },
    expandTopBoard: function() {
      console.log("Top click");
      this.topIsActive = !this.topIsActive;

      /* Stänger de andra */
      this.leftIsActive = false;
      this.rightIsActive = false;
      this.isActive = false;

      console.log("status: " + this.topIsActive);
    },
    auctionOver: function(placementType) {
      this.auctionPrice -= this.cardBidTotal;
      this.cardBidTotal = 0;
      console.log(placementType);
      this.$store.state.socket.emit("auctionOver", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        placementType: placementType,
        auctionPrice: this.auctionPrice,
      });
    },
    showHelp: function(label) {
      label;
      //do stuff
    },
    playerHandHelpIsActive: function() {},

    openCloseBuyWithCard: function() {
      if (this.auctionCardPaymentActive == false) {
        this.auctionCardPaymentActive = true;
        this.auctionActive = false;
      } else {
        this.auctionCardPaymentActive = false;
        this.auctionActive = true;
      }
    },
    placeBottle: function(action, cost) {
      if (action === "buy") {
        this.aboutToBuyItem = true;
      }
      if (action === "auction") {
        this.aboutToStartAuction = true;
      }
      if (action === "skill") {
        this.aboutToBuySkill = true;
      }
      if (action === "market") {
        this.aboutToRaiseValue = true;
      }
      this.chosenPlacementCost = cost;
      this.$store.state.socket.emit("collectorsPlaceBottle", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: cost,
      });
    },
    drawCard: function() {
      if (!this.helpAction) {
        this.$store.state.socket.emit("collectorsDrawCard", {
          roomId: this.$route.params.id,
          playerId: this.playerId,
        });
      }
      this.$store.state.socket.emit("collectorsGetDeckLength", {
        roomId: this.$route.params.id,
      });
    },
    buyCard: function(card) {
      console.log("buyCard", card);
      this.aboutToBuyItem = false;
      this.$store.state.socket.emit("collectorsBuyCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost,
      });

      this.nextPlayer();
    },
    buySkill: function(card) {
      console.log("buySkill", card);
      this.aboutToBuySkill = false;
      this.$store.state.socket.emit("collectorsBuySkill", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost,
      });
      this.nextPlayer();
    },

    raisingValue: function(card) {
      (this.aboutToRaiseValue = false),
        this.$store.state.socket.emit("collectorsRaiseValue", {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.chosenPlacementCost,
        });
    },

    getLastElement: function(cardArray){
      for(let i = cardArray.length - 1; i>=1; i--){
        if(cardArray[i].market){
          return cardArray[i];
        }
      }
    },

    /*getRaiseItemsFromBoard: function(){
      this.raiseItemsFromBoard.push(this.skillsOnSale[this.skillsOnSale.length - 1]);
      this.raiseItemsFromBoard.push(this.auctionCards[this.auctionCards.length - 1]);
      return this.raiseItemsFromBoard;
    },*/


    notYourTurn: function () {
      if (this.players[this.playerId].turn == false) {
        return true;
      } else if (this.auctionActive || this.auctionMiniActive) {
        return true;
      } else {
        return false;
      }
    },
    startAuction: function(card) {
      this.auctionAvailable = false;
      this.aboutToStartAuction = false;
      this.$store.state.socket.emit("collectorsStartAuction", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        hiddenAuctionCard: this.hiddenAuctionCard,
        card: card,
        cost: this.chosenPlacementCost,
      });
    },

    auctionMiniActiveNow: function() {
      if (this.auctionMiniActive == true) {
        this.auctionMiniActive = false;
        this.auctionActive = true;
      } else {
        this.auctionMiniActive = true;
        this.auctionActive = false;
      }
    },

    restoreHand: function () {
      this.$store.state.socket.emit("restoreHand", {
        roomId: this.$route.params.id,
        biddingCards: this.biddingCards,
        players: this.players,
        playerId: this.playerId,
      });
    },
    startTurn: function() {
      console.log("hola");

      this.$store.state.socket.emit("startTurn", {
        roomId: this.$route.params.id,
      });
    },
    moveCards: function() {
      this.$store.state.socket.emit("moveCards", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
    },
    currentScore: function() {
      this.$store.state.socket.emit("currentValue", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        currentValue: this.currentValue,
      });
    },
    getCurrentScore: function() {
      if (typeof this.players[this.playerId].currentScore !== "undefined") {
        return this.players[this.playerId].currentScore;
      }
      return "";
    },

    nextPlayer: function() {
      this.$store.state.socket.emit("nextPlayer", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        auctionActive: this.auctionActive,
      });
    },

    removeBottle: function(action, cost) {
      if (action === "buy") {
        this.aboutToBuyItem = false;
      }
      if (action === "auction") {
        this.aboutToStartAuction = false;
      }
      if (action === "skill") {
        this.aboutToBuySkill = false;
      }
      this.chosenPlacementCost = cost;
      this.$store.state.socket.emit("collectorsRemoveBottle", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: cost,
      });
    },

    //playerHandShow
    helpPlayerHandHover: function() {
      this.helpPlayerHandActive = !this.helpPlayerHandActive;
    },
    showHelpOptions: function() {
      if (this.helpAction) {
        this.skillsHelpActive = false;
        this.auctionHelpActive = false;
        this.menuSpaceActive = false;
        this.buttonsHelpActive = false;
        this.workHelpActive = false;
        this.itemsHelpActive = false;
        this.raiseValueHelpActive = false;
      }
      this.helpAction = !this.helpAction;
      console.log(this.helpAction);
      console.log(document.getElementById("test1").className);

      /* if(this.helpAuctionActive){
        console.log("hejhej");
        tempElement.setAttribute("id", "");
        this.helpAuctionActive = false;
      }
      this.helpAuctionActive=true;
      */
      /*
    helpAuctionHover();
    helpButtonsHover();
    helpInfoBoxHover();
    helpDeckHover();
    helpItemsAreaHover();
    helpSkillsAreaHover();
    */
    },
    skillsHelp: function() {
      if (this.helpAction) {
        if (
          this.auctionHelpActive ||
          this.menuSpaceActive ||
          this.buttonsHelpActive ||
          this.workHelpActive ||
          this.itemsHelpActive ||
          this.raiseValueHelpActive
        ) {
          this.auctionHelpActive = false;
          this.menuSpaceActive = false;
          this.buttonsHelpActive = false;
          this.workHelpActive = false;
          this.itemsHelpActive = false;
          this.raiseValueHelpActive = false;
        }
        this.skillsHelpActive = !this.skillsHelpActive;
      }
    },
    auctionHelp: function() {
      if (this.helpAction) {
        if (
          this.skillsHelpActive ||
          this.menuSpaceActive ||
          this.buttonsHelpActive ||
          this.workHelpActive ||
          this.itemsHelpActive ||
          this.raiseValueHelpActive
        ) {
          this.skillsHelpActive = false;
          this.menuSpaceActive = false;
          this.buttonsHelpActive = false;
          this.workHelpActive = false;
          this.itemsHelpActive = false;
          this.raiseValueHelpActive = false;
        }
        this.auctionHelpActive = !this.auctionHelpActive;
      }
    },
    menuSpaceHelp: function() {
      if (this.helpAction) {
        if (
          this.skillsHelpActive ||
          this.auctionHelpActive ||
          this.buttonsHelpActive ||
          this.workHelpActive ||
          this.itemsHelpActive ||
          this.raiseValueHelpActive
        ) {
          this.skillsHelpActive = false;
          this.auctionHelpActive = false;
          this.buttonsHelpActive = false;
          this.workHelpActive = false;
          this.itemsHelpActive = false;
          this.raiseValueHelpActive = false;
        }
        this.menuSpaceActive = !this.menuSpaceActive;
      }
    },
    buttonsHelp: function() {
      if (this.helpAction) {
        if (
          this.skillsHelpActive ||
          this.auctionHelpActive ||
          this.menuSpaceActive ||
          this.workHelpActive ||
          this.itemsHelpActive ||
          this.raiseValueHelpActive
        ) {
          this.skillsHelpActive = false;
          this.auctionHelpActive = false;
          this.menuSpaceActive = false;
          this.workHelpActive = false;
          this.itemsHelpActive = false;
          this.raiseValueHelpActive = false;
        }
        this.buttonsHelpActive = !this.buttonsHelpActive;
      }
    },
    workHelp: function() {
      if (this.helpAction) {
        if (
          this.skillsHelpActive ||
          this.auctionHelpActive ||
          this.menuSpaceActive ||
          this.buttonsHelpActive ||
          this.itemsHelpActive ||
          this.raiseValueHelpActive
        ) {
          this.skillsHelpActive = false;
          this.auctionHelpActive = false;
          this.menuSpaceActive = false;
          this.buttonsHelpActive = false;
          this.itemsHelpActive = false;
          this.raiseValueHelpActive = false;
        }
        this.workHelpActive = !this.workHelpActive;
      }
    },
    itemsHelp: function() {
      if (this.helpAction) {
        if (
          this.skillsHelpActive ||
          this.auctionHelpActive ||
          this.menuSpaceActive ||
          this.buttonsHelpActive ||
          this.workHelpActive ||
          this.raiseValueHelpActive
        ) {
          this.skillsHelpActive = false;
          this.auctionHelpActive = false;
          this.menuSpaceActive = false;
          this.buttonsHelpActive = false;
          this.workHelpActive = false;
          this.raiseValueHelpActive = false;
        }
        this.itemsHelpActive = !this.itemsHelpActive;
      }
    },

    raiseValueHelp: function() {
      if (this.helpAction) {
        if (
          this.skillsHelpActive ||
          this.auctionHelpActive ||
          this.menuSpaceActive ||
          this.buttonsHelpActive ||
          this.workHelpActive ||
          this.itemsHelpActive
        ) {
          this.skillsHelpActive = false;
          this.auctionHelpActive = false;
          this.menuSpaceActive = false;
          this.buttonsHelpActive = false;
          this.workHelpActive = false;
          this.itemsHelpActive = false;
        }
        this.raiseValueHelpActive = !this.raiseValueHelpActive;
      }
    },

    //---------------------------WORK metoder-------------------
    recycleBottle: function() {
      //Här ska en flaska växlas för pengar
      //Än så länge är inte den där spess panten för 4de omgången impelemterad!!!!
      console.log("pant knappen trycks (Collectors.vue)");
      console.log("player bottles > 0 (Collectors.vue)");
      this.$store.state.socket.emit("collectorsBottleRecycle", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
    },
    recycleBottle4thRound: function() {
      //Här ska en flaska växlas för pengar
      //Än så länge är inte den där spess panten för 4de omgången impelemterad!!!!
      console.log("pant knappen trycks (Collectors.vue)");
      console.log("player bottles > 0 (Collectors.vue)");
      this.$store.state.socket.emit("collectorsBottleRecycle4thRound", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
    },
    workDrawTwoCards: function() {
      this.$store.state.socket.emit("collectorsWorkDrawTwoCards", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
      this.$store.state.socket.emit("collectorsGetDeckLength", {
        roomId: this.$route.params.id,
      });
    },
    drawACardAndFirstPlayerToken: function() {
      console.log("draw card and first player token");
      this.$store.state.socket.emit("collectorsDrawACardAndToken", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
      this.$store.state.socket.emit("collectorsGetDeckLength", {
        roomId: this.$route.params.id,
      });
    },
    drawCardAndPassiveIncome: function() {
      console.log("Draw passive income i Collectors.vue");
      this.$store.state.socket.emit("collectorsDrawACardAndPassiveIncome", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
      this.$store.state.socket.emit("collectorsGetDeckLength", {
        roomId: this.$route.params.id,
      });
    },
    placeWorker: function(where) {
      console.log("placeWorker!");
      this.$store.state.socket.emit("placeWorker", {
        roomId: this.$route.params.id,
        where: where,
        playerId: this.playerId,
      });
      this.$store.state.socket.emit("collectorsGetDeckLength", {
        roomId: this.$route.params.id,
      });
    },
    addMoney: function(amount) {
      console.log("addMoney i Collectors.vue körs");
      this.$store.state.socket.emit("addMoney", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        amount: amount,
      });
    },
    //----------------------------------------------------------
  },
};
</script>

<style scoped>
header {
  user-select: none;
  position: fixed;
  width: 100%;
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
  color: ivory;
}
.playerJoinedBox {
  display: grid;
  position: absolute;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 25vw;
  height: 30vw;
  background-color: darkslategray;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  padding: 2vw;
  border-color: black;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.enterPlayerInfo {
  background-color: white;
  grid-row: 5;
  grid-column: 2/4;
  border-width: 0;
  font-size: 1.5vw;
  margin: 1.4vw;
}

.colorChoice {
  grid-row: 4;
}
.theColor {
  cursor: pointer;
  border-style: solid;
  border-width: 0.4vw;
  /* border: 0.2vw; */
  border-color: black;
  height: 3vw;
  width: 4.3vw;
  border-radius: 2vw;
  align-self: center;
  background-color: red;
  margin: 0.5vw;
}
theColor:onclick {
  cursor: pointer;
  border-color: white;
}
.playerText {
  grid-row: 2;
  grid-column: 1/5;
  height: 2vw;
  margin: 2vw;
  font-size: 2vw;
  text-align: center;
}
.playerText1 {
  color: white;
  grid-row: 1;
  margin: auto;
  font-size: 2vw;
  text-align: center;
  grid-column: 1/5;
}
.playerText2 {
  color: white;
  grid-row: 3;
  font-size: 2vw;
  margin: auto;
  text-align: center;
  grid-column: 1/5;
}
.cardslots {
  display: grid;
  grid-row: 1;
  grid-template-columns: repeat(
    auto-fill,
    12vw
  ); /* Det här är en koddel som bestämmer avståndet mellan korten, typ. */
  grid-template-rows: repeat(auto-fill, 12vw);
}
.card {
  position: relative;
  -webkit-box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3);
  box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3);
}
.otherHand.card {
  background-image: url("/images/back-of-card.png");
}

/* transform: scale(0.5)translate(-50%,-50%);*/

.cardslots div {
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.cardslots div:hover {
  transform: scale(1) translate(-25%, 0);
  z-index: 1;
}
.helpText {
  width: 100%;
  height: 100%;
  display: table-cell;
  vertical-align: middle;
}
/*
.bodytest{
  height: 100vh;
  width: 100vw;
  contain:content;
}
*/
#wrapper {
  padding: 0.3vw;
  justify-self: center;
  position: relative;
  background-image: url("/images/tim-mossholder-ysDq0fY-bzo-unsplash.jpg");
  background-size: contain;
  border-color: rgb(34, 21, 9);
  border-style: solid;
  border-width: 1vw;
}

#grid {
  display: grid;
  grid-gap: 0.5vw;
  grid-template-columns: 9vw 13vw 13vw 13vw 13vw 13vw 1vw 10vw;
  grid-template-rows: 5vw 15vw 15vw 1vw 7vw;
  justify-content: center;
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

.player {
  padding: 1vw;
}
.cardslots {
  padding: 1vw;
}

/*
  Här nedan är CSS specifika för player rutorna
  */

.player {
  border-radius: 2vw;
  height: 2vw;
  width: 15vw;
  font-size: 1.5vw;
  text-align: center;
  align-self: flex-end;
}
.otherplayers {
  border-radius: 1vw;
  grid-row: 1;
  grid-column: 3/6;
  border-color: rgb(82, 82, 82);
  background-color: grey;
  border: solid;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-content: space-evenly;
}
.otherplayer {
  border-radius: 1vw;
  padding: 1vw;
  z-index: 1;
  cursor: pointer;
  height: 2.6vw; 
  /* ändra height sen */
}
.otherplayer.open {
  position: absolute;
  margin-left: -20vw;
  width: 50vw;
  height: 25vw;
  align-self: end;
  justify-self: center;
  font-size: 1vw;
  cursor: default;
  border: solid;
  border-color: black;
  z-index: 10;
  cursor: pointer;
}
.otherPlayerClosed{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2vw 1vw;
}
.otherPlayerClosed > .closedCardsInHand{
  grid-column: 2;
  grid-row: 1/3;
  display: grid;
  grid-template-columns: repeat(5, 0.6vw);
  grid-template-rows: repeat(auto-fill, 0.3vw);
  height: 80%;
  margin-top: -1.5vw;
  justify-self: self-start;
}
.otherHand.otherClosed.card{
  zoom: 0.15 !important;
}

.scoreDisplay{
  font-size: 1vw;
  background-color: grey;
  border-radius: 0.5vw;
  height: 1.2vw;
  padding: 0.1vw;
}

.playerboard {
  border-radius: 2vw;
  grid-column: 3/6;
  grid-row: 5;
  padding: 1vw;
  font-size: 1vw;
  cursor: pointer;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}

/* Hover över spelarområdena*/
.playerboard:hover {
  background-color: rgb(95, 216, 253);
}
.player2:hover {
  background-color: #c236b4;
}
.player4:hover {
  background-color: #e9b77a;
}
.player3:hover {
  background-color: #20ccbe;
}

/* Om man klickar på handen aktiveras denna. Denna ger attribut bara om isActive på divven = true */
.playerboard.active {
  margin-top: -110%;
  width: 50vw;
  height: 25vw;
  align-self: end;
  justify-self: center;
  z-index: 1;
  font-size: 1vw;
  cursor: default;
  border: solid;
  border-color: black;
}

.playerBoardGrid {
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 2fr;
  border-radius: 2vw;
  height: 100%;
}

.boardCollection {
  grid-row: 1/4;
  grid-column: 1 /3;
  border-radius: 2vw 0 0 0;
  background-color: #ca6058;
  padding: 1vw;
  padding-bottom: 0.8vw;
  overflow: hidden;
}

.boardcollectiongrid {
  display: grid;
  position: relative;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 5fr 1fr 1fr;
  height: 100%;
}

.playercollection {
  grid-row: 1;
  grid-column: 1;
  background-color: #d47871;
  border-radius: 2vw 2vw 0vw 0vw;
  overflow: scroll;
}

.playercollection::-webkit-scrollbar {
  display: none;
}

.collectioncards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 1.5vw);
  grid-template-rows: repeat(7, 5vh);
  margin-right: 3.5vw;
  margin-left: 0.5vw;
}

.boardHand {
  grid-row: 4;
  grid-column: 1 / 3;
  overflow: hidden;
  background-color: #e9e78a;
  border-radius: 0 0 0 2vw;
  padding: 1vw;
  align-items: center;
}

.closedBoardGrid {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
}

.closedBoardHand {
  grid-column: 1 / span 1;
  grid-row: 1;
  height: 100%;
}
.closedCardsInHand {
  display: grid;
  grid-template-columns: repeat(8, 2vw);
  grid-template-rows: repeat(auto-fill, 1vw);
  height: 80%;
  margin-top: -1.5vw;
}

.closedBoardHandBackground {
  border-radius: 2vw;
  background-color: #eeedb8;
  grid-column: 1 / span 1;
  grid-row: 1;
  height: 5vw;
}

.cardsinhand {
  display: grid;
  grid-template-columns: repeat(9, 2vw);
  grid-template-rows: repeat(auto-fill, 0.5vw);
  padding: 0.5vw;
  height: 80%;
  background-color: #eeedb8;
  border-radius: 2vw;
  overflow: hidden;
}
.cardsinhand > .card:hover {
  filter: brightness(110%);
  cursor: pointer;
  margin-top: -1vw;
  z-index: 2;
}
.closedCardsInHand > .card:hover {
  filter: brightness(110%);
  cursor: pointer;
  margin-top: -3vw;
  z-index: 2;
}

#handTitle {
  margin-left: 10vw;
  position: absolute;
  background-color: gray;
  border-radius: 2vw;
  padding: 0.3vw;
  z-index: 1;
}
#totalvalue {
  background-color: gray;
  border-radius: 0vw 0vw 2vw 2vw;
  text-align: center;
  grid-row: 3;
}
.itemicons {
  grid-row: 2;
  background-color: red;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.boardSkills {
  display: grid;
  grid-template-columns: 2fr 1fr;
  border-radius: 0 2vw 0 0;
  background-color: #bddf8c;
  grid-column: 3/5;
  grid-row: 1/4;
}

.skillsinhand {
  display: grid;
  grid-template-columns: repeat(auto-fill, 2.5vw);
  z-index: 1;
  margin: 1vw;
  border-radius: 2vw;
  background-color: #cde0b2;
  grid-column: 1;
}
.skillsInfo {
  grid-column: 2;
  background-color: #bbd892;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
}

.boardNextTurnInfo {
  grid-row: 4;
  grid-column: 3/5;
  background-color: gray;
  border-radius: 0 0 2vw 0;
  padding: 1vw;
}
.nextturnboard {
  max-width: 100%;
}

.boardclosebutton {
  grid-row: 5;
  grid-column: 4;
  align-self: flex-end;
  z-index: 1;
  cursor: pointer;
}
.winnerAuction {
  display: grid;
  position: absolute;
  grid-template-rows: 2fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 40vw;
  height: 18vw;
  background-color: #f5efa0;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 26%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1vw;
}
.winnerText {
  color: black;
  grid-column: 1/4;
  text-align: center;
  font-size: 2vw;
  margin: auto;
}

.auctionButtonWinner {
  grid-row: 2;
  background-color: rgb(180, 180, 180);
  cursor: pointer;
  box-shadow: 0 0.3vw #999;
  border-radius: 2vw;
  border: 0vw;
  font-size: 1.6vw;
  margin: 0.5vw;
}
.auctionButtonWinner:disabled {
  color: rgb(78, 78, 78);
  background-color: grey;
  cursor: default;
}
.button1 {
  background-color: #f06e6e;
}
.button2 {
  background-color: #aeda6e;
}
.button3 {
  background-color: darkred;
  color: white;
}
.button4 {
  background-color: rgb(87, 188, 255);
}
.loserAuction {
  display: grid;
  position: absolute;
  /* grid-template-rows: 20% 15% 43% auto; */
  /* grid-template-columns: auto auto auto auto; */
  width: 40vw;
  height: 10vw;
  background-color: #f5efa0;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  color: black;
  font-size: 2vw;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: 4vw;
}

/*
  Här nedan är CSS specifika för kortrutorna
  */

.items {
  border-radius: 2vw;
  background-color: #f8dcce;
  grid-column: 4 / span 3;
  grid-row: 2;
  position: relative;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.skills {
  border-radius: 2vw;
  background-color: #dfeccc;
  grid-column: 4 / span 3;
  grid-row: 3;
  position: relative;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.work {
  text-align: center;
  border-radius: 2vw;
  background-color: grey;
  grid-column: 2;
  grid-row: 2 / span 2;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.raiseValue {
  border-radius: 2vw;
  background-color: #cfdcf2;
  grid-column: 8;
  grid-row: 3 / span 1;
  position: relative;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.raiseValuegrid div {
  font-size: 1vw;
  font-weight: bold;
  color: black;
}
.auction {
  border-radius: 2vw;
  background-color: #f5f2cc;
  grid-column: 3;
  grid-row: 2 / span 2;
  position: relative;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.auctionCardViewMini {
  zoom: 1.65;
  position: absolute;
  align-content: center;
  transition: auto;
  transform: translate(5%, 40%);
}
.auctionCardViewFin {
  zoom: 1.65;
  align-content: center;
  grid-column: 4;
  transition: auto;
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
.auctionMini {
  display: grid;
  margin-top: 3vw;
  grid-column: 8;
  grid-template-rows: 20% 60% auto;
  grid-template-columns: auto;
  width: 9vw;
  height: 16vw;
  background-color: #f5efa0;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  color: darkgreen;
  font-size: 3vw;
  text-align: center;
  cursor: pointer;
}
.roundCounter {
  grid-column: 1;
  grid-row: 2;
  background-color: rgb(194, 194, 194);
  border-radius: 2vw;
  padding: 2vw;
  font-size: 1vw;
  position: relative;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.drawCardSpace {
  grid-column: 8;
  grid-row: 2;
  border-radius: 2vw;
  padding: 2vw;
  position: relative;
  display: grid;

  justify-self: center;
  align-self: center;
  zoom: 0.5;
}

#helpDrawCardSpace {
  zoom: 150%;
}

.cardCounterSpace {
  grid-column: 2;
}
.drawCardCounter {
  align-content: center;
  padding: 50%;
  padding-right: 150%;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
  background-color: rgb(34, 55, 94);
}

.drawCardSpace .buttons:hover {
  filter: brightness(110%);
  background-color: rgb(194, 194, 194);
}

.drawCardSpace .buttons {
  grid-column: 1;
}

.deck {
  max-width: 100%;
  max-height: 100%;
}

.gridedge3 {
  grid-column: 1;
  grid-row: 1;
  background-color: rgb(194, 194, 194);
  border-radius: 2vw;
  padding: 2vw;
  font-size: 1vw;
  overflow: hidden;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.gridedge3 p {
  align-self: center;
  font-size: 140%;
  margin-top: -25px;
  text-indent: 5px;
}

.menuSpace > * {
  /* This makes the buttons in the grid element smaller - redo this with proper scaling. Arbitrary magic number right now */
  zoom: 0.8;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.help {
  width: 40px;
  height: 40px;
  border-radius: 25px;
  position: absolute;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
  cursor: pointer;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.help:hover {
  background-color: rgb(61, 61, 255);
}

.menuSpace {
  grid-column: 1;
  grid-row: 3;
  background-color: rgb(194, 194, 194);
  border-radius: 2vw;
  padding: 2vw;
  position: relative;
  padding: 1vw;
  display: grid;
  grid-template-rows: repeat(auto-fill, 3.5vh);
  align-content: center;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
}
.buttons {
  display: inline-block;
  color: grey;
  background-color: rgb(83, 83, 83);
  border-radius: 1vw;
  box-shadow: 0 0.3vw #999;
}
.buttons:active {
  background-color: coral;
  box-shadow: 0 0.2vw #999;
  transform: translateY(0.1vw);
}
.buttons:hover {
  background-color: coral;
}
.menuSpace > * {
  /* This makes the buttons in the grid element smaller - redo this with proper scaling. Arbitrary magic number right now */
  zoom: 0.8;
}

.menuButton {
  background-color: #bbb;
  display: block;
  width: 100%;
  overflow: hidden;
  font-size: auto;
}

.help {
  width: 2.5vw;
  height: 2.5vw;
  border-radius: 50px;
  position: absolute;
  right: -2%;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #0066ff;
  border: solid;
  border-width: 1px;
  border-color: black;
  font-size: 150%;
}
#playerHelp {
  --scrollbarBG: #0066ff;
  --thumbBG: #90a4ae;
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
  right: -22.791666666666668vw;
  top: -17.2604166666666667vw;
  border-radius: 1vw;
  -webkit-box-shadow: 0px 0px 3px 2px rgba(102, 163, 255, 0.59);
  box-shadow: 0px 0px 3px 2px rgba(102, 163, 255, 0.59);
  background-color: inherit;
  padding: 1vw;
  float: right;
  max-width: 19.791666666666668vw;
  min-width: 14vw;
  max-height: 43.833333333333332vw;
  overflow-y: auto;
  position: absolute;
  z-index: 6;
  word-wrap: break-word;
  display: inline;
  font-size: 1vw;
}
#playerHelp h3 {
  background-color: rgb(3, 69, 155);
  border-radius: 0.5vw;
  padding: 0.55vw;

  border: solid;
  border-width: 0.2px;
  border-color: black;
}
#playerHelp p {
  background-color: #2179fd;
  border-radius: 0.5vw;
  margin-top: -0.52vw;
  padding: 0.55vw;
  border: solid;
  border-width: 0.2px;
  border-color: black;
}
#playerHelp div {
  border-radius: 0.5vw;
  background-color: #94b5ee;
  padding: 5px;
  margin-bottom: 2px;
  border: solid;
  border-width: 0.2px;
  border-color: black;
}

/*
alltså lol vet ej vad raderna under gör med det löser mitt problem just nu lol...
*/

#playerHelp::-webkit-scrollbar {
  width: 11px;
  height: 5px;
}

#playerHelp::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
  margin: 10px;
  padding: 2px;
}
#playerHelp::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 6px;
  height: 30px;
  border: 3px solid var(--scrollbarBG);
}
.helpBoard {
  top: 1vw;
  right: 1vw;
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
  cursor: pointer;
  grid-row: 1;
  grid-column: 8;
  justify-self: flex-end;
  border: solid;
  border-color: black;
  border-width: 0.5px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.466), 0 1px 4px rgba(0, 0, 0, 0.24);
  font-size: 200%;
}
.helpBoard:hover {
  background-color: rgb(61, 61, 255);
}

.animate {
  animation: jiggles 1.5s ease-in-out;
  animation-iteration-count: infinite;
  box-shadow: 0px 0px 10px 11px rgb(116, 116, 9), 0 0 5px rgb(116, 116, 9);
}

.playerMoney {
  width: 20px;
  height: 20px;
  background: green;
}

@keyframes jiggles {
  0% {
    transform: rotate(0.5deg);
  }
  50% {
    transform: rotate(-0.5deg);
  }
  100% {
    transform: rotate(0.5deg);
  }
}

@media screen and (max-width: 800px) {
  main {
    width: 90vw;
  }
}
</style>

/* NOTES: Here are notes from the supervision sessions
https://stackoverflow.com/questions/47219272/how-can-i-use-window-size-in-vue-how-do-i-detect-the-soft-keyboard
split image into tiles: https://codepen.io/Escu/pen/KVLBYP
https://stackoverflow.com/questions/2430206/how-can-i-scale-an-image-in-a-css-sprite
*/
