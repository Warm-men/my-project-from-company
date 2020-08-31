export default `
mutation WebSubmitClassicCheckout( $shipping: UpdateShippingAddressInput!) {
  UpdateShippingAddress(input: $shipping) {
    errors
    shipping_address {
        address_1
        address_2
        city
        company
        country
        customer_id
        district
        full_name
        id
        state
        telephone
        verified
        zip_code
    }
  }
}
`
