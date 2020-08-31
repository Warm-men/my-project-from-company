import { Query_SeasonSummary } from '../queries/season'

export const FetchSeaonSummary = () => ({
  API: true,
  method: 'POST',
  url: '/api/query',
  type: 'API:SEASON_SUMMARY:FETCH',
  data: {
    query: Query_SeasonSummary
  }
})
