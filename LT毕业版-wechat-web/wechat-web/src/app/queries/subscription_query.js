export default `
query FetchSubscription{
    me {
        display_cart_entry
        subscription {
            id

            totes_left
            on_hold
            hold_date
            promo_code
            status
            billing_date
            next_tote_status {
                message
                code
                final_code
                can_create_tote
            }
            subscription_type {
                accessory_count
                occasion
                sub_display_name
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
                    interval
                    base_price
                    internal_name
                    display_name
                    sub_display_name
                    original_price
                    clothing_count
                    accessory_count
                    preview {
                        auto_renew_discount
                        cash_price
                        final_price
                        name
                        expiration_date
                        promo_code_price
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
                    operation_plan{
                        id
                        name
                        slug
                        image_url
                        banner_url
                        image_url
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
                    interval
                    base_price
                    internal_name
                    display_name
                    sub_display_name
                    original_price
                    clothing_count
                    accessory_count
                    preview {
                        auto_renew_discount
                        cash_price
                        final_price
                        name
                        expiration_date
                        promo_code_price
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
                    operation_plan{
                        id
                        name
                        slug
                        image_url
                        banner_url
                        image_url
                    }
                }
                monthly_subscription_type{
                    id
                    interval
                    base_price
                    internal_name
                    display_name
                    sub_display_name
                    original_price
                    clothing_count
                    accessory_count
                    preview {
                        auto_renew_discount
                        cash_price
                        final_price
                        name
                        expiration_date
                        promo_code_price
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
                    operation_plan{
                        id
                        name
                        slug
                        image_url
                        banner_url
                        image_url
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
