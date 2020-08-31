export default `
query order($id: ID) {
    order(id: $id) {
      id
      successful
      payment_failed
      free_service_fee_tip {
        content
        title
      }
    }
  }
`
