import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { readDeck } from "../utils/api";

function Study() {
    const params = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cardNum, setCardNum] = useState(1);
    const [isFront, setIsFront] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDeck() {
            try {
                const signal = new AbortController().signal;
                const data = await readDeck(params.deckId, signal);
                setDeck(data);
            } catch (error) {
                console.error('Error fetching deck:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDeck();
    }, [params.deckId]);

    function flipHandler() {
        setIsFront(!isFront);
    }

    function handleNext() {
        if(cardNum < deck.cards.length) {
            setCardNum(cardNum + 1)
        }
        else{
            if (window.confirm("Click OK to restart or Cancel to return to the home page")) {
                setCardNum(1)
                setIsFront(true)
            } else {
                navigate("/");
            }
        }
    }

    function addCardHandler(deckId) {
        navigate(`/decks/${deckId}/cards/new`);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (deck.cards.length <= 2) {
        return (
            <div className="Study">
                <h1>Study: {deck.name}</h1>
                <h2>Not enough cards</h2>
                <p>You need at least 3 cards to study. There are {deck.cards.length} cards in the deck.</p>
                <br/>
                <button onClick={() => addCardHandler(deck.id)}>Add Cards</button>
            </div>
        );
    }

    const card = deck.cards[cardNum - 1];
    const cardContent = isFront ? card.front : card.back;
    return (
        <div className="Study">
            <h1>Study: {deck.name}</h1>
            <h2>Card {cardNum} of {deck.cards.length}</h2>
            <p>{cardContent}</p>
            <button onClick={() => setIsFront(!isFront)}>Flip</button>
            {!isFront && <button onClick={handleNext}>Next</button>}
        </div>
    );
}

export default Study;
