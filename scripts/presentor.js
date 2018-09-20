// Constructor Function:
var Presentor = function(game) {

	var self = this;
	this.game = game;

	// == Private vars
	var playerList = document.getElementById("players");
	var discardList = document.getElementById("aflegstapel");
	var board = document.getElementById('board');

	// == Public function
	this.draw = function() {

		// playerlist
		playerList.innerHTML = "";
		for (p in game.players) {
				drawPlayer(game.players[p]);
		}

		// Discard pile
		discardList.innerHTML = "";
		drawDiscardPile();

		// Board
		board.innerHTML = "";
		drawBoard();

		// Hide start window
		//startForm.innerHTML = "";
	};

	this.drawMessage = function(msg) {
		var messageDiv = document.getElementById("messages");
				messageDiv.innerHTML = msg.text;

		// toevoegen: if confirm OF cancel zijn bekend:
		btnConfirm = document.createElement("button"),
		btnCancel  = document.createElement("button");

		btnConfirm.className = 'confirm';
		btnConfirm.innerHTML = msg.confirm;

		btnCancel.className = 'cancel';
		btnCancel.innerHTML = msg.cancel;

		messageDiv.addEventListener("click", function(e) {
			e.preventDefault;

			var target = e.target,
				feedback = e.target.className;
			game.swapWidowHand(feedback);
		}, false);

		messageDiv.appendChild(btnConfirm);
		messageDiv.appendChild(btnCancel);
		messageDiv.appendChild(msg.widowHand);
	}

	this.emptyMessage = function() {
		var messageDiv = document.getElementById("messages");
		messageDiv.innerHTML = "";
	}


	this.drawWidowHand = function(widow) {

		var handDiv = document.createElement("DIV");
		handDiv.className = 'widowHand';

		for (c in widow.hand) {

			var	span = document.createElement("SPAN");

			span.className = widow.hand[c].suit + widow.hand[c].rank;
			span.setAttribute("data-card-value", widow.hand[c].rank + "" + widow.hand[c].suit);
			span.innerHTML = widow.hand[c].rank + "" + widow.hand[c].suit;
			handDiv.appendChild(span);
		}

		return handDiv;

	}

	// == Private helper functions:
	function drawPlayer(player) {
		var div = document.createElement("div");
		div.id = 'player' + player.index;
		div.innerHTML = "<h3>" + player.name + "</h3><h4>" + player.stackSize + "</h4>";
		playerList.appendChild(div);

		// add hand to player div
		var div = document.createElement("div");
		var playerDiv = document.getElementById("player" + player.index);
		div.id = 'hand' + player.index;

		// add dealer button if player is dealer
		if (player.dealer) {
			var dealer = document.createElement("span");
			dealer.className = 'dealer';
			dealer.innerHTML = 'D';
			playerDiv.appendChild(dealer);
		}
		playerDiv.appendChild(div);
		drawHand(player);
	}

	function drawHand(player) {

		var i = 0;

		for (c in player.hand) {
			var handDiv = document.getElementById("hand" + player.index),
				link = document.createElement("A");

			link.className = player.hand[c].suit + player.hand[c].rank;
			link.setAttribute("data-card-value", player.hand[c].rank + "" + player.hand[c].suit);
			link.innerHTML = player.hand[c].rank + "" + player.hand[c].suit;
			handDiv.appendChild(link);

			//Closure (anders i altijd 10)
			(function (x) {

				link.addEventListener("click", function(e) {
					console.log(x);
					var target = e.target,
						cardValue = target.getAttribute('data-card-value');

					if (cardValue) {
						e.preventDefault();
						game.playCard(player, x);
					}
				}, false);
			}(i));

			i++;

		}
	}

	// function declaration
	function drawDiscardPile() {
		for (c in game.discardPile) {
			var li = document.createElement("li");
			li.innerHTML = game.discardPile[c].card.rank + "" + game.discardPile[c].card.suit + " (" + game.discardPile[c].player.name + ")";
			discardList.appendChild(li);
		}
	}

	function drawBoard() {
		// show all pots
		for (pot in game.board.pots) {
			var div = document.createElement('div');
			div.className = 'pot';
			div.id = game.board.pots[pot].name;
			div.innerHTML = game.board.pots[pot].stack;
			board.appendChild(div);
		}

		// show round number
		var roundNumberDiv = document.createElement('div');
		roundNumberDiv.id = "round-number";
		roundNumberDiv.innerHTML = "Round: " + game.round.roundNumber;
		board.appendChild(roundNumberDiv);
	}

}
