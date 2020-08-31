const PURCHASE_FREE_SERVICE = `
mutation PurchaseFreeService(
  $input: PurchaseFreeServiceInput!
) {
  PurchaseFreeService(input: $input) {
    errors {
      error_code
      message
    }
    order {
      id
      successful
    }
    payment {
      authorization_details
      id
      gateway
    }
  }
}
`
export { PURCHASE_FREE_SERVICE }
