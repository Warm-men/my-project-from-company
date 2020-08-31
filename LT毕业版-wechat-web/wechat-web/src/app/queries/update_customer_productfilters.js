export default `
  mutation WebUpdateCustomerProductFilters($input: UpdateCustomerProductFiltersInput!) {
    UpdateCustomerProductFilters(input: $input) {
      clientMutationId
    }
  }
`
