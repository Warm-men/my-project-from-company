export default `
  query WebFetchToteShare($tote_id: ID!) {
    tote_share(tote_id: $tote_id) {
      first_name
      referral_url
      products {
        activated_at
        title
        catalogue_photos(limit: 1) {
          url
        }
        brand {
          name
        }
      }
    }
  }
`
