export default `
  query WebSubscriptionPreview(
    $subscriptionTypeId: ID!,
    $address: AddressInput,
    $insurance: Boolean,
    $couponCode: String
  ) {
    subscription_preview(
      subscription_type_id: $subscriptionTypeId,
      address: $address,
      insurance: $insurance,
      coupon_code: $couponCode
    ) {
      subtotal
      tax
      discount
      total
      free_tote
      insurance_price
      interval_discount
      price_before_interval_discount
    }
  }
`
