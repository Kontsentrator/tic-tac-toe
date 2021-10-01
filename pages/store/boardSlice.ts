import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IBoardState {
    board: Array<String>
}

interface IPayload {
    flag: string,
    pos: number
}

const initialState: IBoardState = {
    board: Array(9).fill('')
}

export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        move: (state, action: PayloadAction<IPayload>) => {
            state.board[action.payload.pos] = action.payload.flag;
        }
    }
});

export const { move } = boardSlice.actions;
export default boardSlice.reducer;
