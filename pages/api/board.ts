import { NextApiRequest, NextApiResponse } from "next"
import { initialState } from "../store/boardSlice";
import { history } from "../data/history";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const nextTurn = initialState.nextTurn;
  
  if(req.method === 'GET') {
    res.status(200).json(history);
  } else if (req.method === 'POST') {
    const newMoveInfo = req.body.currentMoveInfo;
    history.push(newMoveInfo);
    res.status(201).json(history);
  }
}
