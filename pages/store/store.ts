import { createStore } from 'redux';
import { PayloadAction, configureStore } from '@reduxjs/toolkit';

export interface IState {
    board: Array<String>
}

interface IPayload {
    flag: string,
    pos: number
}

const defaultState = {
    board: Array(9).fill('')
}


const reducer = (state: {board: String[]} = defaultState, action: PayloadAction<IPayload>) => {
    switch(action.type) {
        case "MOVE":
            return {...state, board: state.board[action.payload.pos] = action.payload.flag}
        default:
            return state;
    }
}

export const myStore = configureStore({reducer: {
    myReducer: reducer
}});