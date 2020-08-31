import gql from 'graphql-tag'

const PURCHASE_FREE_SERVICE = gql`
  mutation PurchaseFreeService(
    $purchaseFreeServiceInput: PurchaseFreeServiceInput!
  ) {
    PurchaseFreeService(input: $purchaseFreeServiceInput) {
      errors {
        error_code
        message
      }
      order {
        id
        successful
      }
      payment {
        authorization_details
        id
        gateway
      }
    }
  }
`
const CANCEL_FREE_SERVICE = gql`
  mutation CancelFreeService($cancelFreeServiceInput: CancelFreeServiceInput!) {
    CancelFreeService(input: $cancelFreeServiceInput) {
      errors {
        error_code
        message
      }
      success
    }
  }
`
const FREE_SERVICE_TYPE = gql`
  query {
    free_service_types {
      id
      price
      type
    }
    me {
      free_service(with_contract: true) {
        free_service_type {
          id
          price
          type
        }
        state
        can_apply_refund {
          errors {
            error_code
            message
          }
          success
        }
        can_subscribe
        account_entrance
      }
    }
  }
`
export default {
  PURCHASE_FREE_SERVICE,
  FREE_SERVICE_TYPE,
  CANCEL_FREE_SERVICE
}
