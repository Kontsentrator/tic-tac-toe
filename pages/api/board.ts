import { NextApiRequest, NextApiResponse } from "next"
import { initialState } from "../store/boardSlice";



export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const nextTurn = initialState.nextTurn;
  
  if(req.method === 'GET') {
    const movesInfo = [{ game: 1, row: 1, col: 2, isPlayer: nextTurn }];
    res.status(200).json(movesInfo);
  } else if (req.method === 'POST') {
    const movesInfo = req.body.currentMoveInfo;
    res.status(201).json(movesInfo);
  }
}
