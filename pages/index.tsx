import React, { useState } from 'react';
import TicTacToe from './game'

export default function Home() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(null));

  return (
    <div className="game__wrap">
      <TicTacToe board={board} />
    </div>
  )
}
