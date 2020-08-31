import { saveReferralCode } from 'src/app/queries/queries'

const userSaveReferralCode = (code, success, error) => ({
  type: 'API:SAVE:REFERRAL:CODE',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: saveReferralCode,
    variables: {
      input: {
        referral_code: code
      }
    }
  }
})

export default {
  userSaveReferralCode
}
