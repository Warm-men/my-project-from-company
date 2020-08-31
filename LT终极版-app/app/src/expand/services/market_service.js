import { Platform, StatusBar } from 'react-native'
import { MarketClient } from './client'

import banner from './banner_service'

const MARKET_SERVICE_TYPES = {
  banner
}

const hasNetworkIndicator = Platform.OS === 'ios'

const SHOW_NETWORK_ACTIVITY_INDICATOR_TIMEOUT = 100
var queriesInProgressCount = 0
var __timer__ = 0
function queryStart() {
  queriesInProgressCount++
  if (queriesInProgressCount === 1) {
    hasNetworkIndicator &&
      (__timer__ = setTimeout(function() {
        __timer__ = 0
        StatusBar.setNetworkActivityIndicatorVisible(true)
      }, SHOW_NETWORK_ACTIVITY_INDICATOR_TIMEOUT))
  }
}
function queryEnd() {
  queriesInProgressCount > 0 && queriesInProgressCount--
  if (queriesInProgressCount === 0) {
    if (hasNetworkIndicator) {
      if (__timer__) {
        clearTimeout(__timer__)
        __timer__ = 0
      } else {
        StatusBar.setNetworkActivityIndicatorVisible(false)
      }
    }
  }
}

function _Query(
  action,
  variables,
  fetchPolicy,
  requestSuccess,
  requestFailure
) {
  var options = {
    query: action,
    variables: variables,
    fetchPolicy: fetchPolicy
  }
  if (fetchPolicy !== 'cache-and-network') {
    queryStart()
    MarketClient.query(options)
      .then(data => {
        requestSuccess(data)
        queryEnd()
      })
      .catch(error => {
        queryEnd()
        var message
        if (
          typeof error.graphQLErrors !== 'undefined' &&
          error.graphQLErrors.length
        ) {
          message = error.graphQLErrors[0].message
        } else {
          message = JSON.stringify(error)
        }
        requestFailure(message)
      })
  } else {
    options.fetchPolicy = 'cache-only'
    MarketClient.query(options)
      .then(data => {
        if (data && Object.keys(data.data).length) {
          requestSuccess(data)
        }
        _Query(
          action,
          variables,
          'network-only',
          requestSuccess,
          requestFailure
        )
      })
      .catch(error => {
        _Query(
          action,
          variables,
          'network-only',
          requestSuccess,
          requestFailure
        )
      })
  }
}

// cache-first: This is the default value where we always try reading data from your cache first. If all the data needed to fulfill your query is in the cache then that data will be returned. Apollo will only fetch from the network if a cached result is not available. This fetch policy aims to minimize the number of network requests sent when rendering your component.
function QCacheFirst(action, variables, requestSuccess, requestFailure) {
  _Query(action, variables, 'cache-first', requestSuccess, requestFailure)
}

//network-only: This fetch policy will never return you initial data from the cache. Instead it will always make a request using your network interface to the server. This fetch policy optimizes for data consistency with the server, but at the cost of an instant response to the user when one is available.
function MARKET_QNetwork(action, variables, requestSuccess, requestFailure) {
  _Query(action, variables, 'network-only', requestSuccess, requestFailure)
}

// cache-and-network: This fetch policy will have Apollo first trying to read data from your cache. If all the data needed to fulfill your query is in the cache then that data will be returned. However, regardless of whether or not the full data is in your cache this fetchPolicy will always execute query with the network interface unlike cache-first which will only execute your query if the query data is not in your cache. This fetch policy optimizes for users getting a quick response while also trying to keep cached data consistent with your server data at the cost of extra network requests.
function QCacheNetwork(action, variables, requestSuccess, requestFailure) {
  _Query(action, variables, 'cache-and-network', requestSuccess, requestFailure)
}

//cache-only: This fetch policy will never execute a query using your network interface. Instead it will always try reading from the cache. If the data for your query does not exist in the cache then an error will be thrown. This fetch policy allows you to only interact with data in your local Client cache without making any network requests which keeps your component fast, but means your local data might not be consistent with what is on the server. If you are interested in only interacting with data in your Apollo Client cache also be sure to look at the readQuery() and readFragment() methods available to you on your ApolloClient instance.
function QCacheOnly(action, variables, requestSuccess, requestFailure) {
  _Query(action, variables, 'cache-only', requestSuccess, requestFailure)
}

function Mutate(action, variables, requestSuccess, requestFailure) {
  MarketClient.mutate({
    mutation: action,
    variables: variables
  })
    .then(data => {
      requestSuccess(data)
    })
    .catch(error => {
      const { graphQLErrors } = error
      requestFailure(graphQLErrors[0].message)
    })
}

function POST(url, variables, success, failure) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-REQUESTED_WITH': 'XMLHttpRequest'
  }
  fetch(url, {
    headers,
    body: JSON.stringify(variables),
    method: 'POST'
  })
    .then(response => {
      if (response.status === 200) {
        response.json().then(jsonData => {
          success(jsonData)
        })
      } else {
        failure(response)
      }
    })
    .catch(error => {
      failure(error)
    })
}

function GET(url, variables, success, failure) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-REQUESTED_WITH': 'XMLHttpRequest'
  }

  let requsetUrl = url
  for (var key in variables) {
    requsetUrl = requsetUrl + key + '=' + variables[key] + '&'
  }

  fetch(requsetUrl, {
    headers,
    method: 'GET'
  })
    .then(response => {
      if (response.status === 200) {
        if (url === MARKET_SERVICE_TYPES.me.FETCH_WECHAT_LOGIN) {
          success(response)
        } else {
          response.json().then(jsonData => {
            success(jsonData)
          })
        }
      } else {
        failure(response)
      }
    })
    .catch(error => {
      failure(error)
    })
}

export {
  MARKET_QNetwork,
  QCacheFirst,
  QCacheNetwork,
  QCacheOnly,
  Mutate,
  POST,
  GET,
  MARKET_SERVICE_TYPES
}
