export default `
{
    subscription_migration_preview(raise_error: false) {
      available_migrate_options{
        accessory_count
        clothing_count
        next_billing_at
        title
        tote_count
        target_subscription_type_id
      }
      errors{
        error_code
        message
      }
      success
      tote_count
      next_billing_at
      tote_capacity
    }
  }
`

export const subscriptionMigration = `
mutation subscriptionMigration($input: SubscriptionMigrationInput!) {
    SubscriptionMigration(input: $input) {
      subscription {
        id
        totes_left
        on_hold
        promo_code
        hold_date
        status
        billing_date
        current_subscription_type_name
        display_interval
        display_name
        billing_date_extending
        fast_shipping {
          fast_shipping
          reminded
        }
        contract_display {
          menu_display
          order_display
          tote_display
        }
        summer_plan
        next_tote_status {
          message
          code
          final_code
          can_create_tote
        }
        subscription_type {
          clothing_count
          accessory_count
          occasion
          days_interval
          banner_url
          sub_display_name
          operation_plan {
            id
            name
            slug
            image_url
            banner_url
          }
          available_promo_codes {
            code
            description
            discount_amount
            expiration_date
            status
            title
            rules
            type
            condition_display
            discount_percent
          }
          annual_subscription_type {
            id
            base_price
            original_price
            display_name
            interval
            internal_name
            sub_display_name
            clothing_count
            accessory_count
            banner_url
            available_promo_codes {
              code
              description
              discount_amount
              expiration_date
              status
              title
              rules
              type
              condition_display
              discount_percent
            }
            preview {
              auto_renew_discount
              cash_price
              final_price
              name
              expiration_date
              promo_code_price
            }
            operation_plan {
              id
              name
              slug
              image_url
              banner_url
              icon_url
            }
          }
          base_price
          original_price
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
          operation_plan {
            id
            name
            slug
            image_url
            banner_url
            icon_url
          }
          quarterly_subscription_type {
            id
            interval
            base_price
            original_price
            internal_name
            display_name
            sub_display_name
            clothing_count
            accessory_count
            banner_url
            available_promo_codes {
              code
              description
              discount_amount
              expiration_date
              status
              title
              rules
              type
              condition_display
              discount_percent
            }
            preview {
              auto_renew_discount
              cash_price
              final_price
              name
              expiration_date
              promo_code_price
            }
            operation_plan {
              id
              name
              slug
              image_url
              banner_url
              icon_url
            }
          }
          monthly_subscription_type {
            id
            interval
            base_price
            original_price
            internal_name
            display_name
            sub_display_name
            clothing_count
            accessory_count
            banner_url
            available_promo_codes {
              code
              description
              discount_amount
              expiration_date
              status
              title
              rules
              type
              condition_display
              discount_percent
            }
            preview {
              auto_renew_discount
              cash_price
              final_price
              name
              expiration_date
              promo_code_price
            }
            operation_plan {
              id
              name
              slug
              image_url
              banner_url
              icon_url
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
    }
}
`
