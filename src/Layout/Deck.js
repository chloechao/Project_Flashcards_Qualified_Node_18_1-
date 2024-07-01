import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {deleteDeck, readDeck} from '../utils/api/index';

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


    async function handleDelete(deckId) {
        if (window.confirm("Are you sure you want to delete this deck?")) {
            try {
                const signal = new AbortController().signal;
                await deleteDeck(deckId, signal);
                // Update the state to remove the deleted deck
                setDeck((currentDecks) => currentDecks.filter(deck => deck.id !== deckId));
            } catch (error) {
                console.error('Error deleting deck:', error);
            }
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
            <button>Delete</button>
            <p></p>
            <h1>Cards</h1>
            {
                deck.cards.map((card) => (
                    <React.Fragment key={card.id}>
                    <p>{card.front}</p>
                    <p>{card.back}</p>
                    <button>Edit</button>
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
