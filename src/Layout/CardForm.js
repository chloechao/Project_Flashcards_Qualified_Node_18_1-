import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {createCard, readDeck} from "../utils/api";

function CardForm() {
    const params = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);

    const initialFormState = {
        front: "",
        back: ""
    };
    const [formData, setFormData] = useState(initialFormState);

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

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // call API to create a card of the deck
            const signal = new AbortController().signal;
            await createCard(params.deckId, formData, signal);
        } catch (error) {
            console.error('Error submitting card:', error);
        } finally {
            setFormData(initialFormState); // Reset the form after submission
        }
    };

    function doneHandler(deckId) {
        navigate(`/decks/${deckId}`);
    }

    if(loading) {
        return(<p>Loading</p>)
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <h1>{deck.name}: Add Card</h1>
            <p>Front</p>
            <textarea
                id="front"
                name="front"
                placeholder={"Front side of card"}
                onChange={handleChange}
                value={formData.front}
            />
            <br/>
            <p>Back</p>
            <textarea
                id="back"
                name="back"
                placeholder={"Back side of card"}
                onChange={handleChange}
                value={formData.back}
            />
            <br/>
            <button onClick={() => doneHandler(deck.id)}>Done</button>
            <button>Save</button>
        </form>
    </div>
    );
}

export default CardForm;
