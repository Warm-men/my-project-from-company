import { updateShippingAddressApi } from 'src/app/queries/queries'

const updateShippingAddress = ({ shipping_address, success, error }) => ({
  type: 'API:SHIPPING:ADDRESS:UPDATE',
  API: true,
  method: 'POST',
  url: '/api/query',
  success: success,
  error: error,
  data: {
    query: updateShippingAddressApi,
    variables: {
      shipping: shipping_address
    }
  }
})

export default updateShippingAddress
