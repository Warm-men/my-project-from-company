export default `
  mutation purchaseOverdraft($input: PurchaseOverdraftInput!) {
    PurchaseOverdraft(input: $input) {
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
