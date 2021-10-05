import React from 'react';
import { Provider } from 'react-redux';
import TicTacToe from './components/tictactoe';
import { store } from './store/store';
import { GetStaticProps } from 'next';
import { Datas } from './interfaces/interface';

export const getStaticProps: GetStaticProps = async ctx => {
  const response = await fetch("http://localhost:3000/api/board");
  const data = await response.json();
  console.log(data);
  return {props: {data}};
}

export default function Home({data}: Datas) {
  return (
    <div className="game__wrap">
      <Provider store={store}>
        <TicTacToe data={data} />
      </Provider>
    </div>
  )
}
