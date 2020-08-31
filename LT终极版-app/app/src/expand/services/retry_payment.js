import gql from 'graphql-tag'

const RETRY_PAYMENT = gql`
  mutation retryPayment($retryPaymentInput: RetryPaymentInput!) {
    RetryPayment(input: $retryPaymentInput) {
      errors
      payment {
        id
        authorization_details
        state
        gateway
      }
      order {
        id
        successful
      }
    }
  }
`
export default {
  RETRY_PAYMENT
}
