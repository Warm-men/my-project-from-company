export default `
  query Express($tracking_number: String!) {
    express(tracking_number: $tracking_number) {
      present
    }
  }
`
