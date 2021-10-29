import { NextApiRequest, NextApiResponse } from "next";
import { statistic } from "../data/statistic";
import { IStatistic } from "../interfaces/interface";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    console.log("GET", statistic);
    res.status(200).json(statistic);
  } else if (req.method === "POST") {
    const newStatistic: IStatistic = req.body.stat;
    statistic.botWinCount = newStatistic.botWinCount;
    statistic.playerWinCount = newStatistic.playerWinCount;
    statistic.history = newStatistic.history;
    res.status(201).json(newStatistic);
  }
}
