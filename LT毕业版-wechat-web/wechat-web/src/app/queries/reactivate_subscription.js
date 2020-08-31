export default `
mutation ReactivateSubscription($input: ReactivateSubscriptionInput!) {
    ReactivateSubscription(input: $input) {
      subscription {
        billing_date
        billing_date_extending
        hold_date
        id
        is_hold_pending
        on_hold
      }
      errors
    }
  }
`
