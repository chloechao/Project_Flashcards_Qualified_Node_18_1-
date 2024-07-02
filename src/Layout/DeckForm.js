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
    <div className="container">
        <form onSubmit={handleSubmit}>
            {
                params.deckId ? (
                    <h2>Edit Deck</h2>
                ) : (
                    <h2>Create Deck</h2>
                )
            }
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                    className="form-control"
                    id="name"
                    type="text"
                    name="name"
                    placeholder={"Deck Name"}
                    onChange={handleChange}
                    value={formData.name}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder={"Brief description of the deck"}
                    onChange={handleChange}
                    value={formData.description}
                />
                <button className="btn btn-secondary" style={{margin: '5px'}} onClick={() => cancelHandler(params.deckId)}>Cancel</button>
                <button className="btn btn-primary" style={{margin: '5px'}}>Submit</button>
            </div>
        </form>
    </div>
);
}

export default DeckForm;
