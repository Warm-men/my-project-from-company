export default `
mutation unbindJdCredit($input: UnbindJdCreditInput!) {
    UnbindJdCredit(input: $input) {
      success
      errors
    }
}
`
