import { configureStore } from "@reduxjs/toolkit";
import { combineEpics } from "redux-observable";
import { boardSlice, myMoveEpic } from "./boardSlice";
import { createEpicMiddleware } from "redux-observable";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    boardReducer: boardSlice.reducer,
  },
  middleware: [epicMiddleware],
});

export const rootEpic = combineEpics(myMoveEpic);
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
