import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json([{ id: 1, status: 'OK' }, {id: 2, status: 'OKAY'}])
}
