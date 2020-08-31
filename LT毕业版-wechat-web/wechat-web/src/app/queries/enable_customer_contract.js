export default `
  mutation WebEnableCustomerContract($input: EnableCustomerContractInput!) {
    EnableCustomerContract(input: $input) {
      contract_attributes{
        appid
        contract_code
        contract_display_account
        mch_id
        notify_url
        plan_id
        request_serial
        sign
        timestamp
        version
        return_web
      }
      errors
    }
  }
`
