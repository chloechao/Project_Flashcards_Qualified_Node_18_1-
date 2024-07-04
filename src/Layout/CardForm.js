import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {createCard, readDeck, updateCard} from "../utils/api";

function CardForm() {
    const params = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);

    const initialFormState = {
        id: 0,
        deckId: 0,
        front: "",
        back: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        async function fetchDeck() {
            try {
                const signal = new AbortController().signal;
                const data = await readDeck(params.deckId, signal);
                const theCard = data.cards.find(card => card.id === parseInt(params.cardId))
                setDeck(data);
                if(theCard) {
                    setFormData({id: theCard.id, deckId:theCard.deckId, front: theCard.front, back: theCard.back});
                }
            } catch (error) {
                console.error('Error fetching deck:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDeck();
    }, [params.deckId, params.cardId]);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    function backToDeckView(deckId) {
        navigate(`/decks/${deckId}`);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const signal = new AbortController().signal;
            if(!formData.id) {
                delete initialFormState.id;
                await createCard(params.deckId, formData, signal)
                setFormData(initialFormState);
            } else {
                const response = await updateCard(formData, signal)
                backToDeckView(response.deckId)
            }
        } catch (error) {
            console.error('Error submitting card:', error);
        }
    };

    if(loading) {
        return(<p>Loading</p>)
    }

    return (
    <div className="container">
        <form onSubmit={handleSubmit}>
            {
                !params.cardId ? (
                    <>
                        <h2>{deck.name}</h2>
                        <h5>Add Card</h5>
                    </>
                ) : (
                    <>
                        <h2>{deck.name}</h2>
                        <h5>Edit Card</h5>
                    </>
                )
            }
            <div className="mb-3">
                <label className="form-label">Front</label>
                <textarea
                    className="form-control"
                    id="front"
                    name="front"
                    placeholder={"Front side of card"}
                    onChange={handleChange}
                    value={formData.front}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Back</label>
                <textarea
                    className="form-control"
                    id="back"
                    name="back"
                    placeholder={"Back side of card"}
                    onChange={handleChange}
                    value={formData.back}
                />
                {
                    !params.cardId ? (
                        // buttons are Done and Save when adding a card
                        <>
                            <button className="btn btn-secondary" style={{margin: '5px'}}
                                    onClick={() => backToDeckView(deck.id)}>Done
                            </button>
                            <button className="btn btn-primary" style={{margin: '5px'}}>Save</button>
                        </>
                    ) : (
                        // buttons are Cancel and Submit when editing the card
                        <>
                            <button className="btn btn-secondary" style={{margin: '5px'}}
                                    onClick={() => backToDeckView(deck.id)}>Cancel
                            </button>
                            <button className="btn btn-primary" style={{margin: '5px'}}>Submit</button>
                        </>
                    )
                }
            </div>
        </form>
    </div>
    );
}

export default CardForm;
