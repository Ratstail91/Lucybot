//initialize the exports
exports = module.exports = {};

//game data
let players = {};
let deck = [];
let discard = [];

//reshuffleDeck
exports.reshuffleDeck = function() {
	//(re)initialize the game
	players = {}
	deck = [
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
	discard = [];

	exports.shuffleDeck();
}

//shuffleDeck
exports.shuffleDeck = function() {
	let newDeck = [];

	while(deck.length > 0) {
		newDeck.push( deck.splice(Math.floor(Math.random() * deck.length), 1)[0])
	}

	deck = newDeck;
}

//drawFromDeck
//username - username of the player
//count - number of cards to draw
exports.drawFromDeck = function(username, count) {
	//count to a number
	count = parseInt(count, 10);

	//create the player if it doesn't exist
	if (players[username] === undefined) {
		players[username] = [];
	}

	//draw the cards
	let drawnCards = deck.splice(0, count);
	let ret = drawnCards.toString();

	//move the aces to the user's hand
	drawnCards = drawnCards.map(async (card) => {
		if (card[0] === "a") {
			players[username].push(card);
			return;
		}

		return card;
	});

	//discard the remaining drawn cards
	discard = discard.concat(drawnCards);

	return ret;
}

//showHand
//username - username of the player
exports.showHand = function(username) {
	let ret = players[username];

	if (ret === undefined || ret === null || ret.length === 0) {
		return "empty";
	}

	return ret.toString();
}

//playCard
//username - username of the player
//cardname - selected card
exports.playCard = function(username, cardname) {
	let ret = false;

	players[username] = players[username].map(async (card) => {
		if (card == cardname) {
			deck.push(card);
			exports.shuffleDeck();
			ret = true;
			return;
		}

		return card;
	});

	return ret;
}

exports.debug = function() {
	console.log(deck);
}

