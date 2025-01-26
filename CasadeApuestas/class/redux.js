import { createStore } from "../class/redux.js";

// Estado inicial
interface User {
    id: number;
    name: string;
}

interface Auction {
    id: number;
    item: string;
    bid: number;
}

const initialState = {
    users: [] as User[],
    auctions: [] as Auction[],
};

// Tipos
type State = typeof initialState;
type Action = 
    | { type: "REGISTER_USER"; payload: any }
    | { type: "ADD_AUCTION"; payload: any };

// Reducer
function auctionReducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case "REGISTER_USER":
            return {
                ...state,
                users: [...state.users, action.payload],
            };
        case "ADD_AUCTION":
            return {
                ...state,
                auctions: [...state.auctions, action.payload],
            };
        default:
            return state;
    }
}

// Crear el store
const store = createStore(auctionReducer);

export default store;
// Acción para registrar usuario
export const registerUser = (user) => ({
    type: "REGISTER_USER",
    payload: user,
});

// Acción para añadir una subasta
export const addAuction = (auction) => ({
    type: "ADD_AUCTION",
    payload: auction,
});
