import { configureStore } from '@reduxjs/toolkit';
import { boardSlice } from './boardSlice';

export const store = configureStore({
    reducer: {
        myReducer: boardSlice.reducer,
    }
});

console.log(store.getState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;