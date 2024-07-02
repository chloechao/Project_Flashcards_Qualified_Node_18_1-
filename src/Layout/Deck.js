import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {readDeck} from '../utils/api/index';
import {deleteDeckCall} from "../utils/apiCalls";

function Deck() {
    const navigate = useNavigate();
    const params = useParams();

    const [deck, setDeck] = useState(null);
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

    async function deleteHandler(deckId) {
        const response = await deleteDeckCall(deckId);
        if(response === undefined) {
            navigate(`/decks/${deckId}`);
        } else {
            navigate(`/`);
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
            <h2>{deck.name}</h2>
            <p>{deck.description}</p>
            <br/>
            <button onClick={() => editDeckHandler(deck.id)}>Edit</button>
            <button onClick={() => studyHandler(deck.id)}>Study</button>
            <button onClick={() => addCardHandler(deck.id)}>Add Cards</button>
            <button onClick={() => deleteHandler(deck.id)}>Delete</button>
            <p></p>
            <h1>Cards</h1>
            {
                deck.cards.map((card) => (
                    <React.Fragment key={card.id}>
                    <p>{card.front}</p>
                    <p>{card.back}</p>
                    <button onClick={() => editCardHandler(deck.id, card.id)}>Edit</button>
                    <button>Delete</button>
                    </React.Fragment>
                ))
            }
            </>
        }
        </>
    );
}

export default Deck;
