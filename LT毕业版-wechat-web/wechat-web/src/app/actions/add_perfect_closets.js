import { addPerfectClosets } from 'src/app/queries/queries.js'

const mutatePerfectClosets = (variables, success, error) => {
  return {
    type: 'API:ADD:PERFECT:CLOSETS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: addPerfectClosets,
      variables
    },
    success: success,
    error: error
  }
}

export default {
  mutatePerfectClosets
}
