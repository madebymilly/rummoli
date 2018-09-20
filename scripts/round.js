var Round = function(numberOfPlayers) {

	// LOGICAL CLASS om de logica op te zetten voor een hele ronde
	// handen delen - chips in pot betalen - checken of einde rond is
	this.roundNumber = 0;

};

Round.prototype.dealHands = function(players, deck) {

	//console.log('dealhands');
	//console.log(deck.cards);
	// aantal kaarten per persoon + widow (afronden naar beneden)
	var x = Math.floor(deck.cards.length / players.length);
	// tot het deck leeg is, deel de kaarten op
	for (c = 0; c < x; c++) {
		for (i = 0; i < players.length; i++) {
			players[i].hand.push(deck.dealCard());
			//console.log(players[i].hand);
		}
	}

};

Round.prototype.payChipsToPots = function(players, board) {
	// elke speler -9 (behalve de widow)
	for (p in players) {
		if (players[p].widow == false) {
			players[p].stackSize -= 9;
		}
	}
	// elke pot +1 * aantal spelers
	for (pot in board.pots) {
		board.pots[pot].stack += (1 * (players.length -1));
	}
};

Round.prototype.askForWidowHand = function(players, presentor) {

	var dealer = players.filter(function(obj) {
		return (obj.dealer);
	});

	var widow = players.filter(function(obj) {
		return (obj.widow);
	});

	var msg = {};

	var widowHand = presentor.drawWidowHand(widow[0]);

	msg.text = dealer[0].name + ", would you like to swap your hand with this WidowHand?";
	msg.confirm = "Yes";
	msg.cancel = "No thanks";
	msg.widowHand = widowHand;

	presentor.drawMessage(msg);


}
