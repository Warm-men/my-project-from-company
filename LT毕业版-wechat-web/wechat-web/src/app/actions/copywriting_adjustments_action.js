import { queryCopywritingAdjustments } from 'src/app/queries/queries.js'

const fetchCopywritingAdjustments = (input, success) => ({
  type: 'API:COPY:WRITING:ADJUSTMENTS:',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: queryCopywritingAdjustments,
    variables: { input }
  },
  success
})

export default {
  fetchCopywritingAdjustments
}
