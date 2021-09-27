import React, { useState } from 'react';
import TicTacToe from './game'

export default function Home() {
  const [field, setField] = useState<string[]>(Array(9).fill(''));

  return (
    <div className="game__wrap">
      <TicTacToe field={field} />
    </div>
  )
}
