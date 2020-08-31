export default `
  mutation WebUpdateCustomerColorPreferences($customer_color_shade_preferences: UpdateCustomerColorShadePreferencesInput!, $customer_color_family_preferences: UpdateCustomerColorFamilyPreferencesInput!) {
    UpdateCustomerColorShadePreferences(input: $customer_color_shade_preferences) {
      clientMutationId
    }
    UpdateCustomerColorFamilyPreferences(input: $customer_color_family_preferences) {
      clientMutationId
    }
  }
`
