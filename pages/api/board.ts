import { NextApiRequest, NextApiResponse } from "next";
import { statistic } from "../data/statistic";
import { IStatistic } from "../interfaces/interface";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(statistic);
  } else if (req.method === "POST") {
    const newStatistic: IStatistic = req.body.stat;
    statistic.history = newStatistic.history;
    statistic.botWinCount = newStatistic.botWinCount;
    statistic.playerWinCount = newStatistic.playerWinCount;
    res.status(201).json(newStatistic);
  }
}
