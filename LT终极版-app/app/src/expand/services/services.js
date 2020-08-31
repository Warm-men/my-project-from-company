import { Platform, StatusBar } from 'react-native'
import { MarketClient, Client } from './client'
import Stores from '../../stores/stores'

import brands from './brand_service'
import closet from './closet_service'
import collections from './collections_service'
import extendSubscription from './extendSubscription_service'
import common from './common_service'
import customerContract from './customer_contract_payload'
import customerPhotos from './customer_photos_service'
import express from './express_service'
import me from './me_service'
import orders from './orders_service'
import overdraft from './overdraft'
import products from './products_service'
import retryPayment from './retry_payment'
import rating from './rating_service'
import swap from './swap_service'
import totes from './totes_service'
import banner from './banner_service'
import citytime from './city_time_service'
import lookbook from './look_book_service'
import popups from './popups_service'
import redeem from './redeem_service'
import quiz from './quiz'
import questionnaire from './questionnaire'
import toteCart from './tote_cart_service'
import freeService from './free_service'
import uploadImageToken from './upload_image_token'
import memberDressing from './member_dressing'
import search from './search'

const SERVICE_TYPES = {
  brands,
  closet,
  collections,
  common,
  customerContract,
  customerPhotos,
  express,
  extendSubscription,
  me,
  orders,
  overdraft,
  products,
  retryPayment,
  rating,
  totes,
  swap,
  banner,
  citytime,
  lookbook,
  popups,
  redeem,
  quiz,
  questionnaire,
  toteCart,
  freeService,
  uploadImageToken,
  memberDressing,
  search
}

const hasNetworkIndicator = Platform.OS === 'ios'

const regex = /#MARKET/g
const getClientByAction = function(action) {
  if (
    action.loc &&
    action.loc.source &&
    action.loc.source.body &&
    action.loc.source.body.match(regex)
  ) {
    return MarketClient
  }
  return Client
}

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

function checkCookies() {
  const { cookie, getCookies } = Stores.currentCustomerStore
  if (!cookie) {
    getCookies()
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
  const client = getClientByAction(action)
  let idCounter
  if (client.queryManager && client.queryManager.idCounter) {
    idCounter = client.queryManager.idCounter
  }
  if (fetchPolicy !== 'cache-and-network') {
    queryStart()
    client
      .query(options)
      .then(data => {
        checkCookies()
        if (typeof data === 'object') {
          let obj = data
          if (idCounter) {
            obj = { ...data, idCounter }
          }
          requestSuccess && requestSuccess(obj)
        } else {
          requestSuccess && requestSuccess(data)
        }
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
        requestFailure && requestFailure(message)
      })
    return idCounter
  } else {
    options.fetchPolicy = 'cache-only'
    client
      .query(options)
      .then(data => {
        if (data && Object.keys(data.data).length) {
          requestSuccess && requestSuccess(data)
        }
        return _Query(
          action,
          variables,
          'network-only',
          requestSuccess,
          requestFailure
        )
      })
      .catch(error => {
        return _Query(
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
  return _Query(
    action,
    variables,
    'cache-first',
    requestSuccess,
    requestFailure
  )
}

//network-only: This fetch policy will never return you initial data from the cache. Instead it will always make a request using your network interface to the server. This fetch policy optimizes for data consistency with the server, but at the cost of an instant response to the user when one is available.
function QNetwork(action, variables, requestSuccess, requestFailure) {
  /*
    network-only => no-cache

    FetchPolicy 使用 network-only 目前有一个问题，如果请求参数相同，graphql apollo client 会处理第二次返回的结果 result 为 stale; data 数据会为空。目前 用 no-cache 可以解决这个问题
  */
  return _Query(action, variables, 'no-cache', requestSuccess, requestFailure)
}

// cache-and-network: This fetch policy will have Apollo first trying to read data from your cache. If all the data needed to fulfill your query is in the cache then that data will be returned. However, regardless of whether or not the full data is in your cache this fetchPolicy will always execute query with the network interface unlike cache-first which will only execute your query if the query data is not in your cache. This fetch policy optimizes for users getting a quick response while also trying to keep cached data consistent with your server data at the cost of extra network requests.
function QCacheNetwork(action, variables, requestSuccess, requestFailure) {
  return _Query(
    action,
    variables,
    'cache-and-network',
    requestSuccess,
    requestFailure
  )
}

//cache-only: This fetch policy will never execute a query using your network interface. Instead it will always try reading from the cache. If the data for your query does not exist in the cache then an error will be thrown. This fetch policy allows you to only interact with data in your local client cache without making any network requests which keeps your component fast, but means your local data might not be consistent with what is on the server. If you are interested in only interacting with data in your Apollo client cache also be sure to look at the readQuery() and readFragment() methods available to you on your ApolloClient instance.
function QCacheOnly(action, variables, requestSuccess, requestFailure) {
  return _Query(action, variables, 'cache-only', requestSuccess, requestFailure)
}

function Mutate(action, variables, requestSuccess, requestFailure) {
  getClientByAction(action)
    .mutate({
      mutation: action,
      variables: variables
    })
    .then(data => {
      requestSuccess && requestSuccess(data)
    })
    .catch(error => {
      let message
      if (
        typeof error.graphQLErrors !== 'undefined' &&
        error.graphQLErrors.length
      ) {
        message = error.graphQLErrors[0].message
      } else {
        message = JSON.stringify(error)
      }
      requestFailure && requestFailure(message)
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
    method: 'POST',
    credentials: 'include'
  })
    .then(response => {
      if (response.status === 200) {
        response.text().then(function(text) {
          success && success(text ? JSON.parse(text) : {})
        })
      } else {
        failure && failure(response)
      }
    })
    .catch(error => {
      failure && failure(error)
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
    method: 'GET',
    credentials: 'include'
  })
    .then(response => {
      if (response.status === 200) {
        response.json().then(jsonData => {
          success && success(jsonData)
        })
      } else {
        failure && failure(response)
      }
    })
    .catch(error => {
      failure && failure(error)
    })
}

const resetQueriseStore = response => {
  Client.resetStore().then(response)
}

export {
  QNetwork,
  QCacheFirst,
  QCacheNetwork,
  QCacheOnly,
  Mutate,
  POST,
  GET,
  SERVICE_TYPES,
  checkCookies,
  resetQueriseStore
}
