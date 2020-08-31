export default `
  mutation removeCouponFromTote($input: RemoveCouponFromToteInput!) {
    RemoveCouponFromTote(input: $input) {
      clientMutationId
      error
      success
    }
  }
`
