import Head from "next/head";
import { useCallback, useState } from "react";
import getDB from "@lib/db";
import { Autocomplete, Button, Input } from "@mantine/core";
import fetchAPI from "@lib/fetchAPI";
import { showNotification } from "@mantine/notifications";

export default function Admin() {
  const [webdevTweet, setWebdevTweet] = useState("");
  const [compareTweet, setCompareTweet] = useState("");
  const [compareTweetType, setCompareTweetType] = useState("Game Dev");

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      await fetchAPI("/submit", {
        method: "POST",
        body: {
          webdevTweet,
          compareTweet,
          compareTweetType,
        },
      });

      setWebdevTweet("");
      setCompareTweet("");
      setCompareTweetType("Game Dev");

      showNotification({
        title: "Tweet submitted",
        message: "Tweet submitted successfully",
      });
    },
    [webdevTweet, compareTweet, compareTweetType]
  );

  return (
    <>
      <Head>
        <title>Sexy dashboard</title>
      </Head>
      <main
        className="flex pt-32 bg-no-repeat relative flex-col items-center justify-center w-full h-screen bg-cover bg-top"
        id="hero"
      >
        <h1 className="text-6xl font-bold h-20 text-center mb-10 -mt-52 shadow-lg bg-gradient-to-br from-[#53545f] via-[#f2f2ff] to-[#f2f2ff] text-transparent bg-clip-text">
          Sexy dashboard
        </h1>

        <form
          className="grid px-6 md:grid-cols-2 gap-8 w-full max-w-3xl"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-4">
            <Input.Wrapper label="Webdev tweet" required>
              <Input
                value={webdevTweet}
                onChange={(e: any) => setWebdevTweet(e.currentTarget.value)}
                placeholder="https://twitter.com/webdevbro/status/..."
                name="webdevTweet"
                required
              />
            </Input.Wrapper>
          </div>
          <div className="flex flex-col gap-4">
            <Input.Wrapper label="Compare tweet" required>
              <Input
                value={compareTweet}
                onChange={(e: any) => setCompareTweet(e.currentTarget.value)}
                placeholder="https://twitter.com/awesome_gamedev_shit/status/..."
                name="webdevTweet"
                required
              />
            </Input.Wrapper>
            <Autocomplete
              label="Compare category"
              placeholder="Game Dev"
              data={["Game Dev", "iOS and SwiftUI", "Blender and 3D"]}
              value={compareTweetType}
              onChange={setCompareTweetType}
              required
            />
          </div>
          <div className="col-span-2 mt-10 flex items-center justify-center">
            <Button variant="filled" className="bg-blue-400" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
