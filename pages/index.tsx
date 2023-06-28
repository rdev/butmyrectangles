import Head from "next/head";
import Tweet from "react-tweet-embed";
import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ShuffleIcon,
} from "@radix-ui/react-icons";
import getDB from "@lib/db";
import useSWR from "swr";
import fetchAPI from "@lib/fetchAPI";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";

// Shit web devs pretend to care about as an excuse to why everything sucks
const BULLSHIT_EXCUSES = [
  "different screen sizes",
  "multiple browsers",
  "responsive design",
  "accessibility",
  "SEO",
  "slow mobile networks",
  "legacy code",
  "standards",
  "backwards compatibility",
  "database roundtrips",
];

export default function Homepage(props: { tweets: any[] }) {
  const [excuse, setExcuse] = useState(BULLSHIT_EXCUSES[0]);

  const { query, push } = useRouter();
  // maybe id is a better idea cause this will shift shared links but idgaf right now
  const tweetId = query.tweet as string;

  const { data: tweetsData } = useSWR("/api/tweets", (key) => fetchAPI(key));

  const tweets = (tweetsData?.tweets || props.tweets).sort(
    // @ts-ignore
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const tweetIndex = tweetId
    ? tweets.findIndex((tweet: any) => tweet._id === tweetId)
    : 0;

  console.log(tweetIndex, tweets[1]._id, tweets[1]._id === tweetId);

  const tweetRegex =
    /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/i;

  return (
    <div className="flex flex-col">
      <Head>
        <title>Akshually web dev is harder</title>
      </Head>
      <main
        className="flex pt-32 relative flex-col items-center min-h-screen w-full h-auto bg-cover bg-top"
        id="hero"
      >
        <h1 className="text-6xl px-6 sm:px-0 leading-tight font-bold min-h-[5rem] text-center mb-4 shadow-lg bg-gradient-to-br from-[#53545f] via-[#f2f2ff] to-[#f2f2ff] text-transparent bg-clip-text">
          Web dev is really hard
        </h1>
        <div className="text-gray-400 px-6 sm:px-0 text-lg text-center max-w-2xl">
          Web dev is actually more difficult than literally anything in the
          world because we need to worry about
          <button
            className="inline-flex ml-2 items-center gap-2 bg-gray-400/20 rounded-lg px-2 py-1"
            type="button"
            onClick={() => {
              let randomExcuse: any;

              while (randomExcuse === excuse || !randomExcuse) {
                randomExcuse =
                  BULLSHIT_EXCUSES[
                    Math.floor(Math.random() * BULLSHIT_EXCUSES.length)
                  ];
              }

              setExcuse(randomExcuse);
            }}
          >
            <ShuffleIcon />
            {excuse}
          </button>
        </div>

        <div className="mt-20 relative w-full max-w-6xl mb-24">
          <div
            className="w-full h-2/3 bg-blue-600/50 absolute bottom-0 -z-10 left-0"
            style={{ filter: "blur(300px)" }}
          />
          <div className="bg-black border border-white/10 transition-all h-[640px] w-full gap-8 flex flex-col sm:flex-row items-start rounded-3xl p-10 z-10 shadow-2xl">
            <Button
              type="button"
              leftIcon={<ArrowLeftIcon />}
              variant="outline"
              radius="xl"
              className="hidden sm:block self-center"
              onClick={() => {
                if (tweetIndex === 0) return;

                push(`/?tweet=${tweets[tweetIndex - 1]._id}`, undefined, {
                  shallow: true,
                });
              }}
              disabled={tweetIndex === 0}
            >
              Prev
            </Button>

            <div className="hidden sm:block grow h-full overflow-auto">
              <AnimatePresence>
                {tweets.map((tweet: any, index: any) => {
                  return index === tweetIndex ? (
                    <motion.div
                      className="flex gap-4 w-full h-full items-start justify-center"
                      // slide in from the right
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      key={`tweet-${tweetIndex}`}
                    >
                      <div className="w-full rounded-xl overflow-hidden px-2">
                        <Tweet
                          className="w-full bg-black rounded-xl overflow-hidden"
                          tweetId={
                            // extract id from url using regex
                            tweet.webdevTweet.match(tweetRegex)?.[3]
                          }
                          options={{
                            theme: "dark",
                          }}
                        />
                      </div>

                      <div className="text-lg flex items-center justify-center text-center text-gray-400 mt-8 whitespace-nowrap px-6">
                        Meanwhile in
                        <br />
                        {tweet.compareTweetType}
                      </div>

                      <div className="w-full rounded-xl overflow-hidden">
                        <Tweet
                          className="w-full h-full bg-black rounded-xl overflow-hidden"
                          tweetId={
                            // extract id from url using regex
                            tweet.compareTweet.match(tweetRegex)?.[3]
                          }
                          options={{
                            theme: "dark",
                          }}
                        />
                      </div>
                    </motion.div>
                  ) : null;
                })}
              </AnimatePresence>
            </div>

            {/* Literally don't give a shit */}
            <div className="sm:hidden w-full h-full flex flex-col overflow-auto">
              <AnimatePresence>
                {tweets.map((tweet: any, index: any) => {
                  return index === tweetIndex ? (
                    <motion.div
                      className="flex flex-col gap-4 w-full h-auto"
                      // slide in from the right
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      key={`tweet-${tweetIndex}`}
                    >
                      <div className="w-full rounded-xl overflow-hidden px-2">
                        <Tweet
                          className="w-full bg-black rounded-xl overflow-hidden"
                          tweetId={
                            // extract id from url using regex
                            tweet.webdevTweet.match(tweetRegex)?.[3]
                          }
                          options={{
                            theme: "dark",
                          }}
                        />
                      </div>

                      <div className="text-lg flex items-center justify-center text-center text-gray-400 mt-8 whitespace-nowrap px-6">
                        Meanwhile in
                        <br />
                        {tweet.compareTweetType}
                      </div>

                      <div className="w-full rounded-xl overflow-hidden">
                        <Tweet
                          className="w-full h-full bg-black rounded-xl overflow-hidden"
                          tweetId={
                            // extract id from url using regex
                            tweet.compareTweet.match(tweetRegex)?.[3]
                          }
                          options={{
                            theme: "dark",
                          }}
                        />
                      </div>
                    </motion.div>
                  ) : null;
                })}
              </AnimatePresence>
            </div>

            <Button
              type="button"
              leftIcon={<ArrowRightIcon />}
              variant="outline"
              radius="xl"
              className="hidden sm:block self-center"
              onClick={() => {
                if (tweetIndex === tweets.length - 1) return;

                push(`/?tweet=${tweets[tweetIndex + 1]._id}`, undefined, {
                  shallow: true,
                });
              }}
              disabled={tweetIndex === tweets.length - 1}
            >
              Next
            </Button>
            <div className="sm:hidden w-full flex items-center gap-4 justify-center">
              <Button
                type="button"
                leftIcon={<ArrowLeftIcon />}
                variant="outline"
                radius="xl"
                className=" self-center"
                onClick={() => {
                  if (tweetIndex === 0) return;

                  push(`/?tweet=${tweets[tweetIndex - 1]._id}`, undefined, {
                    shallow: true,
                  });
                }}
                disabled={tweetIndex === 0}
              >
                Prev
              </Button>
              <Button
                type="button"
                leftIcon={<ArrowRightIcon />}
                variant="outline"
                radius="xl"
                className="self-center"
                onClick={() => {
                  if (tweetIndex === tweets.length - 1) return;

                  push(`/?tweet=${tweets[tweetIndex + 1]._id}`, undefined, {
                    shallow: true,
                  });
                }}
                disabled={tweetIndex === tweets.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="p-8 flex flex-col z-20 items-center justify-center text-center text-white/50">
        It's time to make web dev stop sucking.
        <br />
        <span>
          By{" "}
          <a
            href="https://twitter.com/thekitze"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500"
          >
            this guy
          </a>{" "}
          and{" "}
          <a
            href="https://twitter.com/MaxRovensky"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500"
          >
            this guy
          </a>
        </span>
      </footer>
    </div>
  );
}

// fuck off ssg
export const getServerSideProps = async () => {
  const { TweetPair } = await getDB();

  const tweets = await TweetPair.find({
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    props: {
      tweets: JSON.parse(JSON.stringify(tweets)),
    },
  };
};
