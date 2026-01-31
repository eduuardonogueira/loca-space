import { ThemeModeScript } from "flowbite-react";
import { Html, Main, NextScript } from "next/document";
import Head from "next/head";

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
        <ThemeModeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

