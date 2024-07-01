import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {createDeck, readDeck, updateDeck} from "../utils/api";

function DeckForm() {
    const navigate = useNavigate();
    const params = useParams();

    const initialFormState = {
        name: "",
        description: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        async function fetchDeck() {
            try {
                if(params.deckId) {
                    const signal = new AbortController().signal;
                    const data = await readDeck(params.deckId, signal);
                    setFormData(data);
                }
            } catch (error) {
                console.error('Error fetching deck:', error);
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
            const response = (params.deckId) ? await updateDeck(formData, signal) : await createDeck(formData, signal);
            navigate(`/decks/${response.id}`);
        } catch (error) {
            console.error('Error submitting deck:', error);
        } finally {
            setFormData(initialFormState); // Reset the form after submission
        }
    };

    function cancelHandler(deckId) {
        if(deckId) {
            navigate(`/decks/${deckId}`);
        } else {
            navigate("/");
        }
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            {
                params.deckId ? (
                    <h1>Edit Deck</h1>
                ) : (
                    <h1>Create Deck</h1>
                )
            }
            <p>Name</p>
            <input
                id="name"
                type="text"
                name="name"
                placeholder={"Deck Name"}
                onChange={handleChange}
                value={formData.name}
            />
            <br/>
            <p>Description</p>
            <textarea
                id="description"
                name="description"
                placeholder={"Brief description of the deck"}
                onChange={handleChange}
                value={formData.description}
            />
            <br/>
            {
                params.deckId ? (
                    <button onClick={() => cancelHandler(params.deckId)}>Cancel</button>
                ) : (
                    <button onClick={cancelHandler}>Cancel</button>
                )
            }
            <button>Submit</button>
        </form>
    </div>
    );
}

export default DeckForm;
