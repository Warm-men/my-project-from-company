export default `
mutation createCustomerProductsSizeFilter($input: CreateCustomerProductsSizeFilterInput!) {
    CreateCustomerProductsSizeFilter(input: $input) {
      errors
      is_reminded_with_size_filter
      products_size_filter
    }
}
`
