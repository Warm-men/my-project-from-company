import gql from 'graphql-tag'
const TOP_SEARCHES = gql`
  query top_searhces {
    top_searches {
      text
    }
  }
`

const SEARCH_PRODUCTS = gql`
  query searchProducts(
    $keyword: String!
    $page: Int
    $per_page: Int
    $filter: SearchProductFilter
  ) {
    search_products(
      keyword: $keyword
      page: $page
      per_page: $per_page
      filter: $filter
    ) {
      filter {
        secondary_categories {
          key
          text
        }
        color_families {
          key
          text
        }
        temperature {
          key
          text
        }
      }
      products {
        activated_at
        id
        type
        title
        disabled
        season_sample
        brand {
          id
          name
        }
        catalogue_photos {
          medium_url
          full_url
        }
        category {
          id
          name
          accessory
        }
        tote_slot
        member_price
        sale_price
        full_price
        swappable
        feed {
          items {
            icon_url
            title
            type
          }
        }
      }
    }
  }
`

export default { TOP_SEARCHES, SEARCH_PRODUCTS }
