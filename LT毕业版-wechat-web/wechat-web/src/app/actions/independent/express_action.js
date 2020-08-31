import expressQuery from 'src/app/queries/express_query.js'

const fetchExpress = (tracking_code, success) => {
  return {
    type: 'API:FETCH:EXPRESS',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    data: {
      query: expressQuery,
      variables: {
        tracking_code
      }
    }
  }
}

export default {
  fetchExpress
}
