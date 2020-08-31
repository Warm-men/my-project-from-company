export default `
  query ToteCheckoutPreview(
    $promo_code: String
    $tote_id: ID!
    $tote_product_ids: [ID!]!
    $order_id: ID
    $disable_promo_code: Boolean
  ) {
    tote_checkout_preview(
      promo_code: $promo_code
      tote_id: $tote_id
      tote_product_ids: $tote_product_ids
      order_id: $order_id
      disable_promo_code: $disable_promo_code
    ) {
      invalid_promo_codes {
        code
        description
        discount_amount
        expiration_date
        discount_percent
        type
        condition_display
        status
        title
        rules
        diff_amount
        product_scope
      }
      next_promo_code_hint
      preview {
        cash_price
        final_price
        promo_code_price
      }
      valid_promo_codes {
        code
        description
        discount_amount
        expiration_date
        discount_percent
        type
        condition_display
        status
        title
        rules
      }
    }
  }
`
