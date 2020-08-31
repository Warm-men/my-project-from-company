const MUTATION_TOTE_CART_PLACE_ORDER = `
mutation toteCartPlaceOrder($input: ToteCartPlaceOrderInput!) {
  ToteCartPlaceOrder(input: $input) {
    clientMutationId
    errors {
      error_code
      message
    }
    success
    tote {
      id
    }
    tote_swap_questionnaire{
      improvement_question
      theme_question
      options{
        key
        value
      }
    }
  }
}
`

export { MUTATION_TOTE_CART_PLACE_ORDER }
