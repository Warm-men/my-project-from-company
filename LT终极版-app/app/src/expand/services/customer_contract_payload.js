import gql from 'graphql-tag'

const ENABLE_CUSTOMER_CONTRACT = gql`
  mutation enableCustomerContract(
    $enableCustomerContractInput: EnableCustomerContractInput!
  ) {
    EnableCustomerContract(input: $enableCustomerContractInput) {
      charge_after_entrust {
        id
      }
      contract_attributes {
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
        return_app
      }
      errors
    }
  }
`
const DISABLE_CUSTOMER_CONTRACT = gql`
  mutation disableCustomerContract(
    $disableCustomerContractInput: DisableCustomerContractInput!
  ) {
    DisableCustomerContract(input: $disableCustomerContractInput) {
      errors
    }
  }
`
const CREACT_FAST_SHIPPING = gql`
  mutation createFastShipping($input: CreateFastShippingInput!) {
    CreateFastShipping(input: $input) {
      errors
    }
  }
`

const CHARGE_AFTER_ENTRUST = gql`
  query chargeAfterEntrust($id: ID!) {
    charge_after_entrust(id: $id) {
      id
      state
    }
  }
`

export default {
  ENABLE_CUSTOMER_CONTRACT,
  DISABLE_CUSTOMER_CONTRACT,
  CREACT_FAST_SHIPPING,
  CHARGE_AFTER_ENTRUST
}
