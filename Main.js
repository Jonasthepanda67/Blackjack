const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;
let gameStatus = "";
let playerStand = false;
let hiddenDealerCard = null;
let Username = "";

function ChooseDeck() {
    deck = [];
    for (let i = 0; i < 3; i++) {
        CreateDeck();
    }
    ShuffleDeck();
}

function CreateDeck() {
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

function ShuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const l = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[l]] = [deck[l], deck[i]];
    }
}

function DrawCardPlayer() {
    let chosenCard = Math.floor(Math.random() * deck.length);
    let card = deck.pop(chosenCard);
    
    if (card) {
        const playerCard = document.createElement('IMG');
        playerCard.setAttribute('src', "/Card_Images/" + card.Type + "_Of_" + card.Suit + ".png");
        playerCard.setAttribute('alt', 'Player Card');
        playerCard.setAttribute('class', 'CardImage');
        document.getElementById('PlayerCards').appendChild(playerCard)
        
        playerPoints += card.Value;
        playerHand.push(card);
    }
    else {
        alert("Chosen card is undefined!");
    }
    CalculatePoints();

    document.getElementById('DeckSize').innerText = 'Deck size: ' + deck.length;
}

function DrawCardDealer(hidden = false) {
    let chosenCard = Math.floor(Math.random() * deck.length);
    let card = deck.pop(chosenCard);
    
    if (card) {
        if (hidden) {
            hiddenDealerCard = card;
        }
        else {
            const dealerCard = document.createElement('IMG');
            dealerCard.setAttribute('src', "/Card_Images/" + card.Type + "_Of_" + card.Suit + ".png");
            dealerCard.setAttribute('alt', 'Dealer Card');
            dealerCard.setAttribute('class', 'CardImage');
            document.getElementById('DealerRevealedCards').appendChild(dealerCard);
            
            dealerPoints += card.Value;
            dealerHand.push(card);
            CalculatePoints();
        }
    }
    else {
        alert("Chosen card is undefined!");
    }

    document.getElementById('DeckSize').innerText = 'Deck size: ' + deck.length;
}

function Stand() {
    playerStand = true;

    RevealHiddenDealerCard();

    document.getElementById('HiddenDealerCard').style.display = 'none';

    while (dealerPoints < 17 || dealerPoints < playerPoints) {
        DrawCardDealer();
    }

    CalculatePoints();
}

function Split() {

}

function RevealHiddenDealerCard() {
    if (hiddenDealerCard) {
        const revealedCard = document.createElement('IMG');
        revealedCard.setAttribute('src', "/Card_Images/" + hiddenDealerCard.Type + "_Of_" + hiddenDealerCard.Suit + ".png");
        revealedCard.setAttribute('alt', 'Dealer Card');
        revealedCard.setAttribute('class', 'CardImage');
        document.getElementById('DealerRevealedCards').appendChild(revealedCard);

        dealerPoints += hiddenDealerCard.Value;
        dealerHand.push(hiddenDealerCard);
        hiddenDealerCard = null;
    }
}

function CalculatePoints() {
    playerPoints = 0;
    dealerPoints = 0;

    for (let card of playerHand) {
        if (card.Type === "Ace" && playerPoints >= 11) {
            playerPoints += 1;
        } else {
            playerPoints += card.Value;
        }
    }

    for (let card of dealerHand) {
        if (card.Type === "Ace" && dealerPoints >= 11) {
            dealerPoints += 1;
        } else {
            dealerPoints += card.Value;
        }
    }

    document.getElementById("PlayerPoints").innerText = playerPoints;
    document.getElementById("DealerPoints").innerText = dealerPoints;

    if (playerPoints >= 21 || playerStand) {
        CheckWinner();
    }
}

function CheckWinner() {
    if (dealerPoints < 17 && playerPoints == 21){
        Stand();
    }

    if (playerPoints < dealerPoints && dealerPoints <= 21) {
        gameStatus = 'Dealer Wins!!';
    } else if (playerPoints > dealerPoints && playerPoints <= 21) {
        gameStatus = 'Plaer Wins!!!';
    } else if (playerPoints === 21 && dealerPoints === 21) {
        gameStatus = 'Dealer Wins!!';
    } else if (playerPoints == dealerPoints) {
        gameStatus = "Its a draw!";
    } else if (playerPoints >= 22 && dealerPoints <= 21) {
        gameStatus = 'Dealer Wins!!';
    } else if (playerPoints <= 21 && dealerPoints >= 22) {
        gameStatus = 'Player Wins!!!';
    }

    document.getElementById('HitBtn').style.display = 'none'
    document.getElementById('StandBtn').style.display = 'none'
    document.getElementById('SplitBtn').style.display = 'none'
    document.getElementById('NewGameBtn').style.display = 'block';
    document.getElementById('GameStatus').innerText = gameStatus;
}

function ValidateUsername() {
    let u = document.forms['UsernameForm']['Username'].value;
    u = u.trim();
    if (u.length >= 16) {
        alert('Name must not be longer than 16 characters...');
        return false;
    }
}

function InsertUsername() {
    Username = document.forms['UsernameForm']['Username'].value;
    if (Username.trim() == '') {
        Username = 'Anonymous';
    }
    else {
        alert('You have chosen: ' + Username + ' as your Username');
    }

    document.getElementById('User').innerHTML = 'Username: ' + Username;
    document.getElementById('User').style.display = 'block';
}

function RemovePreviousCards() {
    dealerHand = [];
    playerHand = [];
    dealerPoints = 0;
    playerPoints = 0;
    gameStatus = "";
    playerStand = false;

    document.getElementById('GameStatus').innerText = gameStatus;
    document.querySelectorAll(".CardImage").forEach(card => card.remove());
}

function StartGame()
{
    InsertUsername();

    ChooseDeck();

    DrawCardPlayer();
    DrawCardPlayer();

    DrawCardDealer();
    DrawCardDealer(true);

    document.forms['UsernameForm'].style.display = 'none';
    document.getElementById('DeckSize').innerText = 'Deck size: ' + deck.length;
    document.getElementById('DeckSize').style.display = 'block'
    document.getElementById('HitBtn').style.display = 'block'
    document.getElementById('StandBtn').style.display = 'block'
    document.getElementById('SplitBtn').style.display = 'block'
    document.getElementById('StartBtn').style.display = 'none';
}

function NewGame() {
    RemovePreviousCards();

    DrawCardPlayer();
    DrawCardPlayer();

    DrawCardDealer();
    DrawCardDealer(true);

    document.forms['UsernameForm'].style.display = 'none';
    document.getElementById('DeckSize').innerText = 'Deck size: ' + deck.length;
    document.getElementById('DeckSize').style.display = 'block'
    document.getElementById('HitBtn').style.display = 'block'
    document.getElementById('StandBtn').style.display = 'block'
    document.getElementById('SplitBtn').style.display = 'block'
    document.getElementById('StartBtn').style.display = 'none';
    document.getElementById('NewGameBtn').style.display = 'none';
}