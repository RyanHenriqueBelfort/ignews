import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'

import styles from './home.module.scss'

export default function Home() {
  return (
    <>
    <Head>
      <title>Home | Ig-news</title>
    </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> word.</h1> 
          <p>
            Get access to all the publication <br/>
            <span>for $9.90 month</span>
          </p>
          <SubscribeButton></SubscribeButton>
        </section>
        <img src="/images/avatar.svg" alt="Girls coding" />
      </main>
    </>
  )
}
