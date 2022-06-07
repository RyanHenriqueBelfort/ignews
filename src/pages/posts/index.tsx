import { GetStaticProps } from 'next';
import Head from 'next/Head';
import * as prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic'
import * as prismicH from '@prismicio/helpers'
import styles from './styles.module.scss';

type Post = {
  slug: string
  title: string
  content: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  {
    posts.map(post => {
      console.log(post.content)
      return (
        <div key={post.slug}>
          <h1>{post.title}</h1>
        </div>
      )
    })
  }
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
              <a key={post.slug} href="#">
                <strong>{post.title}</strong>
                <time>{post.updatedAt}</time>
                <p>{post.content}</p>
              </a>   
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = getPrismicClient({ previewData })

  const page = await client.getByType('my-post-id', {
    pageSize: 100,
    lang: '*',
  })

  const posts = page.results.map(post => {
    return {
      slug: post.uid,
      title: prismicH.asText(post.data.Title),
      content: post.data.Content[0].text,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    };
  })
  return {
    props: {
      posts,
    },
  }
}