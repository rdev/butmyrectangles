import { Schema, model, models, Model, Document } from "mongoose";

const TweetPairSchema = new Schema(
  {
    webdevTweet: {
      type: String,
      index: true,
    },
    compareTweet: {
      type: String,
      required: true,
    },
    compareTweetType: {
      type: String,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "lastUpdated" } }
);

export interface TweetPairType {
  webdevTweet: string;
  compareTweet: string;
  compareTweetType: string;
}

export default (models.TweetPair as Model<TweetPairType & Document, {}>) ||
  model<TweetPairType & Document>("TweetPair", TweetPairSchema);
