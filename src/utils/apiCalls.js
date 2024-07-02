import { deleteDeck } from "./api";

export async function deleteDeckCall(deckId) {
    if (window.confirm("Are you sure you want to delete this deck?")) {
        try {
            const signal = new AbortController().signal;
            return await deleteDeck(deckId, signal);
        } catch (error) {
            console.error('Error deleting deck:', error);
        }
    }
}