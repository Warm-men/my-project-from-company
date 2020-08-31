export default `
  mutation WebUpdateCustomer($customer: UpdateCustomerInput!) {
    UpdateCustomer(input: $customer) {
	    clientMutationId
      errors
      auto_redeem_exchange_card
    }
  }
`
