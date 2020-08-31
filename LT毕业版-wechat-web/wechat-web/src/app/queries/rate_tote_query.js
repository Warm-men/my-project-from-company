export default `
  mutation WebRateTote($tote_rating: RateToteInput!) {
    RateTote(input: $tote_rating) {
      tote_rating {
        rating
        tote_id
      }
      rating_incentive{
        incentive_amount_text
        main_text
        secondary_text
        incentive_amount
      }
    }
  }
`
