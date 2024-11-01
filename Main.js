class Player {
    constructor(name, balance = 250, avatar = '') {
        this.name = name;
        this.balance = balance;
        this.wager = 0;
        this.hand = [];
        this.avatar = avatar;
        this.hasJoined = false;
        this.isFinished = false;
    }

    joinGame() {
        this.hasJoined = true;
    }

    hit(card) {
        this.hand.push(card);
    }

    bet(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            this.wager += amount;
        }
    }

    resetHand() {
        this.hand = [];
    }

    getHandValue() {
        let value = 0;
        let aceCount = 0;

        this.hand.forEach(card => {
            const rank = card.split('_')[1];

            if (['jack', 'queen', 'king'].includes(rank)) value += 10;
            else if (rank === 'ace') {
                aceCount += 1;
                value += 11;
            } else value += parseInt(rank);
        });

        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount -= 1;
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
        let aceCount = 0;

        this.hand.forEach(card => {
            const rank = card.split('_')[1];

            if (['jack', 'queen', 'king'].includes(rank)) value += 10;
            else if (rank === 'ace') {
                aceCount += 1;
                value += 11;
            } else value += parseInt(rank);
        });
        
        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount -= 1;
        }
    
        return value;
    }
}

const playerElements = document.querySelectorAll('.player-seat');
const dealerArea = document.querySelector('.dealer-area .dealer-cards');
const dealerPointsArea = document.querySelector('.dealer-area .dealer-points');
const potArea = document.querySelector('.pot-area h3');
const buttons = {
    hit: document.querySelector('.controls button:nth-child(1)'),
    stand: document.querySelector('.controls button:nth-child(2)'),
    bet: document.querySelector('.controls button:nth-child(3)'),
    split: document.querySelector('.controls button:nth-child(4)')
};

//const suits = ['♠', '♥', '♦', '♣'];
//const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
//const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
//let deck = [];
let players = [];
let dealer = new Dealer();
let pot = 0;
let currentPlayerIndex = 0;
let selectedCardType;

document.addEventListener("DOMContentLoaded", () => {
    const storedPlayers = JSON.parse(sessionStorage.getItem("players") || "[]");
    const storedPot = sessionStorage.getItem("pot");
    selectedCardType = sessionStorage.getItem("selectedCardType");

    if (storedPlayers.length === 0) {
        console.warn("No players found in session storage.");
        return; // Exit if no players are found
    }

    storedPlayers.forEach((storedPlayer) => {
        const newPlayer = new Player(storedPlayer.name, storedPlayer.balance, storedPlayer.avatar || '../Avatars/man-avatar.png');
        newPlayer.joinGame();
        players.push(newPlayer);
    });

    pot = storedPot ? parseFloat(storedPot) : 0;
    updateUI();
    dealInitialCards();

    buttons.hit.addEventListener("click", function() {
        const currentPlayer = players[currentPlayerIndex];
        currentPlayer.hit(dealCard());
        updatePlayerCards(playerElements[currentPlayerIndex], currentPlayer.hand);
        updateBalances();
    });

    buttons.stand.addEventListener("click", function() {
        nextPlayer();
    });

    /*document.querySelector(".start-game-btn").addEventListener("click", () => {
        initializePlayers();
        dealInitialCards();
        updateBalances();
        updatePot();
    });*/
});

function updateUI() {
    updatePlayerUI(currentPlayerIndex);
    updateBalances();
    updatePot();
    initializePlayerAvatars();
}

function initializePlayerAvatars() {
    players.forEach((player, index) => {
        const playerSeat = playerElements[index];
        const avatarElem = playerSeat.querySelector(".avatar-img");
        if (avatarElem) {
            avatarElem.src = player.avatar || "../Avatars/man-avatar.png"; //change to default when everything works
        }
    });
}

/*function initializePlayers() {
    playerElements.forEach((seat, index) => {
        const playerName = seat.querySelector('.player-name').value;
        players[index] = new Player(playerName);
        players[index].joinGame();
    });
    currentPlayerIndex = 0;
    updatePlayerUI(currentPlayerIndex);
}*/

function dealInitialCards() {
    playerElements.forEach((seat, index) => {
        players[index].hand = [dealCard(), dealCard()];
        const playerHandValue = players[index].getHandValue();
        if (playerHandValue === 21) { players[index].isFinished}
        updatePlayerCards(seat, players[index].hand);
    });
    dealer.hand = [dealCard(), dealCard()];
    updateDealerCards();
    updateBalances();
}

function dealCard() {
    const suits = ["spades", "hearts", "diamonds", "clubs"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    return `${suits[Math.floor(Math.random() * suits.length)]}_${values[Math.floor(Math.random() * values.length)]}`;
}

function updatePlayerCards(seat, hand) {
    const cardsContainer = seat.querySelector(".player-cards");
    if (!cardsContainer) {
        console.error("cardsContainer not found for seat:", seat);
        return;
    }

    cardsContainer.innerHTML = "";
    hand.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";

        const imgSrc = `../Card_Images/${selectedCardType}/${card}.png`;
        console.log(`Image URL for player card: ${imgSrc}`);

        const imgElement = document.createElement("img");
        imgElement.src = imgSrc;
        imgElement.alt = card;

        cardElement.appendChild(imgElement);
        cardsContainer.appendChild(cardElement);
    });
}

function updateDealerCards() {
    dealerArea.innerHTML = "";
    dealer.hand.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");

        const imgSrc = `../Card_Images/${selectedCardType}/${card}.png`;
        console.log(`Image URL for player card: ${imgSrc}`);

        const imgElement = document.createElement("img");
        imgElement.src = imgSrc;
        imgElement.alt = card;

        cardElement.appendChild(imgElement);
        dealerArea.appendChild(cardElement);
    });
}

function updateBalances() {
    playerElements.forEach((seat, index) => {
        const balanceElement = seat.querySelector(".player-info");
        const pointsElement = seat.querySelector(".points");

        const player = players[index];
        const playerBalance = player.balance.toFixed(2);
        const playerPoints = player.getHandValue();
        const dealerPoints = dealer.getHandValue();

        balanceElement.textContent = `$${playerBalance}`;
        if (pointsElement) {
            pointsElement.textContent = `Points: ${playerPoints}`;
        }
        if (dealerPoints > 0) {
            dealerPointsArea.innerText = `Dealer Points: ${dealerPoints}`;
        }
    });
}

function updatePot() {
    potArea.textContent = `Pot: $${pot}`;
}

function updatePlayerUI(index) {
    playerElements.forEach((seat, idx) => {
        seat.classList.toggle("current-turn", idx === index);
    });
}

function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateUI();
}

/*function dealInitialCards(cardType) {
    const dealerArea = document.querySelector(".dealer-cards");
    const playerCards = document.querySelector(".player-cards");

    //storedPlayers.forEach((player, index) => {
    playerSeats.forEach((playerCardContainer) => {
        //const playerCardContainer = playerCards[index];
        const defaultCards = playerCardContainer.querySelectorAll('.default-card, .image-card');
        defaultCards.forEach(card => card.remove());

        const card1 = createCardElement(getRandomCardImage(cardType));
        const card2 = createCardElement(getRandomCardImage(cardType));

        playerCardContainer.appendChild(card1);
        playerCardContainer.appendChild(card2);
    });

    dealerArea.innerHTML = '';
    const dealerCard1 = createCardElement(getRandomCardImage(cardType));
    const dealerCard2 = createCardElement("../Card_Images/Backs/astronaut.png")
    dealerArea.appendChild(dealerCard1);
    dealerArea.appendChild(dealerCard2);
}

function createCardElement(imgSrc) {
    const cardElement = document.createElement(`img`);
    cardElement.src = imgSrc;
    cardElement.classList.add('card', 'image-card');
    cardElement.alt = "Card";
    return cardElement;
}

function getRandomCardImage(cardType) {
    const randomCard = "clubs_2";
    return `../Card_Images/${cardType}/${randomCard}.png`;
}

document.getElementById("cardTypeSelect").addEventListener("change", function() {
    selectedCardType = this.value;
    initializeDeck(selectedCardType);
});

//function initializeDeck(cardType) {
    //
//}

//document.addEventListener('DOMContentLoaded', () => {
    const chips = document.querySelectorAll(".chip");

    for (let i = 0; i < 4; i++) {
        const playerAvatar = sessionStorage.getItem(`player${i + 1}_avatar`);
        if (playerAvatar) {
            document.querySelector(`#player${i + 1} .avatar`).textContent = playerAvatar;
        }
    }

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const betAmount = parseInt(chip.dataset.value);

            const currentBetDisplay = document.querySelector(".current-bet");
            if (currentBetDisplay) {
                const currentBet = parseInt(currentBetDisplay.textContent.replace(/[^0-9]/g, "")) || 0;
                currentBetDisplay.textContent = `Bet: $${currentBet + betAmount}`;
            }

            console.log("Chip clicked with value: ", betAmount);
        });
    });
//});

function updatePlayerCards(playerSeat, cards) {
    const cardContainer = playerSeat.querySelector('.player-cards');
    cardContainer.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerText = `${card.suit}_${card.value}`;
        cardContainer.appendChild(cardElement);
    });
}

//function updatePlayerCards(playerIndex) {
    const player = players[playerIndex];
    const playerElement = playerElements[playerIndex];
    const playerCardsContainer = playerElement.querySelector('.player-cards');
    
    playerCardsContainer.innerHTML = '';

    player.hand.forEach(card => {
        //const cardDiv = document.createElement('div');
        //cardDiv.classList.add('card', 'default-card');
        //cardDiv.textContent = card;
        //playerCardsContainer.appendChild(cardDiv);

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        const cardImg = document.createElement('img');
        cardImg.src = getCardImage(card);
        cardDiv.appendChild(cardImg);
        playerCardsContainer.appendChild(cardDiv);
    });

    updatePlayerPoints(playerIndex);
//}

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
        //cardDiv.textContent = (index === 0) ? '?' : card;
        //dealerArea.appendChild(cardDiv);
        if (index === 0) {
            cardDiv.textContent = '?'; // Hide dealer's first card
        } else {
            const cardImg = document.createElement('img');
            cardImg.src = getCardImage(card);
            cardDiv.appendChild(cardImg);
        }
        dealerArea.appendChild(cardDiv);
    });

    displayDealerPoints();
}

function updateBalances() {
    playerElements.forEach((playerElement, index) => {
        const balanceElement = playerElement.querySelector('.player-info');
        balanceElement.textContent = `$${players[index].balance.toFixed(2)}`;
    });
}

function dealCards() {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    players.forEach(player => {
        player.cards = [
            { value: '8', suit: 'spades'},
            { value: 'queen', suit: 'hearts'}
        ];
    });
    localStorage.setItem('players', JSON.stringify(players));
    updateDisplay();
    //players.forEach(player => player.resetHand());
    dealer.resetHand();

    players.forEach(player => {
        player.hit(dealCard());
        player.hit(dealCard());
    });

    dealer.hit(dealCard());
    dealer.hit(dealCard());

    players.forEach((_, index) => updatePlayerCards(index));
    updateDealerCards();
    //displayDealerPoints();
}

function updatePot(amount) {
    let pot = parseInt(localStorage.getItem('pot')) || 0;
    pot += amount;
    localStorage.setItem('pot', pot.toString());
    document.querySelector('.pot h3').innerText = `Pot: $${pot}`;
}

function updateDisplay() {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    players.forEach((player, index) => {
        const playerSeat = document.querySelector(`#player${index + 1}`);
        if (playerSeat) {
            updatePlayerCards(playerSeat, player.cards);
            playerSeat.querySelector('.player-info').innerText = `$${player.balance}`;
        }
    });
}

buttons.hit.addEventListener('click', function () {
    if (currentPlayerIndex < players.length) {
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
    players[currentPlayerIndex].wager += betAmount;
    const playerBet = players[currentPlayerIndex].bet(betAmount);
    pot += playerBet;
    updateBalances();
    updatePot();
});

playerElements.forEach((playerElement, index) => {
    playerElement.addEventListener('click', () => {
        const player = players[index];
        if (!player.hasJoined) {
            showAvatarAndBetPrompt(player);
            player.hasJoined = true;
        } else {
            const betAmount = parseFloat(prompt(`Enter your bet amount (Max: $${player.balance}):`));
            if (betAmount > 0 && betAmount <= player.balance) {
                player.wager += betAmount;
                player.bet(betAmount);
                pot += betAmount;
                updateBalances();
                updatePot();
            } else {
                alert(`Invalid bet amount.`);
            }
        }
    });
});

function dealCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return `${suit}_${value}`
    //const card = `${value}${suit}`;

    const cardImage = getCardImage(card, selectedCardType);

    //return cardImage;
}

//function ShuffleDeck() {
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
//}

//const chipElements = document.querySelectorAll('.chip');
chipElements.forEach(chip => {
    chip.addEventListener("click", () => {
        const betAmount = parseInt(chip.getAttribute('data-value'), 10);
        handlePlayerBet(betAmount);
    });
//});

function handlePlayerBet(betAmount) {
    const player = players[index];
    if (player.balance >= betAmount) {
        player.bet(betAmount);
        pot += betAmount;
        updateBalances();
        updatePot();
    } else {
        alert(`Insufficient balance to bet $${betAmount}`);
    }
}

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
    nextPlayer();
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
                player.balance += 2 * player.wager;
                winningPlayers.push(player.name);
                dealerWins = false;
            } else if (playerHandValue == dealerValue && dealerValue <= 20) {
                player.balance += player.wager;
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
        window.close();
    }
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

function showAvatarAndBetPrompt(player) {
    const avatarOptions = ['duck', 'panda', 'cat', 'robot', 'woman', 'man', 'wolf', 'bear', 'chicken', 'cow', 'elephant', 'koala', 'lion', 'llama', 'monkey', 'owl', 'penguin', 'pig', 'rabbit', 'sheep', 'snake']
    const avatar = prompt(`Choose your avatar: ${avatarOptions.join(', ')}`);

    if (avatarOptions.includes(avatar)) {
        player.avatar = avatar;
    } else {
        alert(`Invalid avatar selected.`)
        return;
    }

    const avatarImg = document.createElement('img');
    avatarImg.src = `../Avatars/${avatar}.png`;
    avatarImg.alt = avatar;
    avatarImg.classList.add('avatar-img');
    document.querySelector(`#gameoptions-player${players.indexOf(player) + 1} .avatar-circle`).appendChild(avatarImg);
    //const betAmount = parseFloat(prompt(`Enter your bet amount (Max: $${player.balance}):`));
    if (betAmount > 0 && betAmount <= player.balance) {
        player.wager += betAmount;
        player.bet(betAmount);
        pot += betAmount;
        updateBalances();
        updatePot();
    } else {
        alert(`Invalid bet amount.`);
    //}
}

function resetGame() {
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

    players.forEach(player => {
        const betAmount = parseFloat(prompt(`Enter your bet amount (Max: $${player.balance}):`));
        if (betAmount > 0 && betAmount <= player.balance) {
            player.wager += betAmount;
            player.bet(betAmount);
            pot += betAmount;
            updateBalances();
            updatePot();
        } else {
            alert('Invalid bet amount.');
        }
    });
}

document.querySelector(".start-game-btn").addEventListener("click", () => {
    initializePlayers();
    dealCards();
    updateBalances();
    updatePot();
    alert(`Game starting with ${selectedCardType} cards!`);
});*/