import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { getPrismicClient } from "../../services/prismic"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"

import styles from './post.module.scss'

interface PostProps {
  post: {
    title: string,
    slug: string,
    content: string,
    updatedAt: string
  }
}

export default function Post({ post }: PostProps){
  return(
    <>
      <Head>
          <title>{post.title} | ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: String(post.content) }}></div>
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params}) =>{
  const session = await getSession({ req })
  const {slug} = params

  if(!session?.activeSubscription){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient({req})

  const response = await prismic.getByUID('my-post-id', String(slug), {
    fetch: ['my-post-id.Title', 'my-post-id.Content'],
  });
  
  const post = {
    slug,
    title: prismicH.asText(response.data.Title),
    content: prismicH.asHTML(response.data.Content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  }

  return {
    props: {
      post
    }
  }
}