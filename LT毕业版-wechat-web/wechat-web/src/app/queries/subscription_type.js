export default `
query SubscriptionType($id: ID, $promo_code: String) {
  subscription_type(id: $id) {
    is_signupable
    days_interval
    ...currentSubscription
  }
}

fragment currentSubscription on SubscriptionType {
  id
  accessory_count
  clothing_count
  base_price
  display_name
  pretty_name
  interval
  original_price
  sub_display_name
  banner_height
  banner_url
  new_banner_url
  banner_width
  auto_renew_discount_hint
  auto_renew_discount_amount
  operation_plan {
    id
    name
    slug
    image_url
    banner_url
    new_banner_url
    icon_url
    referral_banner
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
    subscription_type_ids
  }
  preview(promo_code: $promo_code) {
    cash_price
    expiration_date
    final_price
    name
    promo_code_price
    auto_renew_discount
  }
}
`
