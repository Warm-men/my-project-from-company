export default `
query ProductRecommandSize($product_id: ID!) {
  realtime_product_recommended_size_and_product_sizes(product_id: $product_id) {
    recommended_size {
      abbreviation
      id
      name
    }
    product_sizes {
      id
      name
      realtime_fit_message
      size {
        abbreviation
        id
        name
      }
    }
    recommended_type
    recommended_message
  }
}
`
