export default `
query FetchClosetProducts($filters: PromoCodeFilter, $ID: ID, $type: PromoCodeTypes){
  me {
    promo_codes(filter: $filters, subscription_type_id: $ID, type: $type){
      admin_note
      code
      description
      discount_amount
      expiration_date
      explainer
      is_referral
      status
      rules
      title
      tote_purchase_credit
    }
  }
}`

export const fetchPromoCode = `
  query fetchPromoCode($type: PromoCodeTypes) {
    me {
      expired_promo_codes(type: $type){
        admin_note
        code
        description
        discount_amount
        expiration_date
        explainer
        is_referral
        status
        rules
        title
        tote_purchase_credit
        type
        condition_display
        mini_purchase_amount
      }
      used_promo_codes(type: $type){
        used_at
        admin_note
        code
        description
        discount_amount
        expiration_date
        explainer
        is_referral
        status
        rules
        title
        tote_purchase_credit
        type
        condition_display
        mini_purchase_amount
      }
      valid_promo_codes(type: $type){
        admin_note
        code
        description
        discount_amount
        expiration_date
        explainer
        is_referral
        status
        rules
        title
        tote_purchase_credit
        type
        condition_display
        mini_purchase_amount
        subscription_type_ids
      }
    }
  }
`

export const fetchMemberPromoCode = `
  query fetchMemberPromoCode {
    me {
      expired_promo_codes{
        admin_note
        code
        description
        discount_amount
        expiration_date
        explainer
        is_referral
        status
        rules
        title
        tote_purchase_credit
        type
        condition_display
        mini_purchase_amount
      }
      used_promo_codes{
        used_at
        admin_note
        code
        description
        discount_amount
        expiration_date
        explainer
        is_referral
        status
        rules
        title
        tote_purchase_credit
        type
        condition_display
        mini_purchase_amount
      }
      valid_promo_codes{
        admin_note
        code
        description
        discount_amount
        expiration_date
        explainer
        is_referral
        status
        rules
        title
        tote_purchase_credit
        type
        condition_display
        mini_purchase_amount
      }
    }
  }
`
