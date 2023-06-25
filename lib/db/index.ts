import { connect, connection } from "mongoose";
import TweetPair from "./tweet-pair";

export class DBError extends Error {
  public constructor(...args: any[]) {
    super(...args);
    Error.captureStackTrace(this, DBError);
    this.name = "DBError";
  }
}

if (!process.env.DB_URL) {
  throw new DBError("Connection URL not specified");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-expect-error
let cached = global.mongoose;

if (!cached) {
  // @ts-expect-error
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = connect(process.env.DB_URL as string, opts).then(
      (mongoose) => {
        return mongoose;
      }
    );
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
export default async function getDB() {
  try {
    await dbConnect();
  } catch (e) {
    console.log("[MONGO_CONNECTION_ERR]", e);
  }

  return {
    TweetPair,
    _connection: connection,
  };
}
