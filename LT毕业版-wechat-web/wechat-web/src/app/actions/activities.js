import redeemYouzanCode from 'src/app/queries/redeem_youzan_code.js'

const redeemYZValidation = ({
  payment_method_id,
  code,
  success = () => {},
  error = () => {}
}) => ({
  type: 'API:REDEEM:YOUZAN:CODE:VALIDATION',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: redeemYouzanCode,
    variables: {
      input: {
        payment_method_id,
        code,
        raise_redeem_error: false
      }
    }
  },
  success,
  error
})

export default {
  redeemYZValidation
}
