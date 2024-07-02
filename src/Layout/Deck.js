import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {readDeck} from '../utils/api/index';
import {deleteDeckCall, deleteCardCall} from "../utils/apiCalls";

function Deck() {
    const navigate = useNavigate();
    const params = useParams();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDeck() {
            try {
                const signal = new AbortController().signal;
                const data = await readDeck(params.deckId, signal);
                setDeck(data);
                setCards(data.cards)
            } catch (error) {
                console.error('Error fetching deck:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDeck();
    }, [params.deckId]);

    async function deleteDeckHandler(deckId) {
        const response = await deleteDeckCall(deckId);
        if(response === undefined) {
            navigate(`/decks/${deckId}`);
        } else {
            navigate(`/`);
        }
    }

    async function deleteCardHandler(cardId) {
        const response = await deleteCardCall(cardId)
        if(response !== undefined) {
            setCards((currentCards) => currentCards.filter(card => card.id !== cardId));
        }
    }

    function editDeckHandler(deckId) {
        navigate(`/decks/${deckId}/edit`);
    }

    function studyHandler(deckId) {
        navigate(`/decks/${deckId}/study`);
    }

    function addCardHandler(deckId) {
        navigate(`/decks/${deckId}/cards/new`);
    }

    function editCardHandler(deckId, cardId) {
        navigate(`/decks/${deckId}/cards/${cardId}/edit`);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!deck) {
        return <div>Deck does not exist</div>;
    }

    return (
        <>
        {deck &&
            <>
            <p>{deck.name}</p>
            <p>{deck.description}</p>
            <br/>
            <button onClick={() => editDeckHandler(deck.id)}>Edit</button>
            <button onClick={() => studyHandler(deck.id)}>Study</button>
            <button onClick={() => addCardHandler(deck.id)}>Add Cards</button>
            <button onClick={() => deleteDeckHandler(deck.id)}>Delete</button>
            <p></p>
            <h1>Cards</h1>
            {
                cards.map((card) => (
                    <React.Fragment key={card.id}>
                    <p>{card.front}</p>
                    <p>{card.back}</p>
                    <button onClick={() => editCardHandler(deck.id, card.id)}>Edit</button>
                    <button onClick={() => deleteCardHandler(card.id)}>Delete</button>
                    </React.Fragment>
                ))
            }
            </>
        }
        </>
    );
}

export default Deck;
