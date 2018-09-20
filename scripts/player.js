var Player = function(i, name, robot, game) {

	// CONTAINER CLASS voor een speler
	this.index = i;
	this.name = name;
	this.widow = false;
	this.robot = robot;
	this.stackSize = 100;
	this.dealer = false;
	this.hand = [];
};
