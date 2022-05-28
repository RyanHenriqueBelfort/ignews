import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stipe'

import styles from './home.module.scss'

// 3 formas principais de fazer uma chamada API
//    Client-side: so depois que a pagina já foi carregada
//    Server-side: assim que a pagina é exibido em tela
//    Static Site Generation: 1 vez só ate da o tempo do revalidate

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}
export default function Home({product} : HomeProps) {

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
              <span>for {product.amount} month</span>
          </p>
          <SubscribeButton
            priceId={product.priceId}
          ></SubscribeButton>
        </section>
        <img src="/images/avatar.svg" alt="Girls coding" />
      </main>
    </>
  )
}

// USANDO SSR

// export const getServerSideProps: GetServerSideProps =async () => {
//   const price = await stripe.prices.retrieve('price_1L3rcVJckrmTFuRguiwEzgTI', ) 
//   //pegando o produto

//   const product = {
//     priceId: price.id,
//     amount: new Intl.NumberFormat('pt-BR', { 
//       style: 'currency', 
//       currency: 'BRL'
//      }).format(price.unit_amount / 100)
//   }  

//   return {
//     props: {
//       product
//     }
//   }

// }


// USANDO SSR

export const getStaticProps: GetStaticProps =async () => {
  const price = await stripe.prices.retrieve('price_1L3rcVJckrmTFuRguiwEzgTI', ) 
  //pegando o produto

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL'
     }).format(price.unit_amount / 100)
  }  

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 //24horas
  }
  
}
