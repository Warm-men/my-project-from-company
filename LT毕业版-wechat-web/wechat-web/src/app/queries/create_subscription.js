export default `
mutation($input: ExtendSubscriptionInput!) {
  ExtendSubscription(input: $input) {
     errors
     order {
      successful
      id
     }
     payment {
      gateway
      gateway_id
      id
      state
      authorization_details
      payment_entries {
        payment_id
        details
      }
     }
  }
}
`
