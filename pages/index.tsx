import React, { useState } from 'react';
import TicTacToe from './game';
import { createStore } from 'redux';
import { Observable, Action } from 'redux';
import { StateObservable } from 'redux-observable';

function (action$: Observable<Action>, state$: StateObservable<State>): Observable<Action>;

export default function Home() {
  return (
    <div className="game__wrap">
      <TicTacToe playerFirst={true} />
    </div>
  )
}
