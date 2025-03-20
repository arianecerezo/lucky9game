const startButton = document.getElementById('start-btn');
const resultText = document.getElementById('result');
const TURN_TIME_LIMIT = 15000; // 15 seconds


const style = document.createElement('style');
style.innerHTML = `
        @keyframes shuffleCards {
            0% { transform: translateY(0) rotate(0) scale(1); opacity: 1; }
            20% { transform: translateY(-15px) rotate(-10deg) scale(1.1); opacity: 0.9; }
            40% { transform: translateY(15px) rotate(10deg) scale(1); opacity: 0.8; }
            60% { transform: translateY(-10px) rotate(-5deg) scale(1.05); opacity: 0.9; }
            80% { transform: translateY(10px) rotate(5deg) scale(1); opacity: 1; }
            100% { transform: translateY(0) rotate(0) scale(1); opacity: 1; }
        }

        @keyframes flipAndFade {
            0% { transform: perspective(600px) rotateY(0deg); opacity: 1; }
            50% { transform: perspective(600px) rotateY(90deg); opacity: 0.7; }
            100% { transform: perspective(600px) rotateY(0deg); opacity: 1; }
        }

        .card-back {
            width: 100px;
            height: 140px;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            border-radius: 10px;
            border: 2px solid white;
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
            position: relative;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
            color: white;
            animation: shuffleCards 0.6s ease-in-out infinite alternate, flipAndFade 1.5s ease-in-out infinite;
            transform-origin: center;
            overflow: hidden;
        }

        .card-back::before {
            content: '';
            position: absolute;
            width: 90%;
            height: 90%;
            background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 10px, transparent 10px, transparent 20px);
            border-radius: 8px;
        }

        .card-back::after {
            content: '♠';
            font-size: 40px;
            color: rgba(255, 255, 255, 0.8);
            position: absolute;
            bottom: 10px;
            right: 10px;
            transform: rotate(180deg);
        }
    `;
document.head.appendChild(style);




let player1Cards = [];
let player2Cards = [];
let player1Turn = true;
let gameInProgress = false;
let turnTimer;

let player1Score = 0; // Stores Player 1's score
let player2Score = 0; // Stores Player 2's score

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

    if (playerCards.length === 2) {
        // Show two back-facing cards initially
        for (let i = 0; i < 2; i++) {
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            playerCardsDiv.appendChild(cardBack);
        }
        playerTotal.innerHTML = 'Total: ?';

        disableAllButtons();  // Disable all buttons when displaying cards

        // Reveal button for Player 1
        if (player === 1) {
            const revealBtn = document.createElement('button');
            revealBtn.textContent = 'Reveal Cards';
            revealBtn.classList.add('reveal-btn');
            revealBtn.onclick = () => {
                showAllCards(player);
                revealBtn.disabled = true; // Disable button after use
                console.log('pumasok sya');
                
                document.getElementById(`hit-btn-${player}`).disabled = false;
                document.getElementById(`stand-btn-${player}`).disabled = false;
            };
            playerCardsDiv.appendChild(revealBtn);
        }

        // Reveal button for Player 2 (Initially disabled)
        if (player === 2) {
            const revealBtnPlayer2 = document.createElement('button');
            revealBtnPlayer2.textContent = 'Reveal Cards';
            revealBtnPlayer2.classList.add('reveal-btn');
            revealBtnPlayer2.disabled = true; // Disable for Player 2 initially
            revealBtnPlayer2.onclick = () => {
                showAllCards(2);
                revealBtnPlayer2.disabled = true; // Disable button after use
                document.getElementById('hit-btn-2').disabled = false;
                document.getElementById('stand-btn-2').disabled = false;
            };
            playerCardsDiv.appendChild(revealBtnPlayer2);
        }
    } else {
        // If third card is drawn, reveal all three automatically
        showAllCards(player);
    }

    // Only enable Player 2's "Reveal Cards" button once Player 1 has finished their turn
    if (player === 1) {
        setTimeout(() => {
            // Enable Player 2's reveal button only when Player 1 has finished their turn
            document.getElementById('hit-btn-2').disabled = true;
            document.getElementById('stand-btn-2').disabled = true;
            const revealBtnPlayer2 = document.querySelector('.reveal-btn');
            if (revealBtnPlayer2) revealBtnPlayer2.disabled = false; // Enable the reveal button
        }, 500); // Small delay for smooth transition
    }
}


function showAllCards(player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;
    const playerTotal = document.getElementById(`player${player}-total`);
    const playerCardsDiv = document.getElementById(`player${player}-cards`);
    playerCardsDiv.innerHTML = ''; // Clear existing cards

    playerCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        if (card.suit === '♥' || card.suit === '♦') {
            cardElement.classList.add('red');
        } else {
            cardElement.classList.add('black');
        }

        cardElement.innerHTML = `
                <span class="top-left">${card.value}</span>
                <span class="suit">${card.suit}</span>
                <span class="bottom-right">${card.value}</span>
            `;

        playerCardsDiv.appendChild(cardElement);
    });

    playerTotal.innerHTML = 'Total: ' + calculateTotal(playerCards);
}



function hit(player) {
    let playerCards = player === 1 ? player1Cards : player2Cards;

    if (playerCards.length < 3) {
        playerCards.push(shuffledDeck.pop());
        displayPlayerCards(player);
    }

    let total = calculateTotal(playerCards);

    if (player === 1 && total === 9) {
        // Player 1 reaches 9, force Player 2 to hit
        document.getElementById('hit-btn-2').disabled = false;
        document.getElementById('stand-btn-2').disabled = true; // Prevent Player 2 from standing
        document.getElementById('hit-btn-1').disabled = true;
        document.getElementById('stand-btn-1').disabled = true;
        document.getElementById('player1').classList.remove('active');
        document.getElementById('player2').classList.add('active');

        // Enable Player 2's reveal button after Player 1 has completed their turn
        setTimeout(() => {
            enablePlayer2RevealButton();
        }, 500); // Slight delay for visual effect

        setTimeout(() => {
            hit(2); // Force Player 2 to hit
        }, 1000); // Slight delay for visual effect
        return;
    }

    if ((player === 1 && total === 9) && (player === 2 && total === 9)) {
        // If Player 2 hits and also reaches 9, it's a tie
        showAllCards(player);
        revealBtn.disabled = true;
        resultText.innerHTML = '🤝 It\'s a Tie!';
        resultText.classList.add('loser');
        updateScoreDisplay();
        disableAllButtons();
        document.getElementById('continue-btn').style.display = 'inline-block';
        return;
    }

    console.log("playercard len: ", playerCards.length);
    console.log("player: ", player);

    if (playerCards.length === 3) {
        stand(player);
    } else {
        startTurnTimer(player);
    }
}

// Function to enable Player 2's reveal button
function enablePlayer2RevealButton() {
    const revealBtnPlayer2 = document.querySelector('.reveal-btn');
    if (revealBtnPlayer2) {
        revealBtnPlayer2.disabled = false;  // Enable the reveal button for Player 2
    }
}



function startTurnTimer(player) {
    clearTimeout(turnTimer); // Clear previous timer
    turnTimer = setTimeout(() => {
        stand(player); // Auto-stand if time runs out
    }, TURN_TIME_LIMIT);
}

function stand(player) {
    clearTimeout(turnTimer); // Clear timer when player stands

    if (player === 1) {
        document.getElementById('hit-btn-1').disabled = true;
        document.getElementById('stand-btn-1').disabled = true;
        document.getElementById('hit-btn-2').disabled = true; 
        document.getElementById('stand-btn-2').disabled = true;
        document.getElementById('player1').classList.remove('active');
        document.getElementById('player2').classList.add('active');
        
        // Enable Player 2's reveal button after Player 1 stands
        setTimeout(() => {
            enablePlayer2RevealButton();
        }, 500); // Small delay for smooth transition

        startTurnTimer(2); // Start Player 2's turn
    } else {
        determineWinner();
    }
}

function declareImmediateWinner(player) {
    // Get the result container
    const resultText = document.getElementById('result');

    // Display the result based on the winner
    resultText.innerHTML = `🎉 Player ${player} Wins with 9!`;

    // Show all cards for both players
    showAllCards(1);
    showAllCards(2);

    // Disable all buttons since the game has ended
    disableAllButtons();

    // Update the score based on the winner
    if (player === 1) {
        player1Score++;
    } else {
        player2Score++;
    }

    updateScoreDisplay();

    // Show the result
    resultText.style.opacity = 1;
    resultText.style.visibility = 'visible';

    // Hide the result after 3 seconds (3000 milliseconds)
    setTimeout(() => {
        resultText.style.opacity = 0;
        resultText.style.visibility = 'hidden';
    }, 3000); // Result fades out after 3 seconds

    // Re-enable the start and continue buttons for the next round
    startButton.disabled = false;
    document.getElementById('continue-btn').style.display = 'inline-block';
    document.getElementById('continue-btn').disabled = false;

    gameInProgress = false; // Mark game as ended
}



// function declareImmediateWinner(player) {
//     resultText.innerHTML = `🎉 Player ${player} Wins with 9!`;

//     let player1Total;
//     let player2Total;
//     console.log("total1: ",player1Total)
//     console.log("total2: ",player2Total)
//     if (player1Total === 9 && player2Total === 9) {
//         resultText.innerHTML = `🤝 It's a Tie! Both players have 9!`;
//         showAllCards(player);
//         disableAllButtons();
//     } else if (player1Total === 9) {
//         showAllCards(player);
//         resultText.innerHTML = `🎉 Player 1 Wins with 9!`;
//         disableAllButtons();
//         player1Score++;
//     } else if (player2Total === 9) {
//         showAllCards(player);
//         resultText.innerHTML = `🎉 Player 2 Wins with 9!`;
//         disableAllButtons();
//         player2Score++;
//     }


//     resultText.classList.add('winner');



//     if (player === 1) {
//         player1Score++;
//     } else {
//         player2Score++;
//     }

//     updateScoreDisplay();
//     disableAllButtons();

//     // ✅ Re-enable Start and Continue buttons
//     startButton.disabled = false;
//     document.getElementById('continue-btn').style.display = 'inline-block';
//     document.getElementById('continue-btn').disabled = false;

//     // ✅ Reset game state
//     gameInProgress = false;
// }



function determineWinner() {
    const player1Total = calculateTotal(player1Cards);
    const player2Total = calculateTotal(player2Cards);

    // Get the result container
    const resultText = document.getElementById('result');

    // Check the winner and set the message
    if (player1Total === player2Total) {
        resultText.innerHTML = '🤝 It\'s a Tie!';
    } else if (player1Total > player2Total) {
        resultText.innerHTML = '🎉 Player 1 Wins!';
        resultText.classList.add('winner');
        player1Score++;
    } else {
        resultText.innerHTML = '🎉 Player 2 Wins!';
        resultText.classList.add('winner');
        player2Score++;
    }

    // Show the result
    resultText.style.opacity = 1;
    resultText.style.visibility = 'visible';

    // Hide the result after 3 seconds
    setTimeout(() => {
        resultText.style.opacity = 0;
        resultText.style.visibility = 'hidden';
    }, 3000); // 3 seconds duration

    updateScoreDisplay();
    disableAllButtons();

    // Re-enable Start and Continue buttons
    startButton.disabled = false;
    document.getElementById('continue-btn').style.display = 'inline-block';
    document.getElementById('continue-btn').disabled = false;

    gameInProgress = false; // Mark game as ended
}



function startGame(isNewGame = true) {
    if (gameInProgress) return;

    gameInProgress = true; // Set game in progress
    startButton.disabled = true; // Disable Start Game button

    clearTimeout(turnTimer);
    document.getElementById('continue-btn').style.display = 'none';

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    // Create shuffle overlay dynamically
    const shuffleOverlay = document.createElement('div');
    shuffleOverlay.id = 'shuffle-overlay';
    shuffleOverlay.style.position = 'absolute';
    shuffleOverlay.style.top = '50%';
    shuffleOverlay.style.left = '50%';
    shuffleOverlay.style.transform = 'translate(-50%, -50%)';
    shuffleOverlay.style.display = 'flex';
    shuffleOverlay.style.justifyContent = 'center';
    shuffleOverlay.style.alignItems = 'center';
    shuffleOverlay.style.gap = '10px';
    shuffleOverlay.style.zIndex = '1000';
    shuffleOverlay.style.width = '100%';
    shuffleOverlay.style.height = '100vh';
    shuffleOverlay.style.background = 'rgba(0, 0, 0, 0.7)';

    // Generate animated card backs
    for (let i = 0; i < 5; i++) {
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.style.animationDelay = `${i * 0.2}s`; // Delayed effect for a smooth shuffle
        shuffleOverlay.appendChild(cardBack);
    }

    document.body.appendChild(shuffleOverlay);



    setTimeout(() => {
        document.body.removeChild(shuffleOverlay);
        loading.style.display = 'none';

        shuffledDeck = shuffleDeck([...deck]);
        player1Cards = [];
        player2Cards = [];

        resultText.innerHTML = '';

        resultText.classList.remove('winner', 'loser');

        setTimeout(() => {
            document.getElementById('player1-cards').innerHTML = '<div class="card-back"></div><div class="card-back"></div>';
            document.getElementById('player2-cards').innerHTML = '<div class="card-back"></div><div class="card-back"></div>';
            document.getElementById('player1-total').innerHTML = 'Total: ?';
            document.getElementById('player2-total').innerHTML = 'Total: ?';

            document.getElementById('hit-btn-1').style.display = 'inline-block';
            document.getElementById('stand-btn-1').style.display = 'inline-block';
            document.getElementById('hit-btn-2').style.display = 'inline-block';
            document.getElementById('stand-btn-2').style.display = 'inline-block';

            document.getElementById('hit-btn-1').disabled = false;
            document.getElementById('stand-btn-1').disabled = false;
            document.getElementById('hit-btn-2').disabled = true;
            document.getElementById('stand-btn-2').disabled = true;

            if (isNewGame) {
                player1Score = 0;
                player2Score = 0;
            }

            updateScoreDisplay();

            player1Cards.push(shuffledDeck.pop(), shuffledDeck.pop());
            player2Cards.push(shuffledDeck.pop(), shuffledDeck.pop());

            displayPlayerCards(1);
            displayPlayerCards(2);

            let player1Total = calculateTotal(player1Cards);
            let player2Total = calculateTotal(player2Cards);

            if (player1Total === 9) {
                declareImmediateWinner(1);
                return;
            } else if (player2Total === 9) {
                declareImmediateWinner(2);
                return;
            }



            document.getElementById('player1').classList.add('active');
            document.getElementById('player2').classList.remove('active');
            player1Turn = true;
        }, 1000); // Reveal cards after 3 seconds
    }, 2000); // Shuffle animation lasts 2 seconds
}


// Add an event listener to the Continue button
document.getElementById('continue-btn').addEventListener('click', () => startGame(false));

// Event Listeners
startButton.addEventListener('click', () => startGame(true));
document.getElementById('hit-btn-1').addEventListener('click', () => hit(1));
document.getElementById('stand-btn-1').addEventListener('click', () => stand(1));
document.getElementById('hit-btn-2').addEventListener('click', () => hit(2));
document.getElementById('stand-btn-2').addEventListener('click', () => stand(2));

window.onload = function () {
    document.getElementById('hit-btn-1').style.display = 'none';
    document.getElementById('stand-btn-1').style.display = 'none';
    document.getElementById('hit-btn-2').style.display = 'none';
    document.getElementById('stand-btn-2').style.display = 'none';
};

function updateScoreDisplay() {
    document.querySelectorAll('.player')[0].querySelector('.score-badge').textContent = `Score: ${player1Score}`;
    document.querySelectorAll('.player')[1].querySelector('.score-badge').textContent = `Score: ${player2Score}`;
}

function disableAllButtons() {
    document.getElementById('hit-btn-1').disabled = true;
    document.getElementById('stand-btn-1').disabled = true;
    document.getElementById('hit-btn-2').disabled = true;
    document.getElementById('stand-btn-2').disabled = true;
}