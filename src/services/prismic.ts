import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'
import sm from '../../sm.json'

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

export function linkResolver(doc) {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'page':
      return `/${doc.uid}`
    default:
      return null
  }
}
interface PrismicConfig {
  req?: any,
  previewData?: any
}

export function getPrismicClient(config?: PrismicConfig){
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    ...config,
  })


  enableAutoPreviews({
    client,
    previewData: config?.previewData,
    req: config?.req,
  })
  return client
}