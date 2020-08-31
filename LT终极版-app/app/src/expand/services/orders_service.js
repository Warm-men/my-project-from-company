import gql from 'graphql-tag'

const QUERY_ORDERS = gql`
  query paymentOrders {
    me {
      id
      available_purchase_credit {
        amount
      }
    }
    orders(order_type: ToteTransaction, needs_payment: true) {
      id
      overdue_surcharge_tips
      created_at
      tote {
        id
        state
        tote_products {
          id
          product {
            id
            brand {
              id
              name
            }
            catalogue_photos(limit: 1) {
              full_url
            }
            category {
              id
              accessory
            }
          }
          product_item {
            state
          }
        }
      }
      summary {
        purchase_credit
      }
      line_items {
        ... on ProductLineItem {
          amount
          product {
            id
            title
            full_price
            parts {
              title
            }
            dynamic_price
            brand {
              id
              name
            }
            catalogue_photos(limit: 1) {
              full_url
            }
            category {
              id
              accessory
            }
          }
          size {
            id
            abbreviation
            name
          }
        }
      }
    }
  }
`
export default { QUERY_ORDERS }
