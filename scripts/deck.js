var Deck = function() {

	// LOGICAL CLASS voor het aanmaken van het deck en het delen van 1 kaart
	var suits = ["c","d","h","s"];
	var ranks = [2,3,4,5,6,7,8,9,10,11,12,13,14];

	this.cards = [];

	// make 4 x 13 cards
	for (var i=0; i<suits.length; i++) {
		for (var j=0; j<ranks.length; j++) {

			var card = new Card(ranks[j], suits[i]);
			this.cards.push(card);
		}
	}

	// shuffle cards
	this.cards.sort(function() {
		return 0.5 - Math.random();
	});

	// deal card
	this.dealCard = function() {
		return this.cards.pop();
	};
};
