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
            //await createCard(params.deckId, formData, signal);
            if(!formData.id) { delete initialFormState.id; }
            const response = (!formData.id) ? await createCard(params.deckId, formData, signal) : await updateCard(formData, signal);
            backToDeckView(response.deckId)
        } catch (error) {
            console.error('Error submitting card:', error);
        } finally {
            setFormData(initialFormState); // Reset the form after submission
        }
    };

    if(loading) {
        return(<p>Loading</p>)
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            {
                !params.cardId ? (
                    <h1>{deck.name}: Add Card</h1>
                ) : (
                    <h1>{deck.name}: Edit Card</h1>
                )
            }
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
            <button onClick={() => backToDeckView(deck.id)}>Done</button>
            <button>Save</button>
        </form>
    </div>
    );
}

export default CardForm;
