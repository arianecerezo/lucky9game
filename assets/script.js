const startButton = document.getElementById('start-btn');
const resultText = document.getElementById('result');

let player1Cards = [];
let player2Cards = [];
let player1Turn = true; // Keep track of whose turn it is (true for Player 1)
let gameInProgress = false; // To check if the game is in progress
let totalCardsPlayer1 = 0;
let totalCardsPlayer2 = 0;


// Define the card values and suits
const cardValues = {
    2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 1
};

const suits = ['♠', '♥', '♦', '♣']; // Spades, Hearts, Diamonds, Clubs

// Create a deck with suits
const deck = [];

for (const suit of suits) {
    for (let value = 2; value <= 10; value++) {
        deck.push({ value, suit });
    }
    deck.push({ value: 'J', suit });
    deck.push({ value: 'Q', suit });
    deck.push({ value: 'K', suit });
    deck.push({ value: 'A', suit });
}

let shuffledDeck = shuffleDeck([...deck]);

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Calculate the total value of a hand (using only the last digit)
function calculateTotal(hand) {
    const sum = hand.reduce((total, card) => total + cardValues[card.value], 0);
    return sum % 10; // Only use the last digit
}

// Display the cards and total for each player
function displayPlayerCards(player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;
    const playerTotal = player === 1 ? document.getElementById('player1-total') : document.getElementById('player2-total');
    const playerCardsDiv = player === 1 ? document.getElementById('player1-cards') : document.getElementById('player2-cards');

    // Display each card with its value and suit
    const cardString = playerCards.map(card => `${card.value} ${card.suit}`).join(' ');
    playerCardsDiv.innerHTML = cardString;
    playerTotal.innerHTML = 'Total: ' + calculateTotal(playerCards);
}

// Start a new game
function startGame() {
    if (gameInProgress) return;

    // Draw two cards for each player initially
    player1Cards = [shuffledDeck.pop(), shuffledDeck.pop()];
    player2Cards = [shuffledDeck.pop(), shuffledDeck.pop()];

    // Set total card count for each player
    totalCardsPlayer1 = player1Cards.length; // 2 cards for player 1
    totalCardsPlayer2 = player2Cards.length; // 2 cards for player 2

    player1Turn = true; // Player 1 starts the game
    gameInProgress = true; // Game is in progress

    // Reset result text
    resultText.innerHTML = '';

    // Enable player controls
    document.getElementById('hit-btn-1').disabled = false;
    document.getElementById('stand-btn-1').disabled = false;
    document.getElementById('hit-btn-2').disabled = true;
    document.getElementById('stand-btn-2').disabled = true;

    // Display the initial cards for both players
    displayPlayerCards(1);
    displayPlayerCards(2);
}


function hit(player) {
    let playerCards;
    let totalCards;

    if (player === 1) {
        playerCards = player1Cards;
        totalCards = totalCardsPlayer1;
    } else {
        playerCards = player2Cards;
        totalCards = totalCardsPlayer2;
    }

    if (totalCards < 3) { // Check if the player has less than 3 cards
        playerCards.push(shuffledDeck.pop()); // Draw a new card
        totalCards++; // Increment the total card count for the player

        // Update the total card count
        if (player === 1) totalCardsPlayer1 = totalCards;
        else totalCardsPlayer2 = totalCards;

        displayPlayerCards(player); // Display the player's updated cards

        // If the player's total is 9, automatically stand for them
        if (calculateTotal(playerCards) === 9) {
            stand(player);
        }
    } else {
        resultText.innerHTML = 'Max cards reached! You cannot hit anymore.';
        console.log(`Player ${player} Total Cards: `, totalCards);
    }
}


// Handle the "Stand" action (end the player's turn)
function stand(player) {
    if (player === 1) {
        player1Turn = false;
        document.getElementById('hit-btn-1').disabled = true;
        document.getElementById('stand-btn-1').disabled = true;

        // Enable player 2's controls
        document.getElementById('hit-btn-2').disabled = false;
        document.getElementById('stand-btn-2').disabled = false;
    } else {
        // Both players have finished their turns, now determine the winner
        determineWinner();
    }
}

// Determine the winner
function determineWinner() {
    const player1Total = calculateTotal(player1Cards);
    const player2Total = calculateTotal(player2Cards);

    if (player1Total > player2Total) {
        resultText.innerHTML = 'Player 1 Wins!';
    } else if (player2Total > player1Total) {
        resultText.innerHTML = 'Player 2 Wins!';
    } else {
        resultText.innerHTML = 'It\'s a Tie!';
    }

    // Disable both players' controls after the game ends
    document.getElementById('hit-btn-2').disabled = true;
    document.getElementById('stand-btn-2').disabled = true;
    gameInProgress = false;
}

// Event listeners for buttons
startButton.addEventListener('click', startGame);
document.getElementById('hit-btn-1').addEventListener('click', () => hit(1));
document.getElementById('stand-btn-1').addEventListener('click', () => stand(1));
document.getElementById('hit-btn-2').addEventListener('click', () => hit(2));
document.getElementById('stand-btn-2').addEventListener('click', () => stand(2));
