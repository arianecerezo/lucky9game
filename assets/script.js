const startButton = document.getElementById('start-btn');
const continueButton = document.getElementById('continue-btn');
const resultText = document.getElementById('result');

let player1Cards = [];
let player2Cards = [];
let player1Turn = true;
let gameInProgress = false;

let player1Score = 0;
let player2Score = 0;

const cardValues = {
    2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 1
};

const suits = ['♠', '♥', '♦', '♣'];
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

// Calculate hand total
function calculateTotal(hand) {
    const sum = hand.reduce((total, card) => total + cardValues[card.value], 0);
    return sum % 10;
}
function displayPlayerCards(player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;
    const playerTotal = document.getElementById(`player${player}-total`);
    const playerCardsDiv = document.getElementById(`player${player}-cards`);

    playerCardsDiv.innerHTML = '';

    playerCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'back-card'); 

        setTimeout(() => {
            cardElement.classList.remove('back-card'); 
            cardElement.classList.add('flip'); 

            setTimeout(() => {
                cardElement.innerHTML = `
                    <span class="top-left">${card.value}</span>
                    <span class="suit">${card.suit}</span>
                    <span class="bottom-right">${card.value}</span>
                `;

                
                if (card.suit === '♥' || card.suit === '♦') {
                    cardElement.classList.add('red');
                } else {
                    cardElement.classList.add('black');
                }
            }, 300); 
        }, index * 300); 

        playerCardsDiv.appendChild(cardElement);
    });

    setTimeout(() => {
        playerTotal.innerHTML = 'Total: ' + calculateTotal(playerCards);
    }, playerCards.length * 300);
}

// Function to create and display styled card elements
// function displayPlayerCards(player) {
//     const playerCards = player === 1 ? player1Cards : player2Cards;
//     const playerTotal = document.getElementById(`player${player}-total`);
//     const playerCardsDiv = document.getElementById(`player${player}-cards`);

//     playerCardsDiv.innerHTML = '';

//     playerCards.forEach(card => {
//         const cardElement = document.createElement('div');
//         cardElement.classList.add('card');

//         //flipping card
//         const isFaceDown = false;

//         if (isFaceDown) {
//             cardElement.classList.add('back-card');
//         } else {
//             if (card.suit === '♥' || card.suit === '♦') {
//                 cardElement.classList.add('red');
//             } else {
//                 cardElement.classList.add('black');
//             }

//             cardElement.innerHTML = `
//             <span class="top-left">${card.value}</span>
//                 <span class="suit">${card.suit}</span>
//                 <span class="bottom-right">${card.value}</span>
//             `;
//         }

//         if (card.suit === '♥' || card.suit === '♦') {
//             cardElement.classList.add('red');
//         } else {
//             cardElement.classList.add('black');
//         }

//         cardElement.setAttribute('data-value', card.value + card.suit);
//         cardElement.innerHTML = `
//             <span class="top-left">${card.value}</span>
//             <span class="suit">${card.suit}</span>
//             <span class="bottom-right">${card.value}</span>
//         `;

//         playerCardsDiv.appendChild(cardElement);
//     });

//     playerTotal.innerHTML = 'Total: ' + calculateTotal(playerCards);
// }

function startGame() {
    if (gameInProgress) return;

    // Reset scores (optional)
    player1Score = 0;
    player2Score = 0;
    updateScoreboard();

    // Start game setup...

    // Show loading animation
    const loading = document.getElementById('loading');
    loading.style.display = 'block';


    setTimeout(() => {
        // Hide loading after 2 seconds
        loading.style.display = 'none';

        shuffledDeck = shuffleDeck([...deck]);
        player1Cards = [];
        player2Cards = [];

        resultText.innerHTML = '';
        resultText.classList.remove('winner', 'loser');

        document.getElementById('player1-cards').innerHTML = '';
        document.getElementById('player2-cards').innerHTML = '';
        document.getElementById('player1-total').innerHTML = 'Total: 0';
        document.getElementById('player2-total').innerHTML = 'Total: 0';

        document.getElementById('hit-btn-1').style.display = 'inline-block';
        document.getElementById('stand-btn-1').style.display = 'inline-block';
        document.getElementById('hit-btn-2').style.display = 'inline-block';
        document.getElementById('stand-btn-2').style.display = 'inline-block';

        document.getElementById('hit-btn-1').disabled = false;
        document.getElementById('stand-btn-1').disabled = false;
        document.getElementById('hit-btn-2').disabled = true;
        document.getElementById('stand-btn-2').disabled = true;

        player1Cards.push(shuffledDeck.pop(), shuffledDeck.pop());
        player2Cards.push(shuffledDeck.pop(), shuffledDeck.pop());

        displayPlayerCards(1);
        displayPlayerCards(2);

        if (calculateTotal(player1Cards) === 9) {
            declareImmediateWinner(1);
        } else if (calculateTotal(player2Cards) === 9) {
            declareImmediateWinner(2);
        } else {
            document.getElementById('player1').classList.add('active');
            document.getElementById('player2').classList.remove('active');
            player1Turn = true;
            gameInProgress = true;
        }
    }, 2000); // 2-second delay for the loading animation
}

function continueGame() {
    if (gameInProgress) return; // Prevent starting a new round if one is ongoing

    shuffledDeck = shuffleDeck([...deck]);
    player1Cards = [];
    player2Cards = [];

    resultText.innerHTML = '';
    resultText.classList.remove('winner', 'loser');

    document.getElementById('player1-cards').innerHTML = '';
    document.getElementById('player2-cards').innerHTML = '';
    document.getElementById('player1-total').innerHTML = 'Total: 0';
    document.getElementById('player2-total').innerHTML = 'Total: 0';

    document.getElementById('hit-btn-1').style.display = 'inline-block';
    document.getElementById('stand-btn-1').style.display = 'inline-block';
    document.getElementById('hit-btn-2').style.display = 'inline-block';
    document.getElementById('stand-btn-2').style.display = 'inline-block';

    document.getElementById('hit-btn-1').disabled = false;
    document.getElementById('stand-btn-1').disabled = false;
    document.getElementById('hit-btn-2').disabled = true;
    document.getElementById('stand-btn-2').disabled = true;

    player1Cards.push(shuffledDeck.pop(), shuffledDeck.pop());
    player2Cards.push(shuffledDeck.pop(), shuffledDeck.pop());

    displayPlayerCards(1);
    displayPlayerCards(2);

    if (calculateTotal(player1Cards) === 9) {
        declareImmediateWinner(1);
    } else if (calculateTotal(player2Cards) === 9) {
        declareImmediateWinner(2);
    } else {
        document.getElementById('player1').classList.add('active');
        document.getElementById('player2').classList.remove('active');
        player1Turn = true;
        gameInProgress = true;
    }
}

function hit(player) {
    let playerCards = player === 1 ? player1Cards : player2Cards;

    if (playerCards.length < 3) {
        playerCards.push(shuffledDeck.pop());
        displayPlayerCards(player);
    }

    let total = calculateTotal(playerCards);

    if (total === 9) {
        if (player === 1) {
            document.getElementById('hit-btn-2').disabled = false;
            document.getElementById('stand-btn-2').disabled = false;
            document.getElementById('hit-btn-1').disabled = true;
            document.getElementById('stand-btn-1').disabled = true;
            document.getElementById('player1').classList.remove('active');
            document.getElementById('player2').classList.add('active');
        } else {
            determineWinner();
        }
    } else if (playerCards.length === 3) {
        stand(player);
    }
}

function stand(player) {
    if (player === 1) {
        player1Turn = false; /// addhidden cards
        document.getElementById('hit-btn-1').disabled = true;
        document.getElementById('stand-btn-1').disabled = true;
        document.getElementById('hit-btn-2').disabled = false;
        document.getElementById('stand-btn-2').disabled = false;
        document.getElementById('player1').classList.remove('active');
        document.getElementById('player2').classList.add('active');
    } else {
        determineWinner();
    }
}

function updateScoreboard() {
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
}


function declareImmediateWinner(player) {
    resultText.innerHTML = `🎉 Player ${player} Wins with 9!`;
    resultText.classList.add('winner');

    if (player === 1) {
        player1Score++;
    } else {
        player2Score++;
    }

    updateScoreboard();

    document.getElementById('hit-btn-1').disabled = true;
    document.getElementById('stand-btn-1').disabled = true;
    document.getElementById('hit-btn-2').disabled = true;
    document.getElementById('stand-btn-2').disabled = true;

    gameInProgress = false;
}

function determineWinner() {
    const player1Total = calculateTotal(player1Cards);
    const player2Total = calculateTotal(player2Cards);

    if (player1Total > player2Total) {
        resultText.innerHTML = '🎉 Player 1 Wins!';
        resultText.classList.add('winner');
        player1Score++;
    } else if (player2Total > player1Total) {
        resultText.innerHTML = '🎉 Player 2 Wins!';
        resultText.classList.add('winner');
        player2Score++;
    } else {
        resultText.innerHTML = '🤝 It\'s a Tie!';
        resultText.classList.add('loser');
    }

    updateScoreboard();

    document.getElementById('hit-btn-2').disabled = true;
    document.getElementById('stand-btn-2').disabled = true;
    gameInProgress = false;
}

// Event Listeners
startButton.addEventListener('click', startGame);
document.getElementById('hit-btn-1').addEventListener('click', () => hit(1));
document.getElementById('stand-btn-1').addEventListener('click', () => stand(1));
document.getElementById('hit-btn-2').addEventListener('click', () => hit(2));
document.getElementById('stand-btn-2').addEventListener('click', () => stand(2));

continueButton.addEventListener('click', continueGame);

window.onload = function () {
    document.getElementById('hit-btn-1').style.display = 'none';
    document.getElementById('stand-btn-1').style.display = 'none';
    document.getElementById('hit-btn-2').style.display = 'none';
    document.getElementById('stand-btn-2').style.display = 'none';
};


//how to play
function toggleTooltip() {
    const tooltip = document.querySelector('.tooltip');
    tooltip.classList.toggle('active');
}
window.addEventListener('click', (event) => {
    const tooltip = document.querySelector('.tooltip');
    if (!tooltip.contains(event.target)) {
        tooltip.classList.remove('active');
    }
});
