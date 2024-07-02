import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listDecks } from '../utils/api/index';
import { deleteDeckCall }  from '../utils/apiCalls'

function DeckList() {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDecks() {
            try {
                const signal = new AbortController().signal;
                const data = await listDecks(signal);
                console.log(data)
                setDecks(data);
            } catch (error) {
                console.error('Error fetching decks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDecks();
    }, []); // Empty dependency array means this effect runs once after the initial render

    async function deleteHandler(deckId) {
        const response = await deleteDeckCall(deckId);
        if(response !== undefined) {
            setDecks((currentDecks) => currentDecks.filter(deck => deck.id !== deckId));
        }
    }

    function createDeck() {
        navigate("/decks/new");
    }

    function studyDeck(deckId) {
        navigate(`/decks/${deckId}/study`);
    }

    function viewDeck(deckId) {
        navigate(`/decks/${deckId}`);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (

        <div className="container">
            <div>
                <button className="btn btn-secondary" onClick={createDeck}>Create Deck</button>
            </div>
            {decks.length > 0 ? (
                <div>
                    {decks.map((deck) => (
                        <div className="card">
                            <div key={deck.id}  className="card-body">
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <h5 className="card-title">{deck.name}</h5>
                                    <p>{deck.cards.length} cards</p>
                                </div>
                                <h6 className="card-subtitle mb-2 text-body-secondary">{deck.description}</h6>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        <button className="btn btn-secondary" style={{margin: '5px'}}
                                                onClick={() => viewDeck(deck.id)}>View
                                        </button>
                                        <button className="btn btn-primary" style={{margin: '5px'}}
                                                onClick={() => studyDeck(deck.id)}>Study
                                        </button>
                                    </div>
                                    <button className="btn btn-danger"
                                            onClick={() => deleteHandler(deck.id)}>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No decks available</div>
            )}
        </div>
    );
}

export default DeckList;
