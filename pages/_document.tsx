import { createGetInitialProps } from "@mantine/next";
import { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

function Document() {
  return (
    <Html className="dark antialiased [font-feature-settings:'ss01']" lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e77975" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ea7376" />

        <meta property="og:title" content="Akshually web dev is harder" />
        <meta property="og:site_name" content="Web Dev is Really Hard" />
        <meta property="og:url" content="https://butmyrectangles.com" />
        <meta
          property="og:description"
          content="But at least our priorities are in the right place"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://butmyrectangles.com/og.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Akshually web dev is harder" />
        <meta
          name="twitter:description"
          content="But at least our priorities are in the right place"
        />
        <meta
          name="twitter:image"
          content="https://butmyrectangles.com/og.png"
        />
        <meta
          name="twitter:image:alt"
          content="But at least our priorities are in the right place"
        />
      </Head>
      {/* <script dangerouslySetInnerHTML={{ __html: themeScript }} /> */}
      {/* </Head> */}
      <body className="bg-white dark:bg-stone-900 overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = getInitialProps;

export default Document;
