// Displays title of app
function Title() {
    return <h1> Deck of 52 Cards Simulation </h1>
}






// Helper function that generates a deck of 52 cards
function GenerateDeck() {
    let suits = ["♥", "♦", "♣", "♠"];
    let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            deck.push({ rank: ranks[j], suit: suits[i] });
        }
    }

    return deck;
}






// Manages the clicking of the deck of cards
function Cards() {
    let deck = GenerateDeck();
    const [undrawnCards, setUndrawnCards] = React.useState(deck);
    const [drawnCards, setDrawnCards] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = React.useState(null); // If selectedCardIndex is set to null, it means a card hasn't been selected yet

    // When user clicks on a card, remove that card from the undrawn array/state variable of cards and into the drawnCards array
    function Draw() {
        let randomCardIndex = Math.floor(Math.random() * undrawnCards.length);
        let randomCard = undrawnCards[randomCardIndex];
        let remaining = [];
        for (let i = 0; i < undrawnCards.length; i++) {
            // Everybody except the randomly chosen card
            if (i != randomCardIndex) {
                remaining.push(undrawnCards[i]);
            }
        }

        setUndrawnCards(remaining);
        let newDrawnCards = [...drawnCards];
        newDrawnCards.push(randomCard);
        setDrawnCards(newDrawnCards);
    }

    // Displays 5 or 7 cards
    function Draw5or7(totalCards) {
        let cardsCurrentlyDisplayed = [...drawnCards]; // [card1, card2, card10...]
        let cardsNotDisplayed = [...undrawnCards]; // [49 cards not card1, card2 or card10]
        if (cardsCurrentlyDisplayed.length > 0) {
            for (let i = 0; i < cardsCurrentlyDisplayed.length; i++) {
                cardsNotDisplayed.push(cardsCurrentlyDisplayed[i]); // i.e. add the cards that are currently shown in the drawnCards state variable back into the undrawnCards state variable
            }
        }

        setUndrawnCards(cardsNotDisplayed);
        setDrawnCards([]);

        // Now select 5 or 7 cards at random:
        let randomCardsIndices = [];
        let randomCards = [];
        let randomlyDrawnCards = [...undrawnCards];
        let n = totalCards;

        let errorState = false;
        if (n > randomlyDrawnCards.length) {
            errorState = true;
            setError(errorState);
            return;
        } else {
            while (n > 0) {
                let r = Math.floor(Math.random() * randomlyDrawnCards.length);
                if (randomCardsIndices.includes(r) == false) {
                    randomCardsIndices.push(r);
                    randomCards.push(randomlyDrawnCards[r]);
                    n--;
                }
            }
            let notPicked = [];
            for (let i = 0; i < randomlyDrawnCards.length; i++) {
                let same = false;
                for (let j = 0; j < randomCardsIndices.length; j++) {
                    if (randomlyDrawnCards[i] == randomCardsIndices[j]) {
                        same = true;
                    }
                }
                if (same == false) {
                    notPicked.push(randomlyDrawnCards[i]);
                }
            }

            setDrawnCards(randomCards);
            setUndrawnCards(notPicked);
        }
    }

    // Removes all cards that are currently displayed
    function Reset() {
        let displayedCards = [...drawnCards];
        let nonDisplayedCards = [...undrawnCards];

        for (let i = 0; i < displayedCards.length; i++) {
            nonDisplayedCards.push(displayedCards[i]);
        }

        setUndrawnCards(nonDisplayedCards);
        setDrawnCards([]);
    }

    // Shuffles the currently drawn cards
    function Regroup() {
        let shuffledDrawnCards = [...drawnCards];
        for (let i = 0; i < shuffledDrawnCards.length; i++) {
            let ran = Math.floor(Math.random() * shuffledDrawnCards.length);

            let tempCard = shuffledDrawnCards[ran];
            shuffledDrawnCards[ran] = shuffledDrawnCards[i];
            shuffledDrawnCards[i] = tempCard;
        }

        setDrawnCards(shuffledDrawnCards);
    }

    // Randomly selecting a suit/value from the generated deck2 array
    function WildCard() {
        let deck2 = GenerateDeck();
        let wildCardRandom = Math.floor(Math.random() * deck2.length);
        let drawnCardsPlusWildCard = [...drawnCards];
        drawnCardsPlusWildCard.push(deck2[wildCardRandom]);

        setDrawnCards(drawnCardsPlusWildCard);
    }

    // Manages the selection of a drawn card - index is the position of the card in the drawn cards array
    function Selection(index) {
        if (selectedCardIndex == null) {
            setSelectedCardIndex(index); // Meaning no cards have been selected, therefore when it gets selected, highlight the index/card inside the drawn cards array (done through the wasSelected prop value)
        } else if (index == selectedCardIndex) {
            setSelectedCardIndex(null); // Removes the highlight as the same card was selected
        } else {
            // index and selected card index are different therefore swap them
            setSelectedCardIndex(index);
            let d = [...drawnCards];
            let temp = d[selectedCardIndex];
            d[selectedCardIndex] = d[index];
            d[index] = temp;
            setDrawnCards(d);
            setSelectedCardIndex(null);
        }

    }

    // When a card is clicked/highlighted and the toss button is pressed, throw it in the garbage
    function Toss() {
        let cardToThrowOut = drawnCards[selectedCardIndex];
        let finallyyy = [];
        for (let i = 0; i < drawnCards.length; i++) {
            if(drawnCards[i] != cardToThrowOut) {
                finallyyy.push(drawnCards[i]);
            }
        }

        setDrawnCards(finallyyy);
        setSelectedCardIndex(null);
    }

    // Reached the end of the deck of cards
    let cardToClick = <div className="card" onClick={() => Draw()}> </div>;
    if (undrawnCards.length == 0) {
        cardToClick = <div className="no-more-cards"> <p className="notify"> No Cards Remaining </p> </div>;
    }

    // For every card in the drawnCards state variable, call the function/component Card to display the randomly drawn cards in the drawnCards state variable

    // Every card component has an onclick event attached to it called Selection
    
    // When it gets executed, the index of that card gets passed in the Selection function and manages the state. So if a card gets clicked, and the state variable selectedCardIndex was already set to null, this means that a card hasn't been picked yet, but because the onclick event executes, the index of the card that triggered the onclick event gets highlighted. If another click occurs while a card is highlighted, and say it's on the same card that was clicked, ***because the state variable value is not null it deselects that card***. And the swap part, if its not null and its not the same index, swap them.

    return (
        <div>
            <h2 className="buttons2">
                <button className="button-74" onClick={() => Draw5or7(5)}>Draw 5</button>
                <button className="button-74" onClick={() => Draw5or7(7)}>Draw 7</button>
                <button className="button-74" onClick={() => Regroup()}>Regroup</button>
                <button className="button-74" onClick={() => WildCard()}>Wildcard</button>
                <button className="button-74" onClick={() => Toss()}>Toss</button>
                <button className="button-74" onClick={() => Reset()}>Reset</button>
            </h2>
            {cardToClick}
            <ul className="listed-cards">
                {drawnCards.map((card, index) =>
                    <Card key={index} rank={card.rank} suit={card.suit} onClick={() => Selection(index)} wasSelected={index == selectedCardIndex} />
                )}
            </ul>
        </div>
    )
}






// Creates a card component
function Card(props) {
    let style = { color: "black" };
    let style2 = { border: "2px solid black" };

    if (props.suit == "♥" || props.suit == "♦") {
        style.color = "red";
    }

    if (props.wasSelected) {
        style2.border = "2px solid cyan";
    }

    // Every card will have an onClick event that checks if it's been selected
    return (
        <div className="pulled-card" style={style2} onClick={props.onClick}>
            <li className="rank" style={style}> {props.rank} </li>
            <li className="suit" style={style}> {props.suit} </li>
        </div>
    )
}





// Parent component
function App() {
    return (
        <div>
            <Title />
            <Cards />
        </div>
    )
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
