import gql from 'graphql-tag'

const QUERY_BANNER_GROUP = gql`
  #MARKET
  query BannerGroup($name: String, $per_page: Int) {
    banner_group(name: $name) {
      active
      banners(per_page: $per_page) {
        id
        call_to_action
        link
        logo
        inner_logo
        title
        description
        latest_call_to_actions
      }
      description
      id
      name
    }
  }
`

const QUERY_NEW_BANNER_GROUP = gql`
  query BannerGroup($display_position: String!) {
    banner_group(display_position: $display_position) {
      banners {
        extra
        height
        id
        image_url
        link
        title
        width
      }
      display_position
      id
    }
  }
`

const QUERY_SUBSCRIPTION_LANDING_PAGE = gql`
  query {
    subscription_landing_page {
      subscription_type {
        id
        max_totes
        interval
        display_name
        original_price
        clothing_count
        accessory_count
        visitor_discount_price
      }
      customer_photos {
        id
        liked
        likes_count
        content
        customer {
          id
          avatar
          nickname
          height_inches
          city
          roles {
            type
          }
        }
        share_topics {
          id
          title
        }
        photos {
          mobile_url
          url
        }
      }
    }
  }
`

export default {
  QUERY_BANNER_GROUP,
  QUERY_NEW_BANNER_GROUP,
  QUERY_SUBSCRIPTION_LANDING_PAGE
}
