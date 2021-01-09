"use strict";

let csv = require("csvtojson");

let collectorsDeck = "collectors-cards";
let languages = ["en", "se"];

/* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Store data in an object to keep the global namespace clean
function Data() {
  this.data = {};
  this.rooms = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

/*
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeTable = function(table) {
  csv({
    checkType: true,
  })
    .fromFile("./data/" + table + ".csv")
    .then((jsonObj) => {
      this.data[table] = jsonObj;
    });
};

Data.prototype.initializeData = function() {
  console.log("Starting to build data tables");
  for (let i in languages) {
    this.initializeTable(collectorsDeck);
  }
};

Data.prototype.getUILabels = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let lang = room.lang;
    var ui = require("./data/collectors-" + lang + ".json");
    return ui;
  } else return {};
};

Data.prototype.createRoom = function(roomId, playerCount, lang = "en") {
  let room = {};
  room.players = {};
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playerCount = playerCount;
  room.itemsOnSale = room.deck.splice(0, room.playerCount + 1);
  for (let index = room.playerCount + 1; index < 5; index++) {
    room.itemsOnSale.push({});
  }
  room.itemsOnSale = this.bubbleSort(room.itemsOnSale);
  room.skillsOnSale = room.deck.splice(0, room.playerCount + 1);
  for (let index = room.playerCount + 1; index < 5; index++) {
    room.skillsOnSale.push({});
  }
  room.skillsOnSale = this.bubbleSort(room.skillsOnSale);
  room.auctionCards = room.deck.splice(0, 4);
  room.raiseItems = room.deck.splice(0, 0);
  room.raiseValue = null;
  (room.playerColor = ["#5fd8fd", "#7e2174", "#19b3a7", "#ca9e68"]),
    (room.auctonStarterId = null);
  room.cardInAuction = [];
  room.market = [];
  room.round = 0;
  room.startingPlayerId = null;
  room.buyPlacement = [
    {
      cost: 1,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 1,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 2,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 2,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 3,
      playerId: null,
      amountOfCards: 1,
    },
  ];
  room.skillPlacement = [
    {
      cost: 0,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 0,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 0,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 1,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 1,
      playerId: null,
      amountOfCards: 1,
    },
  ];
  room.auctionPlacement = [
    {
      cost: -2,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: -1,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 0,
      playerId: null,
      amountOfCards: 1,
    },
    {
      cost: 0,
      playerId: null,
      amountOfCards: 1,
    },
  ];
  room.marketPlacement = [
    {
      cost: 2,
      playerId: null,
      amountOfCards: 2,
    },
    {
      cost: 0,
      playerId: null,
      amountOfCards: 2,
    },
    {
      cost: 0,
      playerId: null,
      amountOfCards: 1,
    },
  ];
  room.workPlacement = {
    drawACardAndFirstPlayerToken: null,
    drawCardAndPassiveIncome: null,
    drawTwoCards: null,
    quarterTile: null,
  };
  this.rooms[roomId] = room;
};

Data.prototype.createDeck = function() {
  // we want a copy of the deck array, not a reference to it so we use the
  // spread operator (...) to copy the items. Note that this is a shallow copy
  // so it is not generalizable to all copy problems
  let deck = [...this.data[collectorsDeck]];
  return shuffle(deck);
};

Data.prototype.getDeckLength = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.deck.length;
  } else return 0;
};

Data.prototype.joinGame = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    if (typeof room.players[playerId] !== "undefined") {
      console.log(
        "Player",
        playerId,
        "joined again with info",
        room.players[playerId]
      );
      return true;
    } else if (Object.keys(room.players).length < room.playerCount) {
      console.log("Player", playerId, "joined for the first time");
      room.players[playerId] = {
        hand: [],
        money: 2,
        bottles: 2,
        totalBottles: 2,
        bottlesOnPlayerbord: [true, true, false, false, false],
        points: 0,
        firstPlayerToken: false,
        skills: [],
        items: [],
        income: [],
        secret: [],
        name: null,
        color: null,
        turn: false,
        playerIsActive: false,
        itemValues: {
          ifastaval: 0,
          imovie: 0,
          itechnology: 0,
          ifigures: 0,
          imusic: 0,
        },
        currentScore: 0,
      };
    }
    return true;
  }
  console.log("Player", playerId, "was declined due to player limit");
};

Data.prototype.getPlayers = function(id) {
  let room = this.rooms[id];
  if (typeof room !== "undefined") {
    for (const player in room.players) {
      if (player.currentScore >= 0) {
        player.currentScore = this.currentValue(id, player);
      }
    }
    return room.players;
  } else return {};
};

Data.prototype.updatePoints = function(roomId, player, points) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.points[player] += points;
    return room.points;
  } else return {};
};

/* returns players after a new card is drawn */
Data.prototype.drawCard = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let card = room.deck.pop();
    room.players[playerId].hand.push(card);
    return room.players;
  } else return [];
};
Data.prototype.restoreHands = function(roomId, playerId, biddingCards) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    for (let i = 0; i < biddingCards.length; i += 1) {
      let card = biddingCards[i];
      console.log("this card" + card);
      room.players[playerId].hand.push(card);
    }
  }
  return room.players;
};

/* moves card from itemsOnSale to a player's hand */
Data.prototype.buyCard = function(roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.itemsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (
        room.itemsOnSale[i].x === card.x &&
        room.itemsOnSale[i].y === card.y
      ) {
        c = room.itemsOnSale.splice(i, 1, {});
        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (
        room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y
      ) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    room.players[playerId].items.push(...c);
    room.players[playerId].money -= cost + room.raiseValue[card.item];
  }
};
Data.prototype.buySkill = function(roomId, playerId, card, cost) {
  console.log(playerId);

  let room = this.rooms[roomId];

  if (typeof room !== "undefined") {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (
        room.skillsOnSale[i].x === card.x &&
        room.skillsOnSale[i].y === card.y
      ) {
        c = room.skillsOnSale.splice(i, 1, {});

        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (
        room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y
      ) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    if (card.skill == "bottle" && room.players[playerId].totalBottles < 5) {
      this.changeBottleOnPlayerboarad(roomId, playerId, true);
      room.players[playerId].bottles++;
      room.players[playerId].totalBottles++;
    }

    room.players[playerId].skills.push(...c);
    room.players[playerId].money -= cost;
  }
};
Data.prototype.pushToSecret = function(roomId, playerId, card) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let c = null;
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      if (
        room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y
      ) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    room.players[playerId].secret.push(...c);
  }
};
Data.prototype.startAuction = function(
  roomId,
  playerId,
  card,
  cost,
  hiddenAuctionCard
) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let c = null;
    this.auctionSkill(room);
    room.hiddenAuctionCard = hiddenAuctionCard;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (
        room.auctionCards[i].x === card.x &&
        room.auctionCards[i].y === card.y
      ) {
        c = room.auctionCards.splice(i, 1, {});
        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (
        room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y
      ) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }

    room.cardInAuction.push(card);
    room.players[playerId].money -= cost;
  }
};

Data.prototype.auctionSkill = function(room) {
  var keys = Object.keys(room.players);
  console.log("skille");
  for (let i = 0; i < keys.length; i += 1) {
    console.log("denna skill pil" + room.players[keys[i]].skills.length);
    for (let j = 0; j < room.players[keys[i]].skills.length; j += 1) {
      if (room.players[keys[i]].skills[j].skill == "auctionIncome") {
        room.players[keys[i]].money += 1;
      }
    }
  }
};

Data.prototype.raiseValue = function(
  roomId,
  playerId,
  card,
  cost,
  firstCard
){
  let room = this.rooms[roomId];

  if (typeof room !== "undefined") {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      //since card comes from the client, it is NOT the same object (reference)
      //so we need to compare properties for determining equality
      if (
        room.skillsOnSale[i].x === card.x &&
        room.skillsOnSale[i].y === card.y
      ) {
        c = room.skillsOnSale.splice(i, 1, {});

        break;
      }
    }

    for (let i = 0; i < room.auctionCards.length; i += 1) {
      //since card comes from the client, it is NOT the same object (reference)
      //so we need to compare properties for determining equality
      if (
        room.auctionCards[i].x === card.x &&
        room.auctionCards[i].y === card.y
      ) {
        c = room.auctionCards.splice(i, 1, {});

        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (
        room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y
      ) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    console.log(firstCard);
    if(firstCard){
      room.raiseItems.push(...c);
      room.raiseValue = this.cardValue(roomId);
      room.players[playerId].money -= cost;
    }
    else{
      room.raiseItems.push(...c);
      room.raiseValue = this.cardValue(roomId);
    }
  }
};

Data.prototype.auctionWon = function(
  roomId,
  playerId,
  placementType,
  auctionPrice
) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let c = null;
    let card = room.cardInAuction[0];
    c = room.cardInAuction.splice(0, 1, {});
    if (placementType == "raiseValue") {
      room.raiseItems.push(...c);
      room.raiseValue = this.cardValue(roomId);
    } else if (placementType == "skills") {
      if (card.skill == "bottle" && room.players[playerId].totalBottles < 5) {
        this.changeBottleOnPlayerboarad(roomId, playerId, true);
        room.players[playerId].bottles++;
        room.players[playerId].totalBottles++;
      }
      room.players[playerId].skills.push(...c);
    } else if (placementType == "items") {
      room.players[playerId].items.push(...c);
    } else if (placementType == "secret") {
      room.players[playerId].secret.push(...c);
    }
    console.log("kortet ges till vinnaren" + playerId);
    console.log(card);
    console.log("cardinauction" + room.cardInAuction);
    console.log("spelarens kort" + room.players[playerId].money);
    room.players[playerId].money -= auctionPrice;
    room.cardInAuction = [];
    room.auctionWinner = false;
    console.log("spelarens kort" + room.players[playerId].money);
  }
};
// ...then check if it is in the hand. It cannot be in both so it's safe

Data.prototype.placeBottle = function(roomId, playerId, action, placement, players) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.players = players;
    let activePlacement = [];
    if (action === "buy") {
      activePlacement = room.buyPlacement;
    } else if (action === "skill") {
      activePlacement = room.skillPlacement;
    } else if (action === "auction") {
      activePlacement = room.auctionPlacement;
    } else if (action === "market") {
      activePlacement = room.marketPlacement;
    }
    room.players[playerId].bottles--;
    this.changeBottleOnPlayerboarad(roomId, playerId, false);
    for (let i = 0; i < activePlacement.length; i += 1) {
      if (
        activePlacement[i].cost === placement.cost &&
        activePlacement[i].amountOfCards === placement.amountOfCards &&
        activePlacement[i].playerId === null
      ) {
        activePlacement[i].playerId = playerId;
        break;
      }
    }
    this.currentValue(roomId, playerId);
  }
};

Data.prototype.removeBottle = function(roomId, playerId, action, placement) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let activePlacement = [];
    if (action === "buy") {
      activePlacement = room.buyPlacement;
    } else if (action === "skill") {
      activePlacement = room.skillPlacement;
    } else if (action === "auction") {
      activePlacement = room.auctionPlacement;
    } else if (action === "market") {
      activePlacement = room.marketPlacement;
    }
    room.players[playerId].bottles++;
    this.changeBottleOnPlayerboarad(roomId, playerId, true);
    for (let i = 0; i < activePlacement.length; i += 1) {
      if (
        activePlacement[i].cost === placement.cost &&
        activePlacement[i].amountOfCards === placement.amountOfCards &&
        activePlacement[i].playerId === playerId
      ) {
        activePlacement[i].playerId = null;
        break;
      }
    }
  }
};

Data.prototype.clearBottles = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    for (let i = 0; i < room.buyPlacement.length; i += 1) {
      room.buyPlacement[i].playerId = null;
    }
    for (let i = 0; i < room.skillPlacement.length; i += 1) {
      room.skillPlacement[i].playerId = null;
    }
    for (let i = 0; i < room.auctionPlacement.length; i += 1) {
      room.auctionPlacement[i].playerId = null;
    }
    for (let i = 0; i < room.marketPlacement.length; i += 1) {
      room.marketPlacement[i].playerId = null;
    }
    room.workPlacement.drawTwoCards = null;
    room.workPlacement.drawACardAndFirstPlayerToken = null;
    room.workPlacement.drawCardAndPassiveIncome = null;
    room.workPlacement.quarterTile = null;
    console.log(room.workPlacement);
    console.log("Bottles Cleared");
  }
};

Data.prototype.placeBottleOnPlayerboard = function(
  roomId,
  playerId,
  tempBottlePlacement
) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.players[playerId].bottlesOnPlayerbord = tempBottlePlacement;
    if (tempBottlePlacement[0] == false) {
      room.players[playerId].bottles++;
      room.players[playerId].totalBottles++;
      room.players[playerId].bottlesOnPlayerbord[0] = true;
    }
    if (tempBottlePlacement[1] == false) {
      room.players[playerId].bottles++;
      room.players[playerId].totalBottles++;
      room.players[playerId].bottlesOnPlayerbord[1] = true;
    }
    if (tempBottlePlacement[2] == false) {
      this.drawCard(roomId, playerId);
    }
  }
  if (tempBottlePlacement[3] == false) {
    room.players[playerId].money++;
  }
  if (tempBottlePlacement[4] == false) {
    room.players[playerId].money++;
    room.players[playerId].money++;
  }
};

Data.prototype.getCardInAuction = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.cardInAuction;
  } else return [];
};

/* returns the hand of the player */
Data.prototype.getCards = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let i = room.players.map((d) => d.playerId).indexOf(playerId);
    return room.players[i].hand;
  } else return [];
};

Data.prototype.getBottlePlacements = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return {
      buyPlacement: room.buyPlacement,
      skillPlacement: room.skillPlacement,
      auctionPlacement: room.auctionPlacement,
      marketPlacement: room.marketPlacement,
      round: room.round,
      players: room.players,
    };
  } else return {};
};
Data.prototype.getPlacements = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return {
      buyPlacement: room.buyPlacement,
      skillPlacement: room.skillPlacement,
      auctionPlacement: room.auctionPlacement,
      marketPlacement: room.marketPlacement,
      players: room.players,
      round: room.round,
    };
  } else return {};
};

Data.prototype.getItemsOnSale = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.itemsOnSale;
  } else return [];
};
Data.prototype.getSkillsOnSale = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.skillsOnSale;
  } else return [];
};
Data.prototype.getRaiseItems = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.raiseItems;
  } else return [];
};

Data.prototype.getMarketValues = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.market.reduce(
      function(acc, curr) {
        acc[curr.market] += 1;
      },
      {
        fastaval: 0,
        movie: 0,
        technology: 0,
        figures: 0,
        music: 0,
      }
    );
  } else return [];
};
Data.prototype.getAuctionCards = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.auctionCards;
  } else return [];
};

//slumpar vilken av spelarna som ska får starta.
Data.prototype.startTurn = function(roomId) {
  let room = this.rooms[roomId];

  if (typeof room !== "undefined") {
    // x=Math.floor(Math.random()*2)
    room.round = 1;
    var keys = Object.keys(room.players);
    for (let j = 0; j < keys.length; j += 1) {
      this.drawCard(roomId, keys[j]);
      this.drawCard(roomId, keys[j]);
      this.drawCard(roomId, keys[j]);
    }
    room.startingPlayerId = keys[Math.floor(keys.length * Math.random())];
    room.players[room.startingPlayerId].turn = true;
    let k = Object.keys(room.players).indexOf(room.startingPlayerId);
    let coisAmount = 0;
    while (true){
      console.log(keys[k] +"   " + k)
      if(k == keys.length -1){
        k = -1;
      }
      k ++;
      console.log(keys[k] +"   " + k)
      if(keys[k]== room.startingPlayerId){
        break;
      }
      coisAmount ++;
      room.players[keys[k]].money += coisAmount;
    }
    return room.players, room.round;
  }
};
Data.prototype.getPlayerColor = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.playerColor;
  } else return [];
};
Data.prototype.getAuctionWinner = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.auctionWinner;
  } else return [];
};
Data.prototype.getRound = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.round;
  } else return [];
};
Data.prototype.getAuctionLeaderId = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.auctionLeaderId;
  } else return [];
};
Data.prototype.getAuctionPrice = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.auctionPrice;
  } else return [];
};
Data.prototype.gethiddenAuctionCard = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.hiddenAuctionCard;
  } else return [];
};

/* lägg till items så den byter håll. Sen lös items till skills för den verkar bugga.

*/
Data.prototype.moveCards = function(roomId) {
  /*
Now refill all pools (except the market pool) from the deck.
All pools (except the market pool) should have the same number of cards after this step as after setup. */

  let c = null;
  let k = null;
  

  let room = this.rooms[roomId];
  let cardToRaiseValue = false;
  if (typeof room !== "undefined") {
    //move skills
    room.skillsOnSale = this.bubbleSort(room.skillsOnSale);
      for (let i = room.skillsOnSale.length - 1; i >= 0; i -= 1) {
        if (room.skillsOnSale[i].market) {
          c = room.skillsOnSale.splice(i, 1, {});
          room.raiseItems.push(...c);
          room.raiseValue = this.cardValue(roomId);
          cardToRaiseValue = true;
          //console.log("visas 1 gång. Kort försvinner.");
          break;
        }
      }

    if(cardToRaiseValue != true){
      room.itemsOnSale = this.bubbleSort(room.itemsOnSale);
      //fill Items
    
      room.itemsOnSale = this.fillPool(roomId, "items", room.itemsOnSale);
      for (let i = room.itemsOnSale.length - 1; i >= 0; i -= 1) {
        if (room.itemsOnSale[i].market) {
          c = room.itemsOnSale.splice(i, 1, {});
          room.raiseItems.push(...c);
          room.raiseValue = this.cardValue(roomId);
          //console.log("visas 1 gång. Kort försvinner.");
          break;
        }
      }
    }

    if (cardToRaiseValue != true) {
      room.itemsOnSale = this.bubbleSort(room.itemsOnSale);
      //fill Items

      room.itemsOnSale = this.fillPool(roomId, "items", room.itemsOnSale);
      for (let i = room.itemsOnSale.length - 1; i >= 0; i -= 1) {
        if (room.itemsOnSale[i].market) {
          c = room.itemsOnSale.splice(i, 1, {});
          room.raiseItems.push(...c);
          room.raiseValue = this.cardValue(roomId);
          //console.log("visas 1 gång. Kort försvinner.");
          break;
        }
      }
    }
    //Sort Skills
    room.skillsOnSale = this.bubbleSort(room.skillsOnSale);
    //move items
    var counter = 0;
    for (let i = room.skillsOnSale.length - 1; i >= 0; i -= 1) {
      if (!room.skillsOnSale[i].market) {
        
        counter++;
      }
    }
    room.itemsOnSale = this.bubbleSort(room.itemsOnSale);
    //fill Items
  
    room.itemsOnSale = this.fillPool(roomId, "items", room.itemsOnSale);
    room.itemsOnSale = this.bubbleSort(room.itemsOnSale);
    var theCounter=0;
    for (let i = room.itemsOnSale.length - 1; i >= 0; i -= 1) {
      if (!room.itemsOnSale[i].market) {
        
        theCounter++;
      }
    }
  //  console.log("items 4"+room.itemsOnSale[4].market);
    //console.log("items 3"+room.itemsOnSale[3].market);
    //console.log("items 2"+room.itemsOnSale[2].market);
    //console.log("items 1"+room.itemsOnSale[1].market);
    //console.log("items 0"+room.itemsOnSale[0].market);
    //console.log("theCounter"+theCounter);

    //console.log("counter:"+counter);
    //sort Items
    
    //console.log("counter"+counter);
    var cardCounter=5-counter;
    var numberOfCards=room.playerCount+1;

    var j=room.itemsOnSale.length-1;
    //console.log("j:"+j);
      for (let i = counter-1; i >= 0; i -= 1) {
        //console.log("cardCounter"+cardCounter);
        //console.log("room.cards"+numberOfCards);
        if(numberOfCards>cardCounter){
        //   console.log("hej:"+room.itemsOnSale[j].market);
            if(room.itemsOnSale[j].market){
           //   console.log("inne här plats i ska fyllas:"+i);
              //console.log("itemsonsale:"+room.itemsOnSale[j].market);
              k = room.itemsOnSale.splice(j, 1, {});
              
              room.skillsOnSale.splice(i, 1, ...k);
             // console.log("skillsOnSale:"+room.skillsOnSale[i].market);
              //console.log("plats:"+i);
              
              //console.log("vi gick in hit");
              j-=1;
             
              
        
          
        }
        cardCounter+=1;
      }
    }
    //sort items
    room.itemsOnSale = this.bubbleSort(room.itemsOnSale);

    //move auction
    for (let i = room.auctionCards.length - 1; i >= 0; i -= 1) {
      if (room.auctionCards[i].market) {
        c = room.auctionCards.splice(i, 1, {});
        room.raiseItems.push(...c);
        room.raiseValue = this.cardValue(roomId);
        break;
      }
    }
    //sort auctionCards
    room.auctionCards = this.bubbleSort(room.auctionCards);

    //fill pools

    room.itemsOnSale = this.fillPool(roomId, "items", room.itemsOnSale);
    room.auctionCards = this.fillPool(roomId, "auction", room.auctionCards);
    room.auctionCards = this.bubbleSort(room.auctionCards);
    room.itemsOnSale = this.bubbleSort(room.itemsOnSale);
  } else return [];
};

//getCardValue är den som körs när rummet initiseras. Därav if och else satsen. Detta som jag tror kan lösas snyggare.
//Följ till cardValue.
Data.prototype.getCardValue = function(roomId) {
  let room = this.rooms[roomId];
  if (room.raiseValue !== null) {
    if (typeof room !== "undefined") {
      return room.raiseValue;
    } else return [];
  } else {
    room.raiseValue = this.cardValue(roomId);
    return room.raiseValue;
  }
};
Data.prototype.nameAndColor = function(roomId, playerId, name, color) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    console.log("denna färg: " + color);

    if (color == null) {
      color = room.playerColor[0];
    }
    room.players[playerId].color = color;

    console.log("detta namn: " + name);
    if (name == "") {
      var fs = require("fs");
      var text = fs.readFileSync("./data/example-names.txt").toString("utf-8");
      var textByLine = text.split("\n");
      room.players[playerId].name =
        textByLine[Math.floor(Math.random() * textByLine.length)];
    } else {
      room.players[playerId].name = name;
    }

    for (let i = 0; i < room.playerColor.length; i += 1) {
      if (room.playerColor[i] == color) {
        room.playerColor.splice(i, 1);
      }
    }
  }
};
//Byter spelare till nästa i arrayen
Data.prototype.nextPlayer = function(roomId, playerId, auctionActive) {
  let playerWithBottle = false;
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    var keys = Object.keys(room.players);
    let i = Object.keys(room.players).indexOf(playerId);
    room.players[keys[i]].turn = false;
    //while()
    if (auctionActive) {
      if (i === keys.length - 1) {
        i = -1;
      }
      room.players[keys[i + 1]].turn = true;
    } else {
      let j = i;
      this.currentValue(roomId, playerId);
      while (playerWithBottle == false){
        if (j === keys.length - 1) {
          j = -1;
        }
        j++;
        if (j == i) {
          if (room.players[keys[j]].bottles > 0) {
            room.players[keys[j]].turn = true;
            playerWithBottle = true;
          } else {
            room.round += 1;
            room.players[room.startingPlayerId].turn = true

            //Spelaren får sin inkomst
            for (var player in room.players) {
              if (room.players[player].income.length > 0) {
                for (var card in room.players[player].income) {
                  try {
                    room.players[player].money += card.value;
                    console.log("money added to: " + player);
                  } catch {
                    console.log("non player looped (nothing wrong)");
                  }
                }
              }
            }

            this.moveCards(roomId);
            if (room.round < 5) {
              this.clearBottles(roomId);
              this.fillBottles(roomId);
            }

            playerWithBottle = true;
            for (const player in room.players) {
              this.currentValue(roomId, player);
            }
          }
        } else {
          if (room.players[keys[j]].bottles > 0) {
            room.players[keys[j]].turn = true;
            playerWithBottle = true;
          }
        }
      }
    }
      if (room.round == 5) {
        console.log("yo Olle å hugo");
        for (const player in room.players) {
         
          if(room.players[player].secret.length>0){
            room.players[player].items.splice(0,0,room.players[player].secret);
         
          this.currentValue(roomId, player);
          console.log("");
        }
      }
    }
    return room.players, room.round;
  }
};

Data.prototype.changeBottleOnPlayerboarad = function(
  roomId,
  playerId,
  addBottle
) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    for (
      let i = 0;
      i < room.players[playerId].bottlesOnPlayerbord.length;
      i += 1
    ) {
      if (room.players[playerId].bottlesOnPlayerbord[i] != addBottle) {
        room.players[playerId].bottlesOnPlayerbord[i] = addBottle;
        break;
      }
    }
  }
};
Data.prototype.fillBottles = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    var keys = Object.keys(room.players);
    for (let i = 0; i < keys.length; i += 1) {
      room.players[keys[i]].bottles = room.players[keys[i]].totalBottles;
    }
  }
};

//budgivning vid auction
Data.prototype.auctionBids = function(
  roomId,
  playerId,
  bid,
  auctionPrice,
  players
) {
  let room = this.rooms[roomId];
  room.players = players;
  console.log("bid::" + bid);
  if (typeof room !== "undefined") {
    if (auctionPrice == 0) {
      room.auctonStarterId = playerId;
    }
    if (bid > auctionPrice) {
      auctionPrice = bid;
      room.auctionLeaderId = playerId;
    } else {
      var keys = Object.keys(room.players);
      let i = Object.keys(room.players).indexOf(playerId);
      if (i === keys.length - 1) {
        if (keys[0] == room.auctionLeaderId) {
          console.log("varför1");
          room.auctionWinner = true;
          room.players[playerId].turn = false;
          room.players[room.auctonStarterId].turn = true;
          room.auctonStarterId = null;
        }
      } else if (keys[i + 1] == room.auctionLeaderId) {
        room.auctionWinner = true;
        room.players[playerId].turn = false;
        room.players[room.auctonStarterId].turn = true;
        room.auctonStarterId = null;
      }
    }
    room.auctionPrice = auctionPrice;
    if (room.auctonStarterId !== null) {
      this.nextPlayer(roomId, playerId, true);
    }

    return room.players;
  }
};

//I cardvalue så sätts alla värden på korten. Om det ligger 1 kort med market=fastaval så kommer fastaval ökas med 1.
Data.prototype.cardValue = function(roomId) {
  var fastaval = 0;
  var figures = 0;
  var music = 0;
  var movie = 0;
  var technology = 0;

  let room = this.rooms[roomId];

  if (typeof room !== "undefined") {
    for (let i = 0; i < room.raiseItems.length; i += 1) {
      if (room.raiseItems[i].market == "fastaval") {
        fastaval += 1;
      } else if (room.raiseItems[i].market == "figures") {
        figures += 1;
      } else if (room.raiseItems[i].market == "music") {
        music += 1;
      } else if (room.raiseItems[i].market == "movie") {
        movie += 1;
      } else if (room.raiseItems[i].market == "technology") {
        technology += 1;
      }
    }

    return {
      fastaval: fastaval,
      figures: figures,
      music: music,
      movie: movie,
      technology: technology,
    };
  } else {
    return [];
  }
};

Data.prototype.getItemValue = function(roomId, playerId) {
  console.log("Hej på dig din jävla king");
  let room = this.rooms[roomId];

  room.players[playerId].itemValues.ifastaval = 0;
  room.players[playerId].itemValues.ifigures = 0;
  room.players[playerId].itemValues.imusic = 0;
  room.players[playerId].itemValues.imovie = 0;
  room.players[playerId].itemValues.itechnology = 0;

  if (typeof room !== "undefined") {
    for (let i = 0; i < room.players[playerId].items.length; i += 1) {
      if (room.players[playerId].items[i].item == "fastaval") {
        room.players[playerId].itemValues.ifastaval += 1;
        console.log("Ny fastaval: ");
        console.log(room.players[playerId].itemValues.ifastaval);
      } else if (room.players[playerId].items[i].item == "figures") {
        room.players[playerId].itemValues.ifigures += 1;
        console.log("Ny figures: ");
        console.log(room.players[playerId].itemValues.ifigures);
      } else if (room.players[playerId].items[i].item == "music") {
        room.players[playerId].itemValues.imusic += 1;
        console.log("Ny music: ");
        console.log(room.players[playerId].itemValues.imusic);
      } else if (room.players[playerId].items[i].item == "movie") {
        room.players[playerId].itemValues.imovie += 1;
        console.log("Ny movie: ");
        console.log(room.players[playerId].itemValues.imovie);
      } else if (room.players[playerId].items[i].item == "technology") {
        room.players[playerId].itemValues.itechnology += 1;
        console.log("Ny tech: ");
        console.log(room.players[playerId].itemValues.itechnology);
      }
    }

    return {};
  } else {
    return [];
  }
};

Data.prototype.bubbleSort = function(cardArray = 10) {
  var swapp;
  var n = cardArray.length - 1;
  var x = cardArray;

  do {
    swapp = false;
    for (var i = n; i > 0; i--) {
      if (
        typeof x[i].market == "undefined" &&
        !(typeof x[i - 1].market == "undefined")
      ) {
        var temp = x[i];
        x[i] = x[i - 1];
        x[i - 1] = temp;
        swapp = true;
      } else {
      }
    }
  } while (swapp);
  return x;
};
Data.prototype.fillPool = function(roomId, name, cardArray) {
  let room = this.rooms[roomId];
  let c = null;
  if (typeof room !== "undefined") {
    var counter = 0;
    for (let i = cardArray.length - 1; i >= 0; i -= 1) {
      if (typeof cardArray[i].market != "undefined") {
        counter++;
      }

      //ändra så loopen lägger till i andra irdnbingen tvärtom

      if (name === "skills" && counter < room.playerCount + 1) {
        for (let index = 0; index < room.playerCount + 1 - counter; index++) {
          if (room.deck.length > 0) {
            c = room.deck.pop();
            cardArray.splice(index, 1, c);
          }
        }
      }
    }
    if (name === "items" && counter < room.playerCount + 1) {
      for (let index = 0; index < room.playerCount + 1 - counter; index++) {
        if (room.deck.length > 0) {
          c = room.deck.pop();
          cardArray.splice(index, 1, c);
        }
      }
    }

    if (name === "auction" && counter < 4) {
      for (let index = 0; index < 4 - counter; index++) {
        if (room.deck.length > 0) {
          c = room.deck.pop();
          cardArray.splice(index, 1, c);
        }
      }
    }
  }

  return cardArray;
};

//-------------------WORK metoder-----------------------
Data.prototype.workDrawCardTwoCards = function(roomId, playerId) {
  //Dra kort genom WORK
  let room = this.rooms[roomId];

  if (typeof room !== "undefined") {
    for (var i = 0; i < 2; i++) {
      let card = room.deck.pop();
      room.players[playerId].hand.push(card);
    }

    //room.workPlacement[0] = true;
    //console.log(room.workPlacement[0])
    room.players[playerId].bottles--;
    this.changeBottleOnPlayerboarad(roomId, playerId, false);
    return room.players;
  } else return [];
};
Data.prototype.bottleRecycled = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.players[playerId].bottles--;
    room.players[playerId].totalBottles--;
    room.players[playerId].money++;
    return room.players;
  } else return [];
};
Data.prototype.bottleRecycled4thRound = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.players[playerId].bottles--;
    room.players[playerId].money += 3;
    return room.players;
  } else return [];
};
Data.prototype.takeFirstPlayerToken = function(roomId, playerId) {
  let room = this.rooms[roomId];
  console.log(playerId, "got scammed :^(");
  room.players[playerId].bottles--;
  room.startingPlayerId = playerId;
  room.players[playerId].firstPlayerToken = true; //Behövs??

  this.changeBottleOnPlayerboarad(roomId, playerId, false);

  return room.players;
};
Data.prototype.drawPassiveIncome = function(roomId, playerId) {
  //drawCard kallas genom Socket detta är bara för inkomstdelen
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let card = room.deck.pop();
    room.players[playerId].income.push(card);

    this.changeBottleOnPlayerboarad(roomId, playerId, false);
    room.players[playerId].bottles--;
    return room.players;
  } else return [];
};
Data.prototype.getWorkPlacement = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.workPlacement;
  } else return [];
};
Data.prototype.setWorkPlacementTrue = function(roomId, place, playerId) {
  console.log("Set workplacement körs!");
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    switch (place) {
      case "drawTwoCards":
        room.workPlacement.drawTwoCards = playerId;
        this.changeBottleOnPlayerboarad(roomId, playerId, false);
        break;
      case "drawACardAndFirstPlayerToken":
        room.workPlacement.drawACardAndFirstPlayerToken = playerId;
        this.changeBottleOnPlayerboarad(roomId, playerId, false);
        break;
      case "drawCardAndPassiveIncome":
        room.workPlacement.drawCardAndPassiveIncome = playerId;
        this.changeBottleOnPlayerboarad(roomId, playerId, false);
        break;
      case "quarterTile":
        room.workPlacement.quarterTile = playerId;
        this.changeBottleOnPlayerboarad(roomId, playerId, false);
        break;
      default:
        console.log("Shits fucked");
        break;
    }

    console.log("workPlacement:");
    console.log(room.workPlacement);
    console.log("---------------");
    return room.workPlacement;
  } else return [];
};
Data.prototype.addMoney = function(roomId, playerId, amount) {
  console.log("addMoney i dataHandler");
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.players[playerId].money += amount;
    return room.players;
  } else return [];
};
Data.prototype.addPassiveIncome = function(roomId, playerId, amount) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    for (var i = 0; i < amount; i++) {
      var card = room.deck.pop();
      room.players[playerId].income.push(card);
    }
    room.players[playerId].bottles--;
    return room.players;
  } else return [];
};

Data.prototype.currentValue = function(roomId, playerId) {
  let room = this.rooms[roomId];
  var fastaval = 0;
  var figures = 0;
  var music = 0;
  var movie = 0;
  var technology = 0;
  var extraValue = 0;

  if (typeof room !== "undefined") {
    console.log("gick in hit");
    for (let index = 0; index < room.players[playerId].items.length; index++) {
      if (room.players[playerId].items[index].item == "fastaval") {
        fastaval += 1;
      } else if (room.players[playerId].items[index].item == "movie") {
        movie += 1;
      } else if (room.players[playerId].items[index].item == "technology") {
        technology += 1;
      } else if (room.players[playerId].items[index].item == "figures") {
        figures += 1;
      } else if (room.players[playerId].items[index].item == "music") {
        music += 1;
      }
    }
    for (let index = 0; index < room.players[playerId].skills.length; index++) {
      if(room.players[playerId].skills[index].skill=="VP-all" && fastaval>0 && figures>0 && music>0 && movie>0 && technology>0){
        extraValue+=5;
        console.log("VP-all"+extraValue)
      }
      else if(room.players[playerId].skills[index].skill=="VP-fastaval" && fastaval>0){
        console.log("VP-fastaval:"+extraValue);
        extraValue+=fastaval;

      }
      else if(room.players[playerId].skills[index].skill=="VP-figures" && figures>0){
        console.log("VP-figures:"+extraValue);
        extraValue+=figures;

      }
      else if(room.players[playerId].skills[index].skill=="VP-music" && music>0){
        console.log("VP-music:"+extraValue);
        extraValue+=music;

      }
      else if(room.players[playerId].skills[index].skill=="VP-movie" && movie>0){
        console.log("VP-movie:"+extraValue);
        extraValue+=movie;

      }
      else if(room.players[playerId].skills[index].skill=="VP-technology" && technology>0){
        console.log("VP-technology:"+extraValue);
        extraValue+=technology;

      }
      console.log("extraValue:"+extraValue);
    }
    if (room.round == 5) {
      extraValue += Math.floor(room.players[playerId].money / 3);
    }

    if (extraValue < 0) {
      extraValue = 0;
    }
    extraValue = extraValue + fastaval + figures + music + movie + technology;

    room.players[playerId].currentScore = extraValue;

    return room.players[playerId].currentScore;
  } else return [];
};
//------------------------------------------------------

module.exports = Data;
