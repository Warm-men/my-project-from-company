export default `
query paymentOrders {
  orders(order_type: ToteTransaction, needs_payment: true) {
    id
    overdue_surcharge_tips
    summary {
      purchase_credit
      discount
    }
    created_at
    tote {
      id
      state
      tote_products {
        id
        product_item {
          state
        }
        tote_specific_price
        product {
          activated_at
          id
          full_price
          brand {
            name
          }
          catalogue_photos(limit: 1) {
            thumb_url
          }
        }
      }
    }
    line_items {
      __typename
      ... on ProductLineItem {
        amount
        product {
          activated_at
          catalogue_photos(limit: 1) {
            full_url
          }
          title
          full_price
          dynamic_price
          id
          parts{
            title
          }
        }
        size {
          abbreviation
          name
        }
      }
    }
  }
}
`
