export default function season_reducer(state = {}, action) {
  switch (action.type) {
    case 'API:SEASON_SUMMARY:FETCH:SUCCESS':
      return {
        ...state,
        season_summary: action.response.data.season_summary
      }
    default:
      return state
  }
}
