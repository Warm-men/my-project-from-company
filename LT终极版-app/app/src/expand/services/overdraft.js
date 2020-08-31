import gql from 'graphql-tag'

const MUTATION_PURCHASE_OVERDRAFT = gql`
  mutation PurchaseOverdraft($input: PurchaseOverdraftInput!) {
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
export default { MUTATION_PURCHASE_OVERDRAFT }
