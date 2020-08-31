import gql from 'graphql-tag'

const QUERY_LABEL_SCANS = gql`
  query FetchLabelScan($tracking_code: String!, $id: Int) {
    label_scans(tracking_code: $tracking_code) {
      carrier_message
      carrier_updated_at
    }
    tote(id: $id) {
      id
      tote_shipping_address {
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
        zip_code
      }
    }
  }
`

export default { QUERY_LABEL_SCANS }
