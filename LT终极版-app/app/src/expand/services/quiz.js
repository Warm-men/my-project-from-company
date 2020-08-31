import gql from 'graphql-tag'

const QUERY_FLOAT_HOVER = gql`
  query QuizFloatHover($slug: String!) {
    float_hover(slug: $slug) {
      display_type
      float_image
      float_image_width
      float_image_height
      id
      pop_image
      pop_image_width
      pop_image_height
      routes
      url
    }
  }
`

const QUERY_QUIZ = gql`
  query QueryQuiz($slug: String) {
    quiz(slug: $slug) {
      id
      url
    }
  }
`

const QUERY_PAY_FEEDS = gql`
  query {
    subscription_pay_feeds(page: 1, per_page: 50) {
      nickname
      type
      title
      icon_url
    }
  }
`

const MUTATION_FLOAT_HOVER = gql`
  mutation MarkFloatHover($input: MarkFloatHoverInput!) {
    MarkFloatHover(input: $input) {
      success
    }
  }
`

export default {
  QUERY_FLOAT_HOVER,
  QUERY_QUIZ,
  QUERY_PAY_FEEDS,
  MUTATION_FLOAT_HOVER
}
