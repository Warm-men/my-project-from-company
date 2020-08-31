export default `
  mutation SignUp($input: CreateCustomerInput!) {
    CreateCustomer(input: $input) {
      errors
      customer {
        id
        email
      }
    }
  }
`
