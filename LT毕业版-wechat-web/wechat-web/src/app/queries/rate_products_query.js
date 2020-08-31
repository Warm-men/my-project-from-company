export const rateProductsV2Query = `
  mutation WebRateProducts($input: RateProductsV2Input!) {
    RateProductsV2(input: $input) {
      errors
      rating_incentive{
        has_incentived
        has_incentived_amount
        image_url
        link
      }
    }
  }
`

export const rateProductsQuery = `
  mutation WebRateProducts($input: RateProductsInput!) {
    RateProducts(input: $input) {
      errors
      show_free_service_question
    }
  }
`
