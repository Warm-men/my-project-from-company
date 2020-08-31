const queryReferral = (code, success) => {
  return {
    type: 'API:REFERRALCODE:QUERY',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: `query Referrer($referral_code: String!) {
        referrer(referral_code: $referral_code) {
          referrer_nickname
          referrer_avatar
        }
      }`,
      variables: { referral_code: code }
    },
    success
  }
}

export default queryReferral
