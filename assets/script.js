let cardvalues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K'];
let symbols = ['♦','♠','♥','♣'];
let val = new Array(6), sym = new Array(6) ;
let win = 0, lose = 0, draw = 0, score1 = 0, score2 = 0;
let c1 = 0, c2 = 0, j = 0;
let color;

const CardValueMap = {
	'2' : 2,
	'3' : 3,
	'4' : 4,
	'5' : 5,
	'6' : 6,
	'7' : 7,
	'8' : 8,
	'9' : 9,
	'10' : 10,
	'J' : 11,
	'Q' : 12,
	'K' : 13,
	'A' : 1
}

