export default `
query WebSubscriptionTypes($filter: SubscriptionTypesFilter!, $promo_code: String!, $occasion_filter: SubscriptionTypesOccasionFilter) {
  subscription_types(filter: $filter, occasion_filter: $occasion_filter) {
    accessory_count
    clothing_count
    sub_display_name
    days_interval
    occasion
    occasion_display
    banner_url
    annual_subscription_type {
      id
      base_price
      original_price
      display_name
      interval
      internal_name
      sub_display_name
      accessory_count
      clothing_count
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
      preview(promo_code: $promo_code) {
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
        referral_banner
      }
    }
    operation_plan {
      id
      name
      slug
      image_url
      banner_url
      icon_url
      referral_banner
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
    quarterly_subscription_type {
      id
      interval
      base_price
      original_price
      internal_name
      display_name
      sub_display_name
      accessory_count
      clothing_count
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
      preview(promo_code: $promo_code) {
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
        referral_banner
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
      accessory_count
      clothing_count
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
      operation_plan {
        id
        name
        slug
        image_url
        banner_url
        icon_url
        referral_banner
      }
      preview(promo_code: $promo_code) {
        auto_renew_discount
        cash_price
        final_price
        name
        expiration_date
        promo_code_price
      }
    }
    preview(promo_code: $promo_code) {
      auto_renew_discount
      cash_price
      final_price
      name
      expiration_date
      promo_code_price
    }
  }
}
`
