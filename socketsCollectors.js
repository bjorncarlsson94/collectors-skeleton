function sockets(io, socket, data) {
  socket.on("setupCollectors", function (d) {
    data.createRoom(d.roomId, d.playerCount, d.lang);
  });
  socket.on("collectorsLoaded", function (d) {
    socket.join(d.roomId);
    if (data.joinGame(d.roomId, d.playerId)) {
      //denna som körs från collectors.vue när spelet startas.
      socket.emit("collectorsInitialize", {
        labels: data.getUILabels(d.roomId),
        players: data.getPlayers(d.roomId),
        itemsOnSale: data.getItemsOnSale(d.roomId),
        marketValues: data.getMarketValues(d.roomId),
        raiseItems:data.getRaiseItems(d.roomId),
        playerColor:data.getPlayerColor(d.roomId),
        //här kallar vi på getCardValue
        raiseValue: data.getCardValue(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        cardInAuction: data.getCardInAuction(d.roomID),
        placements: data.getPlacements(d.roomId),
        workPlacement: data.getWorkPlacement(d.roomId)
      });
    }
  });
  socket.on("collectorsDrawCard", function (d) {
    io.to(d.roomId).emit(
      "collectorsCardDrawn",
      data.drawCard(d.roomId, d.playerId)
    );
    console.log("drew card");
  });
  socket.on("collectorsGetDeckLength", function (d) {
    io.to(d.roomId).emit(
      "collectorsGotDeckLength",
      data.getDeckLength(d.roomId)
    );
  });
  socket.on("collectorsBuyCard", function (d) {
    data.buyCard(d.roomId, d.playerId, d.card, d.cost);
    
    io.to(d.roomId).emit("collectorsCardBought", {
      playerId: d.playerId,
      players: data.getPlayers(d.roomId),
      itemsOnSale: data.getItemsOnSale(d.roomId),
      itemValues: data.getItemValue(d.roomId, d.playerId)
    });
  });
 
  
  socket.on("collectorsBuySkill", function (d) {
    data.buySkill(d.roomId, d.playerId, d.card, d.cost);
    io.to(d.roomId).emit("collectorsSkillBought", {
      playerId: d.playerId,
      players: data.getPlayers(d.roomId),
      skillsOnSale: data.getSkillsOnSale(d.roomId),
    });
  });

  socket.on("collectorsRaiseValue", function (d) {
    data.raiseValue(d.roomId, d.playerId, d.card, d.cost);
    io.to(d.roomId).emit("collectorsValueRaised", {
      playerId: d.playerId,
      players: data.getPlayers(d.roomId),
      raiseItems: data.getRaiseItems(d.roomId),
      raiseValue: data.getCardValue(d.roomId),
    });
  });

  socket.on("collectorsStartAuction", function (d) {
    data.startAuction(d.roomId, d.playerId, d.card, d.cost, d.hiddenAuctionCard);
    io.to(d.roomId).emit("collectorsAuctionStarted", {
      playerId: d.playerId,
      hiddenAuctionCard: data.gethiddenAuctionCard(d.roomId),
      players: data.getPlayers(d.roomId),
      auctionCards: data.getAuctionCards(d.roomId),
      cardInAuction: data.getCardInAuction(d.roomId),
    });
  });

  socket.on("collectorsPlaceBottle", function (d) {
    data.placeBottle(d.roomId, d.playerId, d.action, d.cost);
    io.to(d.roomId).emit(
      "collectorsBottle",
      data.getPlacements(d.roomId)
    );
  });
  socket.on("collectorsRemoveBottle", function (d) {
    data.removeBottle(d.roomId, d.playerId, d.action, d.cost);
    io.to(d.roomId).emit(
      "collectorsBottle",
      data.getPlacements(d.roomId)
    );
  });
  socket.on("startTurn", function (d) {
    data.startTurn(d.roomId);
    io.to(d.roomId).emit("playerPicked", 
    data.getPlacements(d.roomId)
    );
  });

  socket.on("nextPlayer", function (d) {
    data.nextPlayer(d.roomId, d.playerId, d.auctionActive);
    io.to(d.roomId).emit("playerPicked", 
      data.getPlacements(d.roomId)
    );
    io.to(d.roomId).emit("cardsMoved", {
      players: data.getPlayers(d.roomId),
      round: data.getRound(d.roomId),
      raiseItems: data.getRaiseItems(d.roomId),
      raiseValue: data.getCardValue(d.roomId),
      skillsOnSale: data.getSkillsOnSale(d.roomId),
      itemsOnSale: data.getItemsOnSale(d.roomId),
      auctionCards: data.getAuctionCards(d.roomId),
    });
  });
  socket.on("moveCards", function (d) {
    data.moveCards(d.roomId);
    io.to(d.roomId).emit("cardsMoved", {
      players: data.getPlayers(d.roomId),
      round: data.getRound(d.roomId),
      raiseItems: data.getRaiseItems(d.roomId),
      raiseValue: data.getCardValue(d.roomId),
      skillsOnSale: data.getSkillsOnSale(d.roomId),
      itemsOnSale: data.getItemsOnSale(d.roomId),
      auctionCards: data.getAuctionCards(d.roomId),
    });
  });

  socket.on("auctionBid", function (d) {
    data.auctionBids(d.roomId, d.playerId, d.bid, d.auctionPrice, d.players);
    console.log("socket bid " + d.bid);
    io.to(d.roomId).emit("auctionRound", {
      players: data.getPlayers(d.roomId),
      auctionPrice: data.getAuctionPrice(d.roomId),
      auctionLeaderId: data.getAuctionLeaderId(d.roomId),
      cardInAuction: data.getCardInAuction(d.roomId),
      auctionWinner: data.getAuctionWinner(d.roomId),
    });
    console.log(data.getCardInAuction(d.roomId));
  });

  socket.on("auctionOver", function (d) {
    data.auctionWon(d.roomId, d.playerId, d.placementType, d.auctionPrice);
    io.to(d.roomId).emit("auctionFin", {
      players: data.getPlayers(d.roomId),
      auctionPrice: data.getAuctionPrice(d.roomId),
      cardInAuction: data.getCardInAuction(d.roomId),
      raiseItems: data.getRaiseItems(d.roomId),
      raiseValue: data.getCardValue(d.roomId),
    });
    console.log(data.getCardInAuction(d.roomId));
  });

  socket.on("restoreHand", function (d) {
    data.restoreHands(d.roomId, d.playerId, d.biddingCards);
    io.to(d.roomId).emit("handRestord", {
      players: data.getPlayers(d.roomId),
    });
  });

socket.on('nameAndColor', function (d) {
  data.nameAndColor(d.roomId, d.playerId, d.name, d.color);
  io.to(d.roomId).emit('nameAndColorSeleced', {
    players: data.getPlayers(d.roomId),
    playerColor:data.getPlayerColor(d.roomId),
  });
});
  //------------------WORK metoder----------------------
  socket.on("collectorsWorkDrawTwoCards", function (d) {
    //funktion för att dra 2 kort genom WORK
    io.to(d.roomId).emit(
      "collectorsWorkCardDrawn", 
      data.workDrawCardTwoCards(d.roomId, d.playerId)
    );
  });
  socket.on("collectorsBottleRecycle", function (d) {
    console.log("socket körs");
    io.to(d.roomId).emit(
      "collectorsBottleRecycled",
      data.bottleRecycled(d.roomId, d.playerId)
    );
  });
  socket.on("collectorsBottleRecycle4thRound", function (d) {
    console.log("socket körs");
    io.to(d.roomId).emit(
      "collectorsBottleRecycled4thRound",
      data.bottleRecycled4thRound(d.roomId, d.playerId)
    );
  });
  socket.on("collectorsDrawACardAndToken", function (d) {
    console.log("Draw card and a token socket körs");
    io.to(d.roomId).emit(
      "collectorsCardAndTokenDrawn",
      data.drawCard(d.roomId, d.playerId),
      data.takeFirstPlayerToken(d.roomId, d.playerId)
    );
  });
  socket.on("collectorsDrawACardAndPassiveIncome", function (d) {
    console.log("Draw card and draw a passive income");
    io.to(d.roomId).emit(
      "collectorsCardAndPassiveIncomeDrawn",
      data.drawCard(d.roomId, d.playerId),
      data.drawPassiveIncome(d.roomId, d.playerId)
    );
  });
  socket.on("placeWorker", function (d) {
    io.to(d.roomId).emit(
      "workerPlaced",
      data.setWorkPlacementTrue(d.roomId, d.where)
    );
  });
  socket.on("currentValue", function (d) {
    io.to(d.roomId).emit(
      "currentScores",
      data.currentValue(d.roomId, d.playerId,d.currentValue)
      
    );
  });
  //---------------------------------------------------
  
  
}

module.exports = sockets;
