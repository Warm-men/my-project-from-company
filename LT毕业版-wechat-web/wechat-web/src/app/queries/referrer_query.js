export default `
  query WebReferrer($referralCode: String!) {
    referrer(referral_code: $referralCode)
  }
`
