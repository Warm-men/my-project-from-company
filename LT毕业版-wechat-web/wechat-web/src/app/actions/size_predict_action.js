import { bustPredict, waistPredict, hipsPredict } from 'src/app/queries/queries'

const fetchBustPredict = (input, success) => ({
  type: 'API:FETCH:BUST:PREDICT',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  data: {
    query: bustPredict,
    variables: {
      style_input: input
    }
  }
})

const fetchWaistPredict = (input, success) => ({
  type: 'API:WAIST:PREDICT',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  data: {
    query: waistPredict,
    variables: {
      style_input: input
    }
  }
})

const fetchHipsPredict = (input, success) => ({
  type: 'API:HIPS:PREDICT',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  data: {
    query: hipsPredict,
    variables: {
      style_input: input
    }
  }
})

export default { fetchBustPredict, fetchWaistPredict, fetchHipsPredict }
