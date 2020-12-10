'use strict';

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
Data.prototype.initializeTable = function (table) {
  csv({
      checkType: true
    })
    .fromFile("./data/" + table + ".csv")
    .then((jsonObj) => {
      this.data[table] = jsonObj;
    });
};

Data.prototype.initializeData = function () {
  console.log("Starting to build data tables");
  for (let i in languages) {
    this.initializeTable(collectorsDeck);
  }
}

Data.prototype.getUILabels = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let lang = room.lang;
    var ui = require("./data/collectors-" + lang + ".json");
    return ui;
  } else return {};
}

Data.prototype.createRoom = function (roomId, playerCount, lang = "en") {
  let room = {};
  room.players = {};
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playerCount = playerCount;
  room.itemsOnSale = room.deck.splice(0, 5);
  room.skillsOnSale = room.deck.splice(0, 5);
  room.auctionCards = room.deck.splice(0, 4);
  room.raiseItems = room.deck.splice(0, 6);
  room.raiseValue=null;
 
  room.cardInAuction = [];
  room.market = [];
  room.round = 0;
  room.startingPlayerId = null;
  room.buyPlacement = [{
      cost: 1,
      playerId: null
    },
    {
      cost: 1,
      playerId: null
    },
    {
      cost: 2,
      playerId: null
    },
    {
      cost: 2,
      playerId: null
    },
    {
      cost: 3,
      playerId: null
    }
  ];
  room.skillPlacement = [{
      cost: 0,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    },
    {
      cost: 1,
      playerId: null
    },
    {
      cost: 1,
      playerId: null
    }
  ];
  room.auctionPlacement = [{
      cost: -2,
      playerId: null
    },
    {
      cost: -1,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    }
  ];
  room.marketPlacement = [{
      cost: 0,
      playerId: null
    },
    {
      cost: -2,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    }
  ];
  this.rooms[roomId] = room;
}

Data.prototype.createDeck = function () {
  // we want a copy of the deck array, not a reference to it so we use the
  // spread operator (...) to copy the items. Note that this is a shallow copy
  // so it is not generalizable to all copy problems
  let deck = [...this.data[collectorsDeck]];
  return shuffle(deck);
}

Data.prototype.joinGame = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    if (typeof room.players[playerId] !== 'undefined') {
      console.log("Player", playerId, "joined again with info", room.players[playerId]);
      return true;
    } else if (Object.keys(room.players).length < room.playerCount) {
      console.log("Player", playerId, "joined for the first time");
      room.players[playerId] = {
        hand: [],
        money: 3,
        points: 0,
        skills: [],
        items: [],
        income: [],
        secret: [],
        turn: false
      };
      return true;
    }
    console.log("Player", playerId, "was declined due to player limit");
  }
  return false;
}

Data.prototype.getPlayers = function (id) {
  let room = this.rooms[id]
  if (typeof room !== 'undefined') {
    return room.players;
  } else return {};
}

Data.prototype.updatePoints = function (roomId, player, points) {
  let room = this.rooms[roomId]
  if (typeof room !== 'undefined') {
    room.points[player] += points;
    return room.points;
  } else return {};
}

/* returns players after a new card is drawn */
Data.prototype.drawCard = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let card = room.deck.pop();
    room.players[playerId].hand.push(card);
    return room.players;
  } else return [];
  
}

/* moves card from itemsOnSale to a player's hand */
Data.prototype.buyCard = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.itemsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality      
      if (room.itemsOnSale[i].x === card.x &&
        room.itemsOnSale[i].y === card.y) {
        c = room.itemsOnSale.splice(i, 1, {});
        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality      
      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    room.players[playerId].items.push(...c);

    room.players[playerId].money -= cost+room.raiseValue[card.item];

  }
}
Data.prototype.buySkill = function (roomId, playerId, card, cost) {
  console.log(playerId)
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality      
      if (room.skillsOnSale[i].x === card.x &&
        room.skillsOnSale[i].y === card.y) {
        c = room.skillsOnSale.splice(i, 1, {});
        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality      
      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    room.players[playerId].skills.push(...c);
    room.players[playerId].money -= cost;

  }
}

Data.prototype.startAuction = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality      
      if (room.auctionCards[i].x === card.x &&
        room.auctionCards[i].y === card.y) {
        c = room.auctionCards.splice(i, 1, {});
        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality      
      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    console.log("Det här är kortet :")
    console.log(card)
    console.log(room.players[playerId].hand)
    console.log(room.auctionCards)
    room.cardInAuction.push(card);
    room.players[playerId].money -= cost;
    console.log(room.auctionCards)
    console.log("Det här är kortet :")
    console.log(room.cardInAuction)

  }
}


Data.prototype.auctionWon = function (roomId, playerId) {
  let room = this.rooms[roomId];
  let card = null;
  if (typeof room !== 'undefined') {
    let c = null;
        card = cardInAuction[0];
        c = room.cardInAuction.splice(0, 1, {});
      }
      console.log("kortet ges till vinnaren"+playerId)
      console.log(card)
      room.players[playerId].hand.push(card);
      room.players[playerId].money -= AuctionPrice;
}
    // ...then check if it is in the hand. It cannot be in both so it's safe

Data.prototype.placeBottle = function (roomId, playerId, action, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
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
    for (let i = 0; i < activePlacement.length; i += 1) {
      if (activePlacement[i].cost === cost &&
        activePlacement[i].playerId === null) {
        activePlacement[i].playerId = playerId;
        break;
      }
    }
  }
}

Data.prototype.getCardInAuction = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.cardInAuction;
  }
  else return [];
}


/* returns the hand of the player */
Data.prototype.getCards = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let i = room.players.map(d => d.playerId).indexOf(playerId)
    return room.players[i].hand;
  } else return [];
}

Data.prototype.getPlacements = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return {
      buyPlacement: room.buyPlacement,
      skillPlacement: room.skillPlacement,
      auctionPlacement: room.auctionPlacement,
      marketPlacement: room.marketPlacement
    }
  } else return {};
}

Data.prototype.getItemsOnSale = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.itemsOnSale;
  } else return [];
}
Data.prototype.getSkillsOnSale = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.skillsOnSale;
  } else return [];
}
Data.prototype.getRaiseItems = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.raiseItems;
  }
  else return [];
}

Data.prototype.getMarketValues = function (roomId,) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.market.reduce(function (acc, curr) {
      acc[curr.market] += 1;
    }, {
      fastaval: 0,
      movie: 0,
      technology: 0,
      figures: 0,
      music: 0
    });
  } else return [];
}
Data.prototype.getAuctionCards = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionCards;
  } else return [];
}

//slumpar vilken av spelarna som ska får starta. 
Data.prototype.startTurn = function (roomId) {
  let room = this.rooms[roomId];

  if (typeof room !== 'undefined') {
    // x=Math.floor(Math.random()*2)
    room.round = 1;
    var keys = Object.keys(room.players);
    room.startingPlayerId = keys[Math.floor(keys.length * Math.random())];
    room.players[room.startingPlayerId].turn = true;
    return room.players, room.round;

  }



}

Data.prototype.getRound = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.round;
  } else return [];
}
Data.prototype.getAuctionLeaderId = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionLeaderId;
  } else return [];
}
Data.prototype.getAuctionPrice = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionPrice;
  } else return [];
}

//getCardValue är den som körs när rummet initiseras. Därav if och else satsen. Detta som jag tror kan lösas snyggare. 
//Följ till cardValue.
Data.prototype.getCardValue = function (roomId) {
  
  let room = this.rooms[roomId];
  console.log("jag kom hit"+room.raiseValue);
  if(room.raiseValue !==null){
   if (typeof room !== 'undefined') {
      return room.raiseValue;
    } else return [];
}else {
  room.raiseValue=this.cardValue(roomId);
  return room.raiseValue;
}
}

//Byter spelare till nästa i arrayen 
Data.prototype.nextPlayer = function (roomId, playerId, auctionActive) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    console.log(room.round)
    var keys = Object.keys(room.players);
    let i = Object.keys(room.players).indexOf(playerId)
    room.players[keys[i]].turn = false;
    if (i === keys.length - 1) {
      i = -1
    }
    room.players[keys[i + 1]].turn = true;
    console.log(auctionActive)
    if (room.startingPlayerId === keys[i+1] && !auctionActive) {
      room.round += 1;
    }
    return room.players, room.round;

  }


}
//budgivning vid auction
Data.prototype.auctionBids = function (roomId, playerId, bid, auctionPrice) {
  let room = this.rooms[roomId];
  console.log("bid::" + bid)
  if (typeof room !== 'undefined') {
    if (bid > auctionPrice){
      auctionPrice = bid;
      room.auctionLeaderId = playerId;
    }

    else{
      var keys = Object.keys(room.players);
      let i = Object.keys(room.players).indexOf(playerId)
      console.log(i +"ör lika med"+keys.length-1)
      if (i === keys.length - 1){
        if(keys[0] === room.auctionLeaderId){
          console.log("varför1")
          //this.auctionWinner(room, room.auctionLeaderId)
          
        }
      }
      else if (room.players[keys[i+1]]=== room.auctionLeaderId){
        console.log("varför2")
        //this.auctionWinner(room, room.auctionLeaderId)
      }
    }
    room.auctionPrice = auctionPrice;
    console.log("PirceA::"+auctionPrice)
    this.nextPlayer(roomId, playerId, true)
    return room.player
}
}

//vinnar budet 

Data.prototype.auctionBid = function (roomId, playerId, bid, auctionPrice){

}


//I cardvalue så sätts alla värden på korten. Om det ligger 1 kort med market=fastaval så kommer fastaval ökas med 1. 
Data.prototype.cardValue = function (roomId) {
  var fastaval=0;
  var figures=0;
  var music=0;
  var movie=0;
  var technology=0;
 
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    
    for (let i = 0; i < room.raiseItems.length; i += 1) {
    if (room.raiseItems[i].market === "fastaval") {
      fastaval+=1;
     
    } else if (room.raiseItems[i].market === "figures") {
      figures+=1;
    } else if (room.raiseItems[i].market === "music") {
      music+=1;
    } else if (room.raiseItems[i].market === "movie") {
      movie+=1;
    }else if (room.raiseItems[i].market === "technology") {
      technology+=1;
    }
    
  }

    return{
      fastaval:fastaval,
      figures:figures,
      music:music,
      movie:movie,
      technology:technology,

    }
}else {
  
  return [];
}
}

module.exports = Data;