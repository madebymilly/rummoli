var Board = function() {
	// CONTAINER CLASS voor alle potten op het bord.
	this.pots = [];
	this.pots.push(new Pot("pot10",      [[new Card(10,"s")]], 0));
	this.pots.push(new Pot("potJ",       [[new Card(11,"d")]], 0));
	this.pots.push(new Pot("potQ",       [[new Card(12,"c")]], 0));
	this.pots.push(new Pot("potK",       [[new Card(13,"h")]], 0));
	this.pots.push(new Pot("potA",       [[new Card(14,"s")]], 0));
	this.pots.push(new Pot("potAK",      [[new Card(14,"d"), new Card(13,"d")]], 0));
	this.pots.push(new Pot("pot789",     [
											[new Card(9, "d"), new Card(8, "d"), new Card(7,"d")],
											[new Card(9, "c"), new Card(8, "c"), new Card(7,"c")],
											[new Card(9, "s"), new Card(8, "s"), new Card(7,"s")],
											[new Card(9, "h"), new Card(8, "h"), new Card(7,"h")]
										], 0));
	this.pots.push(new Pot("pokerPot",   false, 0));
	this.pots.push(new Pot("rummoliPot", false, 0));

};
