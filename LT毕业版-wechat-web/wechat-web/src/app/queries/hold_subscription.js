export default `
mutation WebHoldSubscription($input: HoldSubscriptionInput!) {
  HoldSubscription(input: $input) {
      subscription{
        billing_date
        hold_date
        id
        is_cancelled
        is_hold_pending
        on_hold
        promo_code
        status
        next_tote_status {
          message
          code
          final_code
          can_create_tote
        }
        subscription_type {
          accessory_count
          annual_subscription_type {
            id
            base_price
            display_name
            interval
            preview {
              auto_renew_discount
              cash_price
              final_price
              name
              expiration_date
              promo_code_price
            }
          }
          base_price
          clothing_count
          display_name
          id
          internal_name
          interval
          is_adminable
          is_maternity
          is_signupable
          is_switchable
          notes
          quarterly_subscription_type {
            id
            preview {
              auto_renew_discount
              cash_price
              final_price
              name
              expiration_date
              promo_code_price
            }
          }
          preview {
            auto_renew_discount
            cash_price
            final_price
            name
            expiration_date
            promo_code_price
          }
        }
      }
      errors
    }
  }
`
