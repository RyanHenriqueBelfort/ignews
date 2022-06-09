import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import { getPrismicClient } from "../../../services/prismic"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"
import Link from "next/link"

import styles from '../post.module.scss'
import { useEffect } from "react"
import { useRouter } from "next/router"
import { redirect } from "next/dist/server/api-utils"

interface PostPreviewProps {
  post: {
    title: string,
    slug: string,
    content: string,
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps){
  const {data: session} = useSession()
  const router = useRouter()

  useEffect(()=> {
    if(session?.activeSubscription){
      router.push(`/posts/${post.slug}`)
    }
  }, [session])
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

export const getStaticPaths: GetStaticPaths = async ()=>{
  return {
    paths: [],
    fallback: 'blocking'
  }
   // fallback: true, false, blocking
    // TRUE -> carrega a pagina e caso o conteudo do post nao esteja ja carregado de forma estatica
    // ele faz a requisição ()
    // FALSE -> caso não tenha o post de forma estatica ja gerado no servidor ele retorna um 404
    // ele não tenta buscar um novo post...fazer a requisicao
    // 'blocking' -> é parecido com o true, porem caso nao tenha o conteudo estatico ele faz a
    // requisiçao de forma SSR (ServerSideRendering) e deixa de forma estatica

    /*
      o mais usado é ou o blocking (caso tenha conteudo q pode surgir novos conteudos) ou o false
      que da erro 404 caso nao tenha de forma estatica...
      obs.: Tem como fazer um map no banco e buscar todos os slugs e passar de forma direta para o paths
      assim deixando o fallback como true a cada revalidate ele executa esta ação para o banco e não perde
      os pre processadores do google de indexação
    */
}

export const getStaticProps: GetStaticProps = async ({params}) =>{
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
    },
    redirect: 60 * 30,
  }
}