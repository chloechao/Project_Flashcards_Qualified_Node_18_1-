import React from "react";
import {useNavigate} from "react-router-dom";

function DeckForm() {
    const navigate = useNavigate();
    function cancelHandler() {
        navigate("/");
    }

    return (
    <div>
        <form>
            <h1>Create Deck</h1>
            <p>Name</p>
            <input
                id="name"
                type="text"
                name="name"
                placeholder={"Deck Name"}
            />
            <br/>
            <p>Description</p>
            <textarea
                id="description"
                name="description"
                placeholder={"Brief desciption of the deck"}
            />
            <br/>
            <button onClick={cancelHandler}>Cancel</button>
            <button>Submit</button>
        </form>
    </div>
    );
}

export default DeckForm;
