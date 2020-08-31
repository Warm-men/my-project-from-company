export default `
  mutation WebDisableCustomerContract($input: DisableCustomerContractInput!) {
    DisableCustomerContract(input: $input) {
      errors
    }
  }
`
