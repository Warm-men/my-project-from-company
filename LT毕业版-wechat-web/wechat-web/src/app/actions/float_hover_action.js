import {
  queryFloathover,
  mutationFloathover,
  quiz
} from 'src/app/queries/queries.js'

const floatHover = (slug, success, error) => ({
  type: 'API:QUERY_FLOAT_HOVER',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: queryFloathover,
    variables: {
      slug
    }
  },
  success,
  error
})

const markFloathover = (id, success) => ({
  type: 'API:MARK_FLOAT_HOVER',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: mutationFloathover,
    variables: {
      input: {
        id
      }
    }
  },
  success: success
})

const getQuiz = (input, success) => ({
  type: 'API:GET:QUIZ',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: quiz,
    variables: {
      ...input
    }
  },
  success: success
})

export default {
  floatHover,
  markFloathover,
  getQuiz
}
