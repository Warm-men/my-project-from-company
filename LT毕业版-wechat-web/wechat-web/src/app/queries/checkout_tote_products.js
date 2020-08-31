export default `
mutation checkoutToteProducts($input:CheckoutToteProductsInput!) {
    CheckoutToteProducts(input: $input) {
      order {
        id
        successful
      }
      payment {
        id
        state
        authorization_details
      }
    }
  }
`
