import React, { useState } from 'react';
import TicTacToe from './game';
import { createStore } from 'redux';
import { PayloadAction } from 'redux';

const defaultState = {
  cash: 0,
}

const reducer = (state = defaultState, action: PayloadAction) => {
  switch(action.type) {
    case "ADD_CASH":
      return {...state, cash: state.cash + action.payload}
    case "GET_CASH":
      return {...state, cash: state.cash - action.payload}

    default:
      return state;
  }
}

const store = createStore(reducer);

export default function Home() {
  return (
    <div className="game__wrap">
      <TicTacToe playerFirst={true} />
    </div>
  )
}
