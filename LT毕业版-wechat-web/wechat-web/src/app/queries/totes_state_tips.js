export default `
  query ToteStateTips {
    tote_state_tips {
      credit_account_validation {
        errors {
          error_code
          message
        }
        success
      }
      transaction_validation {
        errors {
          error_code
          message
        }
        success
      }
      subscription_validation {
        errors {
          error_code
          message
        }
        success
      }
      extra_validation {
        errors {
          error_code
          message
        }
        success
      }
      tote_return_validation {
        errors {
          error_code
          message
        }
        success
      }
    }
  }
`
