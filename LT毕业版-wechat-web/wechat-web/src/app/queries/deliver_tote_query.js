export default `
  mutation WebMarkToteDelivered($input: MarkToteDeliveredInput!) {
    MarkToteDelivered(input: $input) {
      tote {
        id
        bonus
        state
        return_tracking_link
        rental
        rateable
        purchasable
        delivered_at
        scheduled_at
        rating_incentive {
          has_incentived
          has_incentived_amount
          image_url
          link
        }
        orders {
          id
          line_items {
            __typename
            ... on ProductLineItem {
              product {
                id
              }
            }
          }
          summary {
            discount
            total_amount
            purchase_credit
          }
        }
        tote_products {
          id
          product_item {
            state
          }
          tote_specific_price
          product {
            full_price
            activated_at
            id
            type
            brand {
              name
            }
            title
            catalogue_photos {
              thumb_url
              medium_url
            }
          }
          product_size {
            size {
              id
              name
            }
          }
        }
        shipping_status {
          title
          message
          purchase_whole_tote_promotion
          steps {
            styling {
              header
              complete
            }
            styled {
              header
              complete
            }
            preparing {
              header
              complete
            }
            in_transit {
              header
              complete
            }
            delivered {
              header
              complete
            }
          }
        }
        tote_rating {
          rating
        }
      }
      errors
    }
  }
`
