var Rummoli = function(numberOfPlayers, name) {

	// LOGICAL CLASS voor alle spellogica
	// spel opstarten en eerste ronde spelen
	// dit is de scheidsrechter die bepaalt of een gespeelde kaart speelbaar is

	this.numberOfPlayers = numberOfPlayers;
	this.deck = new Deck();
	this.round = new Round();
	this.board = new Board();
	this.presentor = new Presentor(this);
	this.discardPile = [];

	// players:
	this.players = [];
	for(var i = 0; i < numberOfPlayers; i++){
		this.players.push(new Player(i, "Robot " + i, true, this));
	}
	this.players[0].name = name;
	this.players[0].robot = false;
	this.players[0].dealer = true;

	// make widow:
	this.widow = new Player(numberOfPlayers, "widow", true);
	this.widow.widow = true; this.widow.stackSize = 0;
	
	// add to players array:
	this.players.push(this.widow);

	// START FIRST ROUND:
	this.startNewRound();

};

Rummoli.prototype.playCard = function(player,cardIndex) {

	var success = false;
	var card = player.hand[cardIndex];
	var cards = this.findPlayableCard();

	console.log(card);

	// Check if card is playable
	if (cards && cards.indexOf(card) >= 0) {
		
		// remove option to change widowHand
		if (this.discardPile.length == 0) {
			this.presentor.emptyMessage();
		}

		// place this card to aflegstapel
		this.discardPile.unshift(new DiscardPileCard(card, player));

		// remove this card from hand
		player.hand.splice(cardIndex, 1);
		
		// check if card wins pot
		this.checkIfPotWon(card, player);

		// check for end of round
		var winner = this.checkForRoundEnd();

		if (winner) {
			console.log("THE END! The winner is: " + winner.name);
			this.endRound(winner);
		}

		this.presentor.draw();

		success = true;

	}
	console.log(success);

	// cards array weer leegmaken, geen enkele kaart is nu meer speelbaar
	cards = [];

	return {
		success : success,
		cardPlayed : card,
		playerWhoPlayed : player,
	};
};
Rummoli.prototype.findPlayableCard = function() {

	this.cards = [];
	var player = "";

	// first turn - find lowest card(s) in dealers hand
	if (this.discardPile.length == 0) { // if discardPile.length is 0

		for (p in this.players) {
			if (this.players[p].dealer) { player = this.players[p]; }
		}

		this.cards = this.findLowestOppossiteColorCard(player);
		if (this.cards) { return this.cards; }

	} else { // follow up turn

		var prevCard = this.discardPile[0].card;
		var prevPlayer = this.discardPile[0].player;
		var prevPlayerIndex = this.players.indexOf(prevPlayer);

		// === find next following card
		for (p in this.players) {
			if (!this.players[p].widow) {
				for (c in this.players[p].hand) {
					if (this.players[p].hand[c].suit == prevCard.suit && this.players[p].hand[c].rank == (prevCard.rank + 1)) {
						this.cards.push(this.players[p].hand[c]);
						return this.cards;
					}
				}
			}
		}


		// === set player order
		// == find lowest opposite color card, starting with first players
		var lowestCards = [];

		this.forEachPlayerInOrder(function(player, game) {
			var lowestOppossiteColorCards = game.findLowestOppossiteColorCard(player);

			if (lowestOppossiteColorCards.length > 0) {
					lowestCards.push(lowestOppossiteColorCards);
			}
		});

		for (c in lowestCards[0]) {
			this.cards.push(lowestCards[0][c]);
		}

		if (this.cards.length > 0) {
			return this.cards;
		} else {

			this.cards = this.findLowestOppossiteColorCard(prevPlayer, true);
			return this.cards;

		}
	}
};
Rummoli.prototype.findLowestOppossiteColorCard = function(player, noOppossiteColor) {

	var cards = [];
	var prevColour = "";
	if (this.discardPile.length > 0 && !noOppossiteColor) {
		var prevCard = this.discardPile[0].card;
		if (prevCard) {	prevColour = prevCard.colour; }
	}
	
	// make array with opposite color cards
	var oppositeCards = [];
	for (c in player.hand) {
		if (player.hand[c].colour != prevColour) {
			oppositeCards.push(player.hand[c]);
		}
	}

	// make array with only ranks
	var ranksInHand = [];
	for (c in oppositeCards) {
		ranksInHand.push(oppositeCards[c].rank);
	}

	var lowestRank = Math.min.apply(Math, ranksInHand);

	for (c in oppositeCards) {
		if (oppositeCards[c].rank == lowestRank) {
			cards.push(oppositeCards[c]);
		}
	}
	return cards;
};
Rummoli.prototype.setPlayerOrder = function() {

	var playersTurn = "";
	return this.players;
};
Rummoli.prototype.forEachPlayerInOrder = function(callback) {

	var playerOrderArray = [];
	if(this.discardPile.length == 0) {
		return;
	}
	var currentPlayer = this.discardPile[0].player.index;

	// widow er buiten laten, dus werken met number of players

	// Create a map to loop the players in order..
	for(var i = 0; i < this.numberOfPlayers; i++) {
		if(currentPlayer >= this.numberOfPlayers) {
			currentPlayer = 0;
		}
		playerOrderArray.push(currentPlayer);
		currentPlayer++;
	}

	// Loop the players in order of map..
	for(key in playerOrderArray){
		callback(this.players[playerOrderArray[key]], this);
	}
};
Rummoli.prototype.checkForRoundEnd = function() {

	// loop trough all players to check if they still all have cards
	for (p in this.players) {
		if (this.players[p].hand.length < 1) {
			return this.players[p];
		}
	}
};
Rummoli.prototype.checkIfPotWon = function(card, playingPlayer) {

	// voor elke pot
	for (pot in this.board.pots) {

		// voor elke combi in elke pot
		for (combi in this.board.pots[pot].cardCombination) {

			for (var i = 0; i < this.board.pots[pot].cardCombination[combi].length; i++) {

				var potWins = true;

				if (this.discardPile[i]) { // als er genoeg in de discardpile zit

					if ( !this.discardPile[i].card.isEqual(this.board.pots[pot].cardCombination[combi][i])) {

						potWins = false;

					} else {

						// if combination is 2 cards:
						if ( this.board.pots[pot].cardCombination[combi].length == 2 ) {
								if ( playingPlayer !== this.discardPile[1].player ) {
									potWins = false;
									return;
								}
						}

						// if combination is 3 cards:
						if ( this.board.pots[pot].cardCombination[combi].length == 3 ) {
								if ( playingPlayer !== this.discardPile[1].player || playingPlayer !== this.discardPile[2].player ) {
									potWins = false;
									return;
								}
						}

						// set potsize 0
						var stackWon = this.board.pots[pot].stack;
						this.board.pots[pot].stack = 0;

						// give player potsize
						playingPlayer.stackSize += stackWon;

						//console.log(potWins);
					}
				} else {
					potWins = false;
					return;
				}
			}
		}
	}
};
Rummoli.prototype.endRound = function(winner) {
	
	var totalOfChipsWon = 0;
	
	// === rummoli pot goes to winner
	for (pot in this.board.pots) {
		if (this.board.pots[pot].name == "rummoliPot") {
			totalOfChipsWon += this.board.pots[pot].stack;
			this.board.pots[pot].stack = 0;
		}
	}

	// === losers pay winner
	for (p in this.players) {
		if (this.players[p].name != winner.name && this.players[p].widow == false) {

			// count cards in hand
			var numOfCards = this.players[p].hand.length;
			// pay chips according to number of cards
			totalOfChipsWon += numOfCards;
			this.players[p].stackSize -= numOfCards;
		}
	}
	
	//alert('The winner is...' + winner.name);
	
	winner.stackSize += totalOfChipsWon;

	// === empty all hands - including widow & aflegstapel
	this.discardPile = [];
	
	// For loop:
	for (p in this.players) {
		this.players[p].hand = [];
	}

	// ForEach:
	// function emptyHands(value, index, array) {
	// 	value.hand = [];
	// }
	// this.players.forEach(emptyHands);


	// === move dealer button
	var dealer = "";
	
	for (p in this.players) {
		if (this.players[p].dealer) {
			this.players[p].dealer = false;
			dealer = this.players[p];
		}
	}
	
	var index = this.players.indexOf(dealer) + 1;
	var nextDealer = this.players[index];
	if (nextDealer == undefined || nextDealer.widow) {
		nextDealer = this.players[0];
	}
	nextDealer.dealer = true;

	// === start new round
	this.discardPile = [];
	
	this.deck = new Deck();

	this.startNewRound();

	this.presentor.draw();
};
Rummoli.prototype.startNewRound = function() {

	// === number of rounds + 1
	this.round.roundNumber += 1;

	// === alle spelers betalen 1 chip uit hun stack in elke pot (9)
	this.round.payChipsToPots(this.players, this.board);

	// === deel de players een hand:
	this.round.dealHands(this.players, this.deck);

	// === draw everything
	this.presentor.draw();

	// === give option to dealer to take widowhand
	this.round.askForWidowHand(this.players, this.presentor);


};
Rummoli.prototype.swapWidowHand = function(feedback) {

	var dealer = this.players.filter(function(obj) {
		return (obj.dealer);
	});

	var widow = this.players.filter(function(obj) {
		return (obj.widow);
	});

	var	dealerName = dealer[0].name,
			dealerHand = dealer[0].hand,
			widowHand = widow[0].hand;

	if (feedback == 'confirm') {
		var swap = function(x) { return x };

		var temp = dealer[0].hand;
		dealer[0].hand = widow[0].hand;
		widow[0].hand = temp;

		// === draw everything
		this.presentor.draw();

		// remove messages
		this.presentor.emptyMessage();

	} else if (feedback == 'cancel') {
		// remove messages
		this.presentor.emptyMessage();
	}
}
