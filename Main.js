const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;
let gameStatus = "";
let playerStand = false;

function ChooseDeck() {

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
    
}

function DrawCardPlayer() {
    let chosenCard = Math.floor(Math.random() * deck.length);
    let card = deck.pop(chosenCard);
    
    if (card) {
        const playerCard = document.createElement('IMG');
        playerCard.setAttribute('src', "/Card_Images/" + card.Type + "_Of_" + card.Suit + ".png");
        playerCard.setAttribute('alt', 'Player Card');
        document.body.appendChild(playerCard)
        
        playerPoints += card.Value;
        playerHand.push(card);
    }
    else {
        alert("Chosen card is undefined!");
    }
    CalculatePoints();
}

function DrawCardDealer() {
    let chosenCard = Math.floor(Math.random() * deck.length);
    let card = deck.pop(chosenCard);
    
    if (card) {
        const playerCard = document.createElement('IMG');
        playerCard.setAttribute('src', "/Card_Images/" + card.Type + "_Of_" + card.Suit + ".png");
        playerCard.setAttribute('alt', 'Player Card');
        document.body.appendChild(playerCard)
        
        dealerPoints += card.Value;
        dealerHand.push(card);
    }
    else {
        alert("Chosen card is undefined!");
    }
    CalculatePoints();
}

function Stand() {
    playerStand = true;
}

function CalculatePoints() {
    for(card in playerHand) {
        if(card.Type == "Ace" && playerPoints >= 11) {
            playerPoints += 1;
        }
        else {
            playerPoints += card.Value
        }
    }
    if (playerStand) {
        if(playerpoints == 21 && dealerPoints == 21) {
            gameStatus = "Dealer Wins!!";
        }
        else if (playerPoints >= 22 && dealerPoints <= 21) {
            gameStatus = "Dealer Wins!!";
        }
        else if (playerPoints < 22 && playerPoints > dealerPoints ) {
            gameStatus = "Player Wins!!";
        }
        else if (dealerPoints >= 22 && playerPoints <= 21) {
            gameStatus = "Player Wins!!";
        }
    }
}

function StartGame()
{
    CreateDeck();
    DrawCardPlayer();
    DrawCardPlayer();
    document.getElementById('DeckSize').style.display = 'block'
    document.getElementById('HitBtn').style.display = 'block'
    document.getElementById('StandBtn').style.display = 'block'
    document.getElementById('SplitBtn').style.display = 'block'
    document.getElementById('StartBtn').style.display = 'none';
}