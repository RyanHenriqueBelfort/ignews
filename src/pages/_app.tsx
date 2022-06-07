import { AppProps } from 'next/app'
import { Header } from '../components/header/index'
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { PrismicPreview } from '@prismicio/next';

import '../styles/global.scss'
import Link from 'next/link';
import { linkResolver, repositoryName } from '../services/prismic';
import { PrismicProvider } from '@prismicio/react';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>{children}</a>
        </Link>
      )}
    >
      <PrismicPreview repositoryName={ repositoryName }>
        <NextAuthProvider session={pageProps.session}>
          <Header></Header>
          <Component {...pageProps} />
        </NextAuthProvider>
      </PrismicPreview>
    </PrismicProvider>

  )
}

export default MyApp
