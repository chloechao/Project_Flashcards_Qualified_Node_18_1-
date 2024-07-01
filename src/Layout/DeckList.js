import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listDecks, deleteDeck } from '../utils/api/index';

function DeckList() {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDecks() {
            try {
                const signal = new AbortController().signal;
                const data = await listDecks(signal);
                setDecks(data);
            } catch (error) {
                console.error('Error fetching decks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDecks();
    }, []); // Empty dependency array means this effect runs once after the initial render


    function createDeck() {
        navigate("/deck/new");
    }

    function studyDeck(deckId) {
        navigate(`/decks/${deckId}/study`);
    }

    function viewDeck(deckId) {
        navigate(`/decks/${deckId}`);
    }

    async function handleDelete(deckId) {
        if (window.confirm("Are you sure you want to delete this deck?")) {
            try {
                const signal = new AbortController().signal;
                await deleteDeck(deckId, signal);
                // Update the state to remove the deleted deck
                setDecks((currentDecks) => currentDecks.filter(deck => deck.id !== deckId));
            } catch (error) {
                console.error('Error deleting deck:', error);
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <button onClick={createDeck}>Create Deck</button>
            </div>
            {/* Display decks if there is data */}
            {decks.length > 0 ? (
                <div>
                    {decks.map((deck) => (
                        <div key={deck.id}>
                            <h2>{deck.name}</h2>
                            <p>{deck.description}</p>
                            <br/>
                            <button onClick={() => viewDeck(deck.id)}>View</button>
                            <button onClick={() => studyDeck(deck.id)}>Study</button>
                            <button onClick={() => handleDelete(deck.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No decks available</div>
            )}
        </>
    );
}

export default DeckList;
