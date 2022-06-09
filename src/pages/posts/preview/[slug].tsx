import { GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { getPrismicClient } from "../../../services/prismic"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"

import styles from '../post.module.scss'
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/router"

interface PostPreviewProps {
  post: {
    title: string,
    slug: string,
    content: string,
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps){
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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: String(post.content) }}>
          </div>

          <div className={styles.continueReading}>
            Quer continuar lendo?s
            <Link href="/">
              <a>Inscreva-se agora 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = ()=>{
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({params}) =>{
  const {data: session} = useSession()
  const router = useRouter()

  useEffect(()=> {
    if(session?.activeSubscription){
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  const {slug} = params

  const prismic = getPrismicClient()

  const response = await prismic.getByUID('my-post-id', String(slug), {
    fetch: ['my-post-id.Title', 'my-post-id.Content'],
  });
  
  const post = {
    slug,
    title: prismicH.asText(response.data.Title),
    content: prismicH.asHTML(response.data.Content.splice(0,2)),
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