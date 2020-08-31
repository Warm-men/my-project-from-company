import gql from 'graphql-tag'

const QUERY_MEMBER_DRESSING = gql`
  query exhibitingTotes($page: Int, $perPage: Int) {
    exhibiting_totes(page: $page, per_page: $perPage) {
      customer {
        avatar
        city
        first_subscribed_at
        height_inches
        id
        in_first_month_and_monthly_subscriber
        name
        nickname
        occupation
        state
        roles {
          type
        }
      }
      customer_nth_tote
      customer_photos {
        content
        share_topics {
          id
          title
        }
        created_at
        customer {
          state
          avatar
          city
          height_inches
          id
          nickname
          roles {
            type
          }
        }
        featured
        review {
          id
          content
          created_at
        }
        id
        incentives {
          success_url
          text
          time_cash_amount
        }
        like_customers {
          id
          avatar
        }
        liked
        likes_count
        photos {
          url
          mobile_url
        }
        products {
          product {
            id
            category {
              id
              accessory
            }
            catalogue_photos {
              medium_url
              full_url
            }
          }
        }
      }
      locked_at
      tote_products {
        product {
          id
          category {
            id
            accessory
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
        }
      }
    }
  }
`

export default {
  QUERY_MEMBER_DRESSING
}
