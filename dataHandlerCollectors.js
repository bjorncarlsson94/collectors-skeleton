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
  room.itemsOnSale = room.deck.splice(0, room.playerCount+1);
  for (let index = room.playerCount+1; index < 5; index++) {
    room.itemsOnSale.push({});
    
  }
  room.itemsOnSale=this.bubbleSort(room.itemsOnSale);
  room.skillsOnSale = room.deck.splice(0, room.playerCount+1);
  for (let index = room.playerCount+1; index < 5; index++) {
    room.skillsOnSale.push({});
    
  }
  room.skillsOnSale=this.bubbleSort(room.skillsOnSale);
  room.auctionCards = room.deck.splice(0, 4);
  room.raiseItems = room.deck.splice(0, 6);
  room.raiseValue=null;
  room.playerColor =  ['#5fd8fd','#7e2174','#19b3a7','#ca9e68'],
  room.auctonStarterId =null;
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
  room.workPlacement = [
    false,
    false,
    false
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
        bottles: 2,
        points: 0,
        firstPlayerToken: false,
        skills: [],
        items: [],
        income: [],
        secret: [],
        name: null,
        color: null,
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
Data.prototype.restoreHands= function (roomId, playerId, biddingCards) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    for (let i = 0; i < biddingCards.length; i += 1) {
      let card = biddingCards[i]
      console.log("this card"+ card)
      room.players[playerId].hand.push(card);
    } 
  }
  return room.players;
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


Data.prototype.auctionWon = function (roomId, playerId, placementType,auctionPrice) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
        let card = room.cardInAuction[0];
        c = room.cardInAuction.splice(0, 1, {});
        if (placementType == 'raiseValue') {
          room.raiseItems.push(...c);
          room.raiseValue=this.cardValue(roomId);
        }
        else if(placementType == 'skills'){
          room.players[playerId].skills.push(...c);
        }
        else if(placementType == 'items'){
          room.players[playerId].items.push(...c);
        }
        else if(placementType == 'secret'){
          room.players[playerId].secret.push(...c);
        }
      console.log("kortet ges till vinnaren"+playerId)
      console.log(card)
      console.log("cardinauction"+room.cardInAuction);
      console.log("spelarens kort"+room.players[playerId].money)
      room.players[playerId].money -= auctionPrice;
      room.cardInAuction = [];
      room.auctionWinner =false;
      console.log("spelarens kort"+room.players[playerId].money)
}
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
Data.prototype.getPlayerColor = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.playerColor;
  } else return [];
}
Data.prototype.getAuctionWinner= function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionWinner;
  } else return [];
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
Data.prototype.moveCards = function(roomId){
 

 /*
Now refill all pools (except the market pool) from the deck. 
All pools (except the market pool) should have the same number of cards after this step as after setup. */
  let c = null;
  let k=null;
  
  let room =this.rooms[roomId];
  
  if (typeof room !== 'undefined') {
    //move skills
    for (let i = room.skillsOnSale.length-1; i >= 0; i -= 1) { 
      if(room.skillsOnSale[i].market){
      
        c = room.skillsOnSale.splice(i, 1, {});
        room.raiseItems.push(...c);
        room.raiseValue=this.cardValue(roomId);
        break;
  
        
      }                             
    }
    //Sort Skills
    room.skillsOnSale=this.bubbleSort(room.skillsOnSale);
    //move items
    var counter =0; 
    for (let i = room.skillsOnSale.length-1; i >= 0; i -= 1) { 
      if(typeof(room.skillsOnSale[i].market) == 'undefined'){
        counter ++;
      }
    }
    
  for (let i = counter-1; i >= 0; i -= 1) { 
   for (let j = room.itemsOnSale.length-1; j >= 0; j -= 1) { 
      if(room.itemsOnSale[j].market){
        
        k = room.itemsOnSale.splice(j, 1, {});
        
        room.skillsOnSale.splice(i,1,...k); 
        break;

                                    
    }
    
  }
}
    //sort items
room.itemsOnSale=this.bubbleSort(room.itemsOnSale);

    //move auction
      for (let i = room.auctionCards.length-1; i >= 0; i -= 1) { 
      if(room.auctionCards[i].market){
      
        c = room.auctionCards.splice(i, 1, {});
        room.raiseItems.push(...c);
        room.raiseValue=this.cardValue(roomId);
        break;
  
        
      }                             
    }
    //sort auctionCards
    room.auctionCards=this.bubbleSort(room.auctionCards);


    //fill pools
  
   room.skillsOnSale=this.fillPool(roomId,"skills",room.skillsOnSale);
   room.itemsOnSale=this.fillPool(roomId,"items",room.itemsOnSale);
   room.auctionCards=this.fillPool(roomId,"auction",room.auctionCards);

   room.auctionCards=this.bubbleSort(room.auctionCards);
   room.itemsOnSale=this.bubbleSort(room.itemsOnSale);
   room.skillsOnSale=this.bubbleSort(room.skillsOnSale);
   

  } else return [];


}

//getCardValue är den som körs när rummet initiseras. Därav if och else satsen. Detta som jag tror kan lösas snyggare. 
//Följ till cardValue.
Data.prototype.getCardValue = function (roomId) {
  
  let room = this.rooms[roomId];

  if(room.raiseValue !==null){
   if (typeof room !== 'undefined') {
      return room.raiseValue;
    } else return [];
}else {
  room.raiseValue=this.cardValue(roomId);
  return room.raiseValue;
}
}
Data.prototype.nameAndColor = function (roomId, playerId, name, color) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].color = color;
    room.players[playerId].name = name;
    for (let i = 0; i < room.playerColor.length; i += 1) {
      if (room.playerColor[i] == color) {
        room.playerColor.splice(i, 1);
      }
    }
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
Data.prototype.auctionBids = function (roomId, playerId, bid, auctionPrice, players) {
  let room = this.rooms[roomId];
  room.players = players;
  console.log("bid::" + bid)
  if (typeof room !== 'undefined') {
    if (auctionPrice == 0){
      room.auctonStarterId = playerId;
    }
    if (bid > auctionPrice){
      auctionPrice = bid;
      room.auctionLeaderId = playerId;
    }
    else{
      var keys = Object.keys(room.players);
      let i = Object.keys(room.players).indexOf(playerId)
      console.log(keys[i+1] +" 3 är lika med " + room.auctionLeaderId);
      if (i === keys.length - 1){
        console.log(keys[0] +" 2 är lika med " + room.auctionLeaderId)
        if(keys[0] == room.auctionLeaderId){
          console.log("varför1")
          room.auctionWinner =true;
          //this.auctionWon(roomId, room.auctionLeaderId, auctionPrice);
          room.players[playerId].turn = false;
          room.players[room.auctonStarterId].turn = true;
          //room.auctionLeaderId = null;
          room.auctonStarterId = null;
          
        }
      } 
      else if (keys[i+1] == room.auctionLeaderId){
        console.log("varför2 + 3")
        console.log("ge mig den")
        room.auctionWinner =true;
        //this.auctionWon(roomId, room.auctionLeaderId, auctionPrice);
        room.players[playerId].turn = false;
        room.players[room.auctonStarterId].turn = true;
        //room.auctionLeaderId = null;
        room.auctonStarterId = null;
      }
   } 
    room.auctionPrice = auctionPrice;
    console.log("PirceA::"+auctionPrice)
    if(room.auctonStarterId !== null){
      console.log("bytspelare")
      this.nextPlayer(roomId, playerId, true)
    }
    
    return room.players
  }
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
    if (room.raiseItems[i].market == "fastaval") {
      fastaval+=1;
     
    } else if (room.raiseItems[i].market == "figures") {
      figures+=1;
    } else if (room.raiseItems[i].market == "music") {
      music+=1;
    } else if (room.raiseItems[i].market == "movie") {
      movie+=1;
    }else if (room.raiseItems[i].market == "technology") {
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
Data.prototype.bubbleSort = function(cardArray=10)
{   
    

    var swapp;
    var n = cardArray.length-1;
    var x=cardArray;
    
    do {
        swapp = false;
        for (var i=n; i > 0; i--)
        {
         
            if (typeof(x[i].market) == 'undefined' && !(typeof(x[i-1].market) == 'undefined') )
            {   
             
               var temp = x[i];
               x[i] = x[i-1];
               x[i-1] = temp;
               swapp = true;
            }else{

              
            }
        }
        
    } while (swapp);
 return x; 
}
Data.prototype.fillPool=function(roomId,name,cardArray){
  let room =this.rooms[roomId];
  let c=null;
  if (typeof room !== 'undefined') {
  var counter =0; 
  for (let i = cardArray.length-1; i >= 0; i -= 1) { 
    if(typeof(cardArray[i].market) != 'undefined'){
      counter ++;
    }
  
//ändra så loopen lägger till i andra irdnbingen tvärtom


    if(name==="skills" && counter<room.playerCount+1){
      for (let index = 0; index < room.playerCount+1-counter; index++) {
        if(room.deck.length>0){
          c= room.deck.pop();
          cardArray.splice(index,1,c);
        }
      }
     
    }

    }if(name==="items" && counter<room.playerCount+1){
      for (let index = 0; index < room.playerCount+1-counter; index++) {
        if(room.deck.length>0){
          c= room.deck.pop();
          cardArray.splice(index,1,c);
        }
      }
     
      
    }
   
    if(name==="auction" && counter<4){
      
      for (let index = 0; index < 4-counter; index++) {
        if(room.deck.length>0){
          
          c= room.deck.pop();
          cardArray.splice(index,1,c);
        }
      }
    }

  }

  return cardArray;
}

//-------------------WORK metoder-----------------------
Data.prototype.workDrawCardTwoCards = function (roomId, playerId) {     //Dra kort genom WORK
  let room = this.rooms[roomId];

  if (typeof room !== 'undefined') {
    for (var i = 0; i < 2; i++) {
      let card = room.deck.pop();
      room.players[playerId].hand.push(card);
    }

    //room.workPlacement[0] = true;
    //console.log(room.workPlacement[0])
    room.players[playerId].bottles--;
    return room.players;
  } else return [];
}
Data.prototype.bottleRecycled = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].bottles--;
    room.players[playerId].money++;
    return room.players;
  } else return [];
}
Data.prototype.bottleRecycled4thRound = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].bottles--;
    room.players[playerId].money += 3;
    return room.players;
  } else return [];
}
Data.prototype.takeFirstPlayerToken = function (roomId, playerId) {
  let room = this.rooms[roomId];
  console.log(playerId, "got scammed :^(");
  room.players[playerId].bottles--;

  room.players[playerId].firstPlayerToken = true;

  return room.players;
}
Data.prototype.drawPassiveIncome = function (roomId, playerId) {
  //drawCard kallas genom Socket detta är bara för inkomstdelen
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let card = room.deck.pop();
    room.players[playerId].income.push(card);

    room.players[playerId].bottles--;
    return room.players;
  } else return [];
}
Data.prototype.getWorkPlacement = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.workPlacement;
  } else return [];
}
Data.prototype.setWorkPlacementTrue = function (roomId, place) {
  console.log("Set workplacement körs!")
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.workPlacement[place] = true;
    console.log("workPlacement:")
    console.log(room.workPlacement);
    console.log("---------------")
    return room.workPlacement;
  } else return [];
}
//------------------------------------------------------

module.exports = Data;