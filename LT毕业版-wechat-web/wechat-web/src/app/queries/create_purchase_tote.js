export default `
  mutation WebCreatePurchaseTote($input: CreatePurchaseToteInput!) {
    CreatePurchaseTote(input: $input) {
      errors
      tote {
        id
      }
    }
  }
`
