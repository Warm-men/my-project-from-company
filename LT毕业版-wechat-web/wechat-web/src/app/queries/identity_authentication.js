export default `
  mutation identityAuthentication($input: IdentityAuthenticationInput!) {
    IdentityAuthentication(input: $input) {
      errors
      verified
    }
  }
`
