export const operationPlan = `
query OperationPlan($slug: String!) {
  operation_plan(slug: $slug) {
    id
    name
    slug
    promo_code {
      code
    }
    started_at
    ended_at
  }
}
`

export const addToCustomerOperationPlan = `
mutation WebAddToCustomerOperationPlan($input: AddToCustomerOperationPlanInput!) {
  AddToCustomerOperationPlan(input: $input) {
    customer_operation_plan {
      customer {
        id
        avatar_url
        id
        first_name
        last_name
        nickname
        activities
        available_purchase_credit {
          amount
          cents
          currency
          formatted
        }
        spent_purchase_credit {
          amount
          cents
          currency
          formatted
        }
        expired_purchase_credit {
          amount
          cents
          currency
          formatted
        }
        referrals {
          avatar_url
          first_name
          last_name
          nickname
          status
          friend_registered_at
          friend_subscription_started_on
          redeemed_at
        }
        referral_url
        promo_codes(filter: expired_recently) {
          admin_note
          code
          description
          discount_amount
          expiration_date
          explainer
          is_referral
          status
          tote_purchase_credit
        }
        payment_methods {
          id
          payment_gateway
        }
        credit_scores {
          id
          telephone
          score
        }
        closet(filters: {per_page: 5000}) {
          id
        }
        shipping_address {
          address_1
          address_2
          city
          company
          country
          customer_id
          district
          full_name
          id
          state
          telephone
          verified
          zip_code
        }
        email
        telephone
        attribute_preferences {
          name
        }
        style {
          constellation
          age_range
          bust_size_number
          shoulder_size
          arm_focus
          back_focus
          birthday
          bra_size
          brand
          celebrity
          cleavage_focus
          created_at
          cup_size
          customer_comment
          customer_id
          designer
          dress_size
          earring
          from
          height_inches
          hip_size
          hip_size_inches
          id
          inseam
          instagram_url
          jean_size
          large_prints_focus
          leg_focus
          maternity_due_date
          mom
          marital_status
          occupation
          pant_size
          pinterest_url
          product_filters_complete
          shape
          shoulder_focus
          skirt_size
          small_prints_focus
          social_focus
          thigh_size
          top_fit
          top_size
          tummy_focus
          updated_at
          waist_size
          weekend_focus
          weight
          work
          work_focus
          workwear    
        }
        customer_product_filters {
          accessory_categories
          accessory_colors
          clothing_categories
          clothing_colors
          prints
        }
        subscription {
          id
          on_hold
          promo_code
          hold_date
          status
          billing_date
          summer_plan
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
            preview {
              auto_renew_discount
              cash_price
              final_price
              name
              expiration_date
              promo_code_price
            }
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
          }
        }
      }
      operation_plan {
        id
        name
        slug
        promo_code {
          code
        }
        started_at
        ended_at
      }
    }
  }
}
`
