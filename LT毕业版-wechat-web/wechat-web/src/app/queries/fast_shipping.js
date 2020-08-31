export default `
  mutation WebCreateFastShipping($input: CreateFastShippingInput!) {
    CreateFastShipping(input: $input) {
      errors
    }
  }
`
