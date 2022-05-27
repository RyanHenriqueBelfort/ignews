import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocuments extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;1,600&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
          <link rel='' href='/favicon.png' type='image/png' />
          {/* <title>Ig-news</title> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }

}