import { successReferrals } from 'src/app/queries/queries'

const searchSuccessReferrals = (success, error) => ({
  type: 'API:SUCCESS:REFERRALS',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: successReferrals
  }
})

export default {
  searchSuccessReferrals
}
