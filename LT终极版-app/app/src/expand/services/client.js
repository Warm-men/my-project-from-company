import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import appStore from '../../stores/app'

const ORIGIN = 'https://wechat-staging1.letote.cn'
const clientUrl = ORIGIN + '/api/query'
const marketClientUrl = ORIGIN + '/market/api/query'

const authLink = setContext((_, { headers }) => {
  return { headers: { ...headers, version: appStore.currentVersion } }
})
const httpLink = new HttpLink({ uri: clientUrl, credentials: 'include' })
const link = authLink.concat(httpLink)

var Client = new ApolloClient({ link, cache: new InMemoryCache() })
Client.ORIGIN = ORIGIN

var MarketClient = new ApolloClient({
  link: new HttpLink({
    uri: marketClientUrl,
    credentials: 'include'
  }),
  cache: new InMemoryCache()
})
MarketClient.ORIGIN = ORIGIN

export { Client, MarketClient }
