export default `
  mutation WebCreateInstantTransaction($input: CreateInstantTransactionInput!) {
    CreateInstantTransaction(input: $input) {
      errors
    }
  }
`
