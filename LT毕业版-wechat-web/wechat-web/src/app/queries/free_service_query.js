const freeService = ` 
  query {
    free_service_types {
      id
      price
      type
    }
    me {
      id
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
        account_entrance
        display_guide_in_product_page
      }
    }
  }
`
const freeServiceCancel = `
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

export { freeService, freeServiceCancel }
