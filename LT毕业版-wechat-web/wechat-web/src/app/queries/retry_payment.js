export default `
mutation retryPayment($input: RetryPaymentInput!) {
    RetryPayment(input: $input) {
      errors
      order {
        id
        successful
      }
      payment {
        id
        authorization_details
        state
      }
    }
} 
`
