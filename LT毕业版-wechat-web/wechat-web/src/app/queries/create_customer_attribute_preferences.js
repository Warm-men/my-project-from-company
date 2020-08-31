export default `
  mutation WebCreateCustomerAttributePreferences($input: CreateCustomerAttributePreferencesInput!) {
    CreateCustomerAttributePreferences(input: $input) {
      errors
    }
  }
`
