import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDeck } from "../utils/api";

function DeckForm() {
    const navigate = useNavigate();
    const initialFormState = {
        name: "",
        description: ""
    };
    const [formData, setFormData] = useState(initialFormState);

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
            const response = await createDeck(formData, signal);
            navigate(`/decks/${response.id}`);
        } catch (error) {
            console.error('Error submitting deck:', error);
        } finally {
            setFormData(initialFormState); // Reset the form after submission
        }
    };

    function cancelHandler() {
        navigate("/");
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <h1>Create Deck</h1>
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
                placeholder={"Brief desciption of the deck"}
                onChange={handleChange}
                value={formData.description}
            />
            <br/>
            <button onClick={cancelHandler}>Cancel</button>
            <button>Submit</button>
        </form>
    </div>
    );
}

export default DeckForm;
