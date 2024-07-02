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
        <div className="container">
        {deck &&
            <>
            <h2>{deck.name}</h2>
            <p>{deck.description}</p>
                <div>
                    <div>
                        <button onClick={() => editDeckHandler(deck.id)} className="btn btn-secondary"
                                style={{margin: '5px'}}>Edit
                        </button>
                        <button onClick={() => studyHandler(deck.id)} className="btn btn-primary"
                                style={{margin: '5px'}}>Study
                        </button>
                        <button onClick={() => addCardHandler(deck.id)} className="btn btn-primary"
                                style={{margin: '5px'}}>Add Cards
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => deleteDeckHandler(deck.id)} className="btn btn-danger"
                                style={{margin: '5px', display: 'flex', justifyContent: 'flex-end'}}>Delete
                        </button>
                    </div>
                </div>
                <p></p>
                <h1>Cards</h1>
                {
                    cards.map((card) => (
                        <div className="card">
                            <div key={card.id} className="card-body" style={{
                                display: 'flex',
                                justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
                            <div>
                                <p>{card.front}</p>
                            </div>
                            <div>
                                <p>{card.back}</p>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => editCardHandler(deck.id, card.id)} className="btn btn-secondary" style={{ margin: '5px' }}>Edit</button>
                                    <button onClick={() => deleteCardHandler(card.id)} className="btn btn-danger" style={{ margin: '5px' }}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
            </>
        }
        </div>
    );
}

export default Deck;
