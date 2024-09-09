const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

let deck = [];
let deckAmount;
let playerPoints;
let dealerPoints;

function ChooseDeck() {

}

function CreateDeck() {
    for (let i = 0; i < suits.length; i++) {
        for (let l = 0; l < values.length; l++) 
        {
            if(values[l].toString() == "Jack" || values[l].toString() == "Queen" || values[l].toString() == "King") 
            {
                deck.push({Suit: suits[i], Value: 10});
            }
            else if(values[l].toString() == "Ace") 
                {
                    deck.push({Suit: suits[i], Value: 11});
                }
            else {
                deck.push({Suit: suits[i], Value: values[l]});
            }
        }
    }
    deckAmount = deck.length;
}

function DrawCardPlayer() {
    let chosenCard = Math.random() * deckAmount + 1;

    deck[chosenCard];

    deckAmount -= deckAmount;
    const playerCard = document.createElement('img');
    playerCard.setAttribute('src', "/Card_Images/" + deck[chosenCard].Value + "_Of_" + deck[chosenCard].Suit + ".png");
    playerCard.setAttribute('alt', 'Player Card');
    document.body.appendChild(playerCard)

    deck.splice[chosenCard + 1, 1];
    playerPoints += deck[chosenCard].Value;
}

function DrawCardDealer() {
    let chosenCard = Math.random() * deckAmount + 1;

    
    deck.pop[chosenCard];

    deckAmount -= deckAmount;
    dealerPoints += deck[chosenCard].Value;
}

function Stand() {

}

function StartGame()
{
    CreateDeck();
    DrawCardPlayer()();
    DrawCardDealer();
    document.getElementById('HitBtn').style.display = 'block'
    document.getElementById('StandBtn').style.display = 'block'
    document.getElementById('SplitBtn').style.display = 'block'
    document.getElementById('StartBtn').style.display = 'none';
}