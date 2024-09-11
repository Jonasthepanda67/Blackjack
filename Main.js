import {Dealer} from "./dealer.js";
import {Player} from "./player.js";
const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
const dealer = new Dealer();

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;
let gameStatus = "";
let playerStand = false;
let hiddenDealerCard = null;
let Username = "";
let playerChips = 0;
let potTotal = 0;

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
        alert("No more cards in the deck. Reshuffling deck...");
        ChooseDeck();
        DrawCardPlayer();
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
                
                dealer.Points += card.Value;
                dealer.Hand.push(card);
                CalculatePoints();
            }
        }
        else {
            alert("No more cards in the deck. Reshuffling deck...");
            ChooseDeck();
            DrawCardDealer();
        }    
    
    document.getElementById('DeckSize').innerText = 'Deck size: ' + deck.length;
}

function Stand() {
    playerStand = true;

    RevealHiddenDealerCard();

    document.getElementById('HiddenDealerCard').style.display = 'none';

    while (dealer.Points < 17 || dealer.Points < playerPoints) {
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

        dealer.Points += hiddenDealerCard.Value;
        dealer.Hand.push(hiddenDealerCard);
        hiddenDealerCard = null;
    }
}

function CalculatePoints() {
    playerPoints = 0;
    dealer.Points = 0;

    for (let card of playerHand) {
        if (card.Type === "Ace" && playerPoints >= 11) {
            playerPoints += 1;
        } else {
            playerPoints += card.Value;
        }
    }

    for (let card of dealer.Hand) {
        if (card.Type === "Ace" && dealer.Points >= 11) {
            dealer.Points += 1;
        } else {
            dealer.Points += card.Value;
        }
    }

    document.getElementById("PlayerPoints").innerText = playerPoints;
    document.getElementById("DealerPoints").innerText = dealer.Points;

    if (playerPoints >= 21 || playerStand) {
        CheckWinner();
    }
}

function CheckWinner() {
    if (dealer.Points < 17 && playerPoints == 21){
        Stand();
    }

    if (playerPoints < dealer.Points && dealer.Points <= 21) {
        gameStatus = 'Dealer Wins!!';
    } else if (playerPoints > dealer.Points && playerPoints <= 21) {
        playerChips += Math.round(potTotal + potTotal);
        gameStatus = 'Plaer Wins!!!';
    } else if (playerPoints === 21 && dealer.Points === 21) {
        gameStatus = 'Dealer Wins!!';
    } else if (playerPoints == dealer.Points) {
        playerChips = playerChips + potTotal;
        gameStatus = "Its a draw!";
    } else if (playerPoints >= 22 && dealer.Points <= 21) {
        gameStatus = 'Dealer Wins!!';
    } else if (playerPoints <= 21 && dealer.Points >= 22) {
        playerChips += Math.round(potTotal + potTotal);
        gameStatus = 'Player Wins!!!';
    }

    document.getElementById('HitBtn').style.display = 'none'
    document.getElementById('StandBtn').style.display = 'none'
    document.getElementById('SplitBtn').style.display = 'none'
    document.getElementById('NewGameBtn').style.display = 'block';
    document.getElementById('GameStatus').innerText = gameStatus;
}

function InsertUsername() {
    Username = document.forms['UsernameForm']['Username'].value;
    if (Username.trim() == '') {
        Username = 'Anonymous';
    }
    if (Username.length > 16) {
        alert('Username is too long please try again...');
    }
    else {
        document.getElementById('User').innerHTML = 'Username: ' + Username;
        document.getElementById('User').style.display = 'block';
    }
}

function RemovePreviousCards() {
    dealer.Hand = [];
    playerHand = [];
    dealer.Points = 0;
    playerPoints = 0;
    gameStatus = "";
    playerStand = false;
    potTotal = 0;

    document.getElementById('GameStatus').innerText = gameStatus;
    document.getElementById('PotTotal').innerText = 'Total amount bet: 0';
    document.querySelectorAll(".CardImage").forEach(card => card.remove());
}

function PlaceBet(amount) {
    if (playerChips < amount) {
        alert("You don't have enough chips to bet this amount");
    }
    else {
        potTotal += amount;
        playerChips -= amount;
        document.getElementById('PotTotal').innerText = 'Total amount bet: ' + potTotal;
    }
}

function StartGame()
{
    playerChips = 200;
    document.getElementById('PlayerChipsTotal').innerText = 'Player chip total: ' + playerChips;

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
    document.getElementById('PlayerChipsTotal').innerText = 'Player chip total: ' + playerChips;

    DrawCardPlayer();
    DrawCardPlayer();

    DrawCardDealer();
    DrawCardDealer(true);

    if (playerPoints == 21 && dealer.Points >= 22) {
        document.getElementById('NewGameBtn').style.display = 'block';
        document.forms['UsernameForm'].style.display = 'none';
        document.getElementById('DeckSize').innerText = 'Deck size: ' + deck.length;
        document.getElementById('DeckSize').style.display = 'block'
    }
    else {
        document.forms['UsernameForm'].style.display = 'none';
        document.getElementById('DeckSize').innerText = 'Deck size: ' + deck.length;
        document.getElementById('DeckSize').style.display = 'block'
        document.getElementById('HitBtn').style.display = 'block'
        document.getElementById('StandBtn').style.display = 'block'
        document.getElementById('SplitBtn').style.display = 'block'
        document.getElementById('StartBtn').style.display = 'none';
        document.getElementById('NewGameBtn').style.display = 'none';
    }

}

document.getElementById('StartBtn').addEventListener('click', StartGame);
document.getElementById('NewGameBtn').addEventListener('click', NewGame);
document.getElementById('HitBtn').addEventListener('click', DrawCardPlayer);
document.getElementById('StandBtn').addEventListener('click', Stand);
document.getElementById('SplitBtn').addEventListener('click', Split);
/*document.getElementById('UsernameForm').addEventListener('submit', ValidateUsername);*/