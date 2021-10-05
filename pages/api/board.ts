import { NextApiRequest, NextApiResponse } from "next"
import { initialState } from "../store/boardSlice";

const board = initialState.board;
const nextTurn = initialState.nextTurn;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    res.status(200).json([{ id: 1, board: board, nextTurn: nextTurn }]);
  } else if (req.method === 'POST') {
    const board = req.body.board;
    const newData = {
      id: Date.now(),
      board: board,
      nextTurn: true
    }
    res.status(201).json(newData);
  }

}
