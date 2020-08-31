export default `
mutation saveReferralCode($input: SaveReferralCodeInput!) {
  SaveReferralCode(input: $input) {
    errors
  }
}
`
