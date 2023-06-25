import getDB from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function submitTweet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { TweetPair } = await getDB();

  const newPair = new TweetPair({
    webdevTweet: req.body.webdevTweet,
    compareTweet: req.body.compareTweet,
    compareTweetType: req.body.compareTweetType,
  });

  await newPair.save();

  res.status(200).json({ tweet: newPair });
}
