//initialize the exports
exports = module.exports = {};

//DOCS: this bot is assumed to run on only a single server.
//DOCS: game data looks like this:
//	players = {
//		"username": {
//			"deck": ["card-name", ...],
//			"hand": ["card-name", ...],
//			"discard": ["card-name", ...],
//			"minor": ["card-name", ...],
//			"major": ["card-name", ...],
//			"removed": ["card-name", ...]
//		},
//		...
//	}

//game data
let players = {};

//dump the state
exports.debug = function() {
	console.log(players);
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

	//card is not already owned
	if (
		players[user].deck.indexOf(cardname) != -1 ||
		players[user].hand.indexOf(cardname) != -1 ||
		players[user].discard.indexOf(cardname) != -1 ||
		players[user].minor.indexOf(cardname) != -1 ||
		players[user].major.indexOf(cardname) != -1 ||
		players[user].removed.indexOf(cardname) != -1
	) {
		return false;
	}

	//add to the deck
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
		newDeck.push( players[user].deck.splice(Math.floor(Math.random() * players[user].deck.length), 1)[0]);
	}

	players[user].deck = newDeck;
}

//move X cards from deck to hand
exports.draw = function(user, cardCount) {
	verifyPlayer(user);

	//check is a number
	cardCount = parseInt(cardCount);

	if (isNaN(cardCount)) {
		return 0;
	}

	//can only draw this much
	cardCount = cardCount > players[user].deck.length ? players[user].deck.length : cardCount;

	//draw
	players[user].hand = players[user].hand.concat( players[user].deck.splice(0, cardCount) );

	//return the amount drawn
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

	//minor a card
	if (destination === "minor") {
		players[user].minor.push( players[user].hand.splice(players[user].hand.indexOf(cardname), 1)[0] );
		return true;
	}

	//major a card
	if (destination === "major") {
		players[user].major.push( players[user].hand.splice(players[user].hand.indexOf(cardname), 1)[0] );
		return true;
	}

	//removed a card
	if (destination === "removed") {
		players[user].removed.push( players[user].hand.splice(players[user].hand.indexOf(cardname), 1)[0] );
		return true;
	}

	//otherwise
	return false;
}

exports.read = function(user, destination) {
	verifyPlayer(user);

	if (destination === "hand") {
		return players[user].hand.toString();
	}

	if (destination === "discard") {
		return players[user].discard.toString();
	}

	if (destination === "minor") {
		return players[user].minor.toString();
	}

	if (destination === "major") {
		return players[user].major.toString();
	}

	if (destination === "removed") {
		return players[user].removed.toString();
	}

	return false;
}

exports.clear = function(user, destination) {
	verifyPlayer(user);

	if (destination === "deck") {
		delete players[user].deck;
		players[user].deck = [];
		return true;
	}

	if (destination === "hand") {
		delete players[user].hand;
		players[user].hand = [];
		return true;
	}

	if (destination === "discard") {
		delete players[user].discard;
		players[user].discard = [];
		return true;
	}

	if (destination === "minor") {
		delete players[user].minor;
		players[user].minor = [];
		return true;
	}

	if (destination === "major") {
		delete players[user].major;
		players[user].major = [];
		return true;
	}

	if (destination === "removed") {
		delete players[user].removed;
		players[user].removed = [];
		return true;
	}

	//otherwise
	return false;
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

	if (players[username]["minor"] === undefined) {
		players[username]["minor"] = [];
	}

	if (players[username]["major"] === undefined) {
		players[username]["major"] = [];
	}

	if (players[username]["removed"] === undefined) {
		players[username]["removed"] = [];
	}
}