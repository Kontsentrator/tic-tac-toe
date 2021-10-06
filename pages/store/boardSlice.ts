import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IBoardState {
    board: Array<string[]>,
    nextTurn: boolean
}

export const initialState: IBoardState = {
    board: [['', '', ''],
            ['', '', ''],
            ['', '', '']],
    nextTurn: true
}

export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        move: (state, action: PayloadAction<{flag: string, pos: number[]}>) => {
            let col = action.payload.pos[0];
            let row = action.payload.pos[1];
            state.board[col][row] = action.payload.flag;
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
