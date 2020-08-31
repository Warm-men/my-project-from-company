export default `
  mutation applyCouponToTote($input: ApplyCouponToToteInput!) {
    ApplyCouponToTote(input: $input) {
      clientMutationId
      error
      success
    }
  }
`
