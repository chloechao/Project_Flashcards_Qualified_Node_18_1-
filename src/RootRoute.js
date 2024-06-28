import React from "react";
import { Route, Routes } from "react-router-dom";
import DeckForm from "./Layout/DeckForm";
import NotFound from "./Layout/NotFound";
import Deck from "./Layout/Deck";
import Study from "./Layout/Study";


/**
 * App is a wrapper for <Layout>, you should not need to change this file.
 */

function RootRoutes() {
    return (
        <>
        <Routes>
            <Route path="/" element={<Deck />} />
            <Route path="/decks/:deckId/study" element={<Study />} />
            <Route path="/deck/new" element={<DeckForm />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        </>
    );
}

export default RootRoutes;
