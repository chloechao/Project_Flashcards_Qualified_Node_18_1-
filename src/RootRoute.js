import React from "react";
import { Route, Routes } from "react-router-dom";
import DeckForm from "./Layout/DeckForm";
import NotFound from "./Layout/NotFound";
import DeckList from "./Layout/DeckList";
import Study from "./Layout/Study";
import CardForm from "./Layout/CardForm"
import Deck from "./Layout/Deck";


/**
 * App is a wrapper for <Layout>, you should not need to change this file.
 */

function RootRoutes() {
    return (
        <>
        <Routes>
            <Route path="/" element={<DeckList />} />
            <Route path="/decks/:deckId" element={<Deck />} />
            <Route path="/decks/:deckId/study" element={<Study />} />
            <Route path="/decks/:deckId/new" element={<DeckForm />} />
            <Route path="/decks/:deckId/cards/new" element={<CardForm />} />
            <Route path="/decks/new" element={<DeckForm />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        </>
    );
}

export default RootRoutes;
