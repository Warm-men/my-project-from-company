import { sesameCredit } from 'src/app/queries/queries'

const getPhoneCode = (phone, success, error) => dispatch => {
  dispatch({
    type: 'API:sesameCredit',
    API: true,
    url: '/api/query',
    method: 'POST',
    data: {
      query: sesameCredit,
      variables: {
        input: {
          telephone: phone
        }
      }
    },
    success,
    error
  })
}

export default {
  getPhoneCode
}
