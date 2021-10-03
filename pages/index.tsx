import React, { useState } from 'react';
import { Provider } from 'react-redux';
import TicTacToe from './game';
import {store} from './store/store';

export default function Home() {
  return (
    <div className="game__wrap">
      <Provider store={store}>
        <TicTacToe />
      </Provider>
    </div>
  )
}
