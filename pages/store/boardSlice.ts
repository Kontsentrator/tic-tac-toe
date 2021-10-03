import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IBoardState {
    board: Array<string>,
    nextTurn: boolean
}

const initialState: IBoardState = {
    board: Array(9).fill(''),
    nextTurn: true
}

export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        move: (state, action: PayloadAction<{flag: string, pos: number}>) => {
            state.board[action.payload.pos] = action.payload.flag;
            state.nextTurn = !state.nextTurn;
        },
        restart: (state) => {
            state.board = initialState.board;
            state.nextTurn = initialState.nextTurn;
        }
    }
});

export const { move, restart } = boardSlice.actions;
export default boardSlice.reducer;
