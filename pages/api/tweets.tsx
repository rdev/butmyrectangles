import getDB from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function tweets(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { TweetPair } = await getDB();

  const tweets = await TweetPair.find({
    orderBy: {
      createdAt: "asc",
    },
  });

  res.status(200).json({ tweets });
}
