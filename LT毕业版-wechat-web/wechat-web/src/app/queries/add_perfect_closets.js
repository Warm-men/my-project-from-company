export default `
mutation AddPerfectClosets($input: AddPerfectClosetsInput!) {
    AddPerfectClosets(input: $input) {
        perfect_closets {
            id
            tote_product {
                id
            }
            product {
                id
            }
        }
  }
}
`
