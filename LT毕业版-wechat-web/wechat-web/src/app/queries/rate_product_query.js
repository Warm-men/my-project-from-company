export default `
  mutation WebRateProduct($rating: RateProductInput!) {
    RateProduct(input: $rating) {
      rating {
        id
      }
    }
  }
`
