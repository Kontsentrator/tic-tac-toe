import React, { useState } from 'react';
import TicTacToe from './game'

export default function Home() {
  return (
    <div className="game__wrap">
      <TicTacToe playerFirst={false} />
    </div>
  )
}
