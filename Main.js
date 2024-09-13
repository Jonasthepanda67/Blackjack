class Player {
    constructor(name, balance = 250) {
        this.name = name;
        this.balance = balance;
        this.hand = [];
    }

    hit(card) {
        this.hand.push(card);
    }

    bet(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            return amount;
        }
        return 0;
    }

    resetHand() {
        this.hand = [];
    }

    getHandValue() {
        let value = 0;
        let hasAce = false;
        this.hand.forEach(card => {
            let cardValue = card.slice(0, -1);
            if (['J', 'Q', 'K'].includes(cardValue)) {
                value += 10;
            } else if (cardValue === 'A') {
                hasAce = true;
                value += 11;
            } else {
                value += parseInt(cardValue);
            }
        });
        if (hasAce && value > 21) {
            value -= 10;
        }
        return value;
    }
}

class Dealer {
    constructor() {
        this.hand = [];
    }

    hit(card) {
        this.hand.push(card);
    }

    resetHand() {
        this.hand = [];
    }

    getHandValue() {
        let value = 0;
        let hasAce = false;
        this.hand.forEach(card => {
            let cardValue = card.slice(0, -1);
            if (['J', 'Q', 'K'].includes(cardValue)) {
                value += 10;
            } else if (cardValue === 'A') {
                hasAce = true;
                value += 11;
            } else {
                value += parseInt(cardValue);
            }
        });
        if (hasAce && value > 21) {
            value -= 10;
        }
        return value;
    }
}

const playerElements = document.querySelectorAll('.player-seat');
const dealerArea = document.querySelector('.dealer-area .dealer-cards');
const potArea = document.querySelector('.pot-area h3');
const buttons = {
    hit: document.querySelector('.controls button:nth-child(1)'),
    stand: document.querySelector('.controls button:nth-child(2)'),
    bet: document.querySelector('.controls button:nth-child(3)'),
    split: document.querySelector('.controls button:nth-child(4)')
};

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
//let deck = [];
let players = [];
let dealer = new Dealer();
let pot = 0;
let currentPlayerIndex = 0;
let gameEnded = false;

function initializePlayers() {
    playerElements.forEach((playerElement, index) => {
        const playerName = playerElement.querySelector('.player-name').value;
        players[index] = new Player(playerName);
    });
    currentPlayerIndex = 0;
    updatePlayerUI(currentPlayerIndex);
}

function updatePlayerCards(playerIndex) {
    const player = players[playerIndex];
    const playerElement = playerElements[playerIndex];
    const playerCardsContainer = playerElement.querySelector('.player-cards');
    
    playerCardsContainer.innerHTML = '';

    player.hand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'default-card');
        cardDiv.textContent = card;
        playerCardsContainer.appendChild(cardDiv);
    });

    updatePlayerPoints(playerIndex);
}

function displayDealerPoints() {
    const visibleCards = dealer.hand.slice(1);
    const dealerPoints = visibleCards.reduce((sum, card) => sum + cardValue(card), 0);
    const dealerPointsElement = document.querySelector('.dealer-area .dealer-points');
    dealerPointsElement.textContent = `Dealer Points: ${dealerPoints}`;
}

function updateDealerCards() {
    dealerArea.innerHTML = '';
    dealer.hand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = (index === 0 && !gameEnded) ? '?' : card;
        dealerArea.appendChild(cardDiv);
    });

    if (!gameEnded) {
        displayDealerPoints();
    }
}

function updateBalances() {
    playerElements.forEach((playerElement, index) => {
        const balanceElement = playerElement.querySelector('.player-info');
        balanceElement.textContent = `$${players[index].balance.toFixed(2)}`;
    });
}

function updatePot() {
    potArea.textContent = `Pot: $${pot}`;
}

function dealCards() {
    players.forEach(player => player.resetHand());
    dealer.resetHand();

    players.forEach(player => {
        player.hit(dealCard());
        player.hit(dealCard());
    });

    dealer.hit(dealCard());
    dealer.hit(dealCard());

    players.forEach((_, index) => updatePlayerCards(index));
    updateDealerCards();
    displayDealerPoints();
}

buttons.hit.addEventListener('click', function () {
    if (!gameEnded && currentPlayerIndex < players.length) {
        players[currentPlayerIndex].hit(dealCard());
        updatePlayerCards(currentPlayerIndex);

        const handValue = players[currentPlayerIndex].getHandValue();
        if (handValue > 21) {
            updatePlayerPoints(currentPlayerIndex);
            nextPlayer();
        } else if (handValue === 21) {
            updatePlayerPoints(currentPlayerIndex);
            nextPlayer();
        }
    }
});

buttons.bet.addEventListener('click', function () {
    const betAmount = 50;
    const playerBet = players[currentPlayerIndex].bet(betAmount);
    pot += playerBet;
    updateBalances();
    updatePot();
});

function dealCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    /*let chosenCard = Math.floor(Math.random() * deck.length);
    let card = deck.pop(chosenCard);*/

    return `${value}${suit}`;
}

/*function ShuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const l = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[l]] = [deck[l], deck[i]];
    }
}

function CreateCards() {
    for (let i = 0; i < suits.length; i++) {
        for (let l = 0; l < values.length; l++) 
        {
            if(values[l] == "Jack" || values[l] == "Queen" || values[l] == "King") 
            {
                deck.push({Suit: suits[i], Value: 10, Type: values[l]});
            }
            else if(values[l] == "Ace") 
                {
                    deck.push({Suit: suits[i], Value: 11, Type: values[l]});
                }
            else {
                deck.push({Suit: suits[i], Value: values[l], Type: values[l]});
            }
        }
    }
}

function CreateDeck() {
    deck = [];
    for (let i = 0; i < 3; i++) {
        CreateCards();
    }
    ShuffleDeck();
}*/

function nextPlayer() {
    playerElements[currentPlayerIndex].classList.remove('current-turn');
    
    currentPlayerIndex++;
    
    if (currentPlayerIndex >= players.length) {
        dealerTurn();
    } else {
        updatePlayerUI(currentPlayerIndex);
        updatePlayerPoints(currentPlayerIndex);
    }
}

buttons.stand.addEventListener('click', function () {
    if (!gameEnded) {
        nextPlayer();
    }
});

function dealerTurn() {
    dealerArea.querySelector('.card').textContent = dealer.hand[0];
    displayDealerPoints();

    while (dealer.getHandValue() < 17) {
        dealer.hit(dealCard());
        updateDealerCards();
    }

    updateDealerCards();
    displayDealerPoints();

    determineWinners();
}

function cardValue(card) {
    const cardValue = card.slice(0, -1);
    if (['J', 'Q', 'K'].includes(cardValue)) {
        return 10;
    } else if (cardValue === 'A') {
        return 11;
    } else {
        return parseInt(cardValue);
    }
}

function determineWinners() {
    const dealerValue = dealer.getHandValue();
    let winningPlayers = [];
    let drawPlayers = [];
    let dealerWins = true;

    if (dealerValue > 21) {
        dealerWins = false;
    }

    players.forEach(player => {
        const playerHandValue = player.getHandValue();

        if (playerHandValue <= 21) {
            if (playerHandValue > dealerValue || dealerValue > 21) {
                winningPlayers.push(player.name);
                dealerWins = false;
            } else if (playerHandValue == dealerValue && dealerValue <= 20) {
                drawPlayers.push(player.name);
                dealerWins = false;
            }
        }
    });

    let resultMessage = '';
    if (dealerWins && winningPlayers.length === 0) {
        resultMessage = `Dealer wins with ${dealerValue} points!`;
    } else if (winningPlayers.length > 0) {
        resultMessage = `Players winning over the dealer: ${winningPlayers.join(', ')} \n\n(Dealer had ${dealerValue} points)`;
    } else if (winningPlayers.length > 0 && drawPlayers.length > 0) {
        resultMessage = `Players winning over the dealer: ${winningPlayers.join(', ')} \n\nPlayers that are at a draw with the dealer: ${drawPlayers.join(', ')} \n(Dealer had ${dealerValue} points)`;
    } else if (drawPlayers.length > 0) {
        resultMessage = `Players that are at a draw with the dealer: ${drawPlayers.join(', ')} \n\n(Dealer had ${dealerValue} points)`;
    } else {
        resultMessage = `No winners! Dealer had ${dealerValue} points.`;
    }

    if (confirm(`${resultMessage}\n\nDo you want to play again?`)) {
        resetGame();
    } else {
        alert('Thank you for playing!');
    }

    gameEnded = true;
}

function updatePlayerUI(playerIndex) {
    playerElements.forEach((el, i) => {
        if (i === playerIndex) {
            el.classList.add('current-turn');
        } else {
            el.classList.remove('current-turn');
        }
    });
}

function updatePlayerPoints(playerIndex) {
    const player = players[playerIndex];
    const playerElement = playerElements[playerIndex];
    const pointsElement = playerElement.querySelector('.points');
    pointsElement.textContent = `Points: ${player.getHandValue()}`;
}

function resetGame() {
    gameEnded = false;
    currentPlayerIndex = 0;
    pot = 0;

    players.forEach(player => player.resetHand());
    dealer.resetHand();

    playerElements.forEach(playerElement => {
        const playerCardsContainer = playerElement.querySelector('.player-cards');
        playerCardsContainer.innerHTML = '';
        const playerInfoElement = playerElement.querySelector('.player-info');
        playerInfoElement.textContent = '$0';
        playerElement.classList.remove('current-turn');
    });
    dealerArea.innerHTML = '';
    potArea.textContent = `Pot: $${pot}`;

    initializePlayers();
    dealCards();
    updateBalances();
    updatePot();
    updatePlayerUI(currentPlayerIndex);
}

initializePlayers();
dealCards();
updateBalances();
updatePot();
