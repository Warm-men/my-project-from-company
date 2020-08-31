const queryFloathover = `
  query float_hover($slug: String!) {
    float_hover(slug: $slug) {
      slug
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

const mutationFloathover = `
  mutation MarkFloatHover($input: MarkFloatHoverInput!) {
    MarkFloatHover(input: $input) {
      success
    }
  }
`
const quiz = `
query Quiz($slug: String) {
  quiz(slug: $slug) {
    id
    url
  }
}
`

export { queryFloathover, mutationFloathover, quiz }
