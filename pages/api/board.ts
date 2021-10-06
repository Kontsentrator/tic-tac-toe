import { NextApiRequest, NextApiResponse } from "next"
import { initialState } from "../store/boardSlice";



export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const board = initialState.board;
    const nextTurn = initialState.nextTurn;
    res.status(200).json([{ id: 1, board: board, nextTurn: nextTurn }]);
  } else if (req.method === 'POST') {
    const newBoard = req.body.board;
    const newNextTurn = req.body.nextTurn;

    const newData = {
      id: Date.now(),
      board: newBoard,
      nextTurn: newNextTurn
    }
    res.status(201).json(newData);
  }

}
