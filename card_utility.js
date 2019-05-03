//initialize the exports
exports = module.exports = {};

//DOCS: this bot is assumed to run on only a single server.
//DOCS: game data looks like this:
//	players = {
//		"username": {
//			"deck": ["card-name", ...],
//			"hand": ["card-name", ...],
//			"discard": ["card-name", ...]
//		},
//		...
//	}

//game data
let players = {};
let piles = [[], [], []];

//dump the state
exports.debug = function() {
	console.log(players);
	console.log(piles);
}

//reset this player's state
exports.reset = function(user) {
	delete players[user];
}

//add a card to the user's deck
exports.add = function(user, cardname) {
	verifyPlayer(user);

	//card is real
	if (!verifyCard(cardname)) {
		return false;
	}

	if (players[user].deck.indexOf(cardname) != -1 || players[user].hand.indexOf(cardname) != -1 || players[user].discard.indexOf(cardname) != -1) {
		return false;
	}

	players[user].deck.push(cardname);

	return true;
}

//shuffle the discard and decks together
exports.shuffle = function(user) {
	verifyPlayer(user);

	//move from the discard to the deck
	players[user].deck = players[user].deck.concat( players[user].discard );
	players[user].discard = [];

	//shuffle
	let newDeck = [];

	while(players[user].deck.length > 0) {
		newDeck.push( players[user].deck.splice(Math.floor(Math.random() * players[user].deck.length), 1)[0])
	}

	players[user].deck = newDeck;
}

//move X cards from deck to hand
exports.draw = function(user, cardCount) {
	verifyPlayer(user);

	cardCount = parseInt(cardCount);

	if (isNaN(cardCount)) {
		return 0;
	}

	cardCount = cardCount > players[user].deck.length ? players[user].deck.length : cardCount;

	players[user].hand = players[user].hand.concat( players[user].deck.splice(0, cardCount) );

	return cardCount;
}

exports.send = function(user, cardname, destination) {
	verifyPlayer(user);

	if (!verifyCard(cardname)) {
		return false;
	}

	//not in hand
	if (players[user].hand.indexOf(cardname) == -1) {
		return false;
	}

	//discard a card
	if (destination === "discard") {
		players[user].discard.push( players[user].hand.splice(players[user].hand.indexOf(cardname), 1)[0] );
		return true;
	}

	//verify sending to a pile
	destination = parseInt(destination);
	if (isNaN(destination)) {
		return false;
	}

	if (destination < 1 || destination > 3) {
		return false;
	}

	//place in a discard pile
	piles[destination-1].push( players[user].hand.splice(players[user].hand.indexOf(cardname), 1)[0] );

	//finally
	return true;
}

exports.read = function(user, destination) {
	verifyPlayer(user);

	if (destination === "hand") {
		return players[user].hand.toString();
	}

	if (destination === "discard") {
		return players[user].discard.toString();
	}

	destination = parseInt(destination);
	if (isNaN(destination)) {
		return false;
	}

	if (destination < 1 || destination > 3) {
		return false;
	}

	return piles[destination-1].toString();
}

exports.clear = function(destination) {
	destination = parseInt(destination);
	if (isNaN(destination)) {
		return false;
	}

	if (destination < 1 || destination > 3) {
		return false;
	}

	delete piles[destination-1];
	piles[destination-1] = [];

	return true;
}

//-------------------------

let cardnames = [
	"ace-spades",
	"2-spades",
	"3-spades",
	"4-spades",
	"5-spades",
	"6-spades",
	"7-spades",
	"8-spades",
	"9-spades",
	"10-spades",
	"jack-spades",
	"queen-spades",
	"king-spades",
	"ace-clubs",
	"2-clubs",
	"3-clubs",
	"4-clubs",
	"5-clubs",
	"6-clubs",
	"7-clubs",
	"8-clubs",
	"9-clubs",
	"10-clubs",
	"jack-clubs",
	"queen-clubs",
	"king-clubs",
	"ace-diamonds",
	"2-diamonds",
	"3-diamonds",
	"4-diamonds",
	"5-diamonds",
	"6-diamonds",
	"7-diamonds",
	"8-diamonds",
	"9-diamonds",
	"10-diamonds",
	"jack-diamonds",
	"queen-diamonds",
	"king-diamonds",
	"ace-hearts",
	"2-hearts",
	"3-hearts",
	"4-hearts",
	"5-hearts",
	"6-hearts",
	"7-hearts",
	"8-hearts",
	"9-hearts",
	"10-hearts",
	"jack-hearts",
	"queen-hearts",
	"king-hearts"
];

let verifyCard = function(cardname) {
	return cardnames.indexOf(cardname) != -1;
}

let verifyPlayer = function(username) {
	if (players[username] === undefined) {
		players[username] = {};
	}

	if (players[username]["hand"] === undefined) {
		players[username]["hand"] = [];
	}

	if (players[username]["deck"] === undefined) {
		players[username]["deck"] = [];
	}

	if (players[username]["discard"] === undefined) {
		players[username]["discard"] = [];
	}
}