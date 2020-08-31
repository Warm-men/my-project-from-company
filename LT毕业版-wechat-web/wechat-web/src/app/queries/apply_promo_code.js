const applyTryOnPromoCode = `
  mutation WebApplyTryOnPromoCode($input: ApplyTryOnPromoCodeInput!) {
    ApplyTryOnPromoCode(input: $input) {
      errors
      promo_code {
        code
        discount_amount
        explainer
        is_referral
      }
    }
  }
`

const applyRentalPromoCode = `
  mutation WebApplyRentalPromoCode($input: ApplyRentalPromoCodeInput!) {
    ApplyRentalPromoCode(input: $input) {
      errors
      promo_code {
        code
        discount_amount
        explainer
        is_referral
      }
    }
  }
`

export { applyTryOnPromoCode, applyRentalPromoCode }
