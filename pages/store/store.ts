import { configureStore } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { boardSlice, myMoveEpic, myMoveInfoEpic } from "./boardSlice";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    boardReducer: boardSlice.reducer,
  },
  middleware: [epicMiddleware],
});

export const rootEpic = combineEpics(myMoveEpic, myMoveInfoEpic);
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
