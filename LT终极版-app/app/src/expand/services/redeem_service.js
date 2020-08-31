import gql from 'graphql-tag'

const MUTATION_REDEEM_YOUZAN_CODE = gql`
  mutation redeemYouzanCode($input: RedeemYouzanCodeInput!) {
    RedeemYouzanCode(input: $input) {
      success
      errors
      exchange_name
      promo_code {
        code
        description
        discount_amount
        expiration_date
        discount_percent
        type
        condition_display
        status
        title
        rules
        subscription_type_ids
      }
    }
  }
`

export default {
  MUTATION_REDEEM_YOUZAN_CODE
}
