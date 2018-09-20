var Card = function(rank, suit) {

	this.rank = rank;
	this.suit = suit;
	this.colour = (this.suit == "h" || this.suit == "d") ? "red" : "black";

};

Card.prototype.getFullCard = function(card) {
	return (this.rank + " of " + this.suit);
}

Card.prototype.isEqual = function(card) {
	return (this.rank == card.rank && this.suit == card.suit);
}
