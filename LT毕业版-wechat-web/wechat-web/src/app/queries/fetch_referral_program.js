export default `
  query WebFetchReferralProgram {
    me {
      referral_url
    }
    active_rental_referral_program {
      user_facing_description
      user_facing_share_intro
      user_facing_title
      user_facing_confirmation
    }
  }
`
