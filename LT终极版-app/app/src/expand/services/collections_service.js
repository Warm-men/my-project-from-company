import gql from 'graphql-tag'

const QUERY_COLLCTIONS = gql`
  query fetchCollections(
    $page: Int
    $per_page: Int
    $filter: BrowseCollectionsFilter
  ) {
    browse_collections(page: $page, per_page: $per_page, filter: $filter) {
      id
      title
      count
      banner_photo_url
      banner_photo_banner_url
      banner_photo_wide_banner_url
      collection_type
      link
      website_render_actions
      products {
        id
        tote_slot
        catalogue_photos {
          id
          full_url
        }
        category {
          id
          name
          accessory
        }
      }
    }
  }
`

const QUERY_COLLCTION_DETAIL = gql`
  query BrowseCollection($id: ID, $filters: ProductFilters!) {
    browse_collection(id: $id) {
      id
      title
      sub_title
      full_description
      count
      banner_photo_url
      banner_photo_banner_url
      banner_photo_wide_banner_url
      collection_type
      link
      website_render_actions
      products(filters: $filters) {
        id
        type
        title
        tote_slot
        brand {
          name
          id
        }
        catalogue_photos(limit: 1) {
          medium_url
          full_url
        }
        category {
          id
          name
          accessory
        }
        member_price
        sale_price
        full_price
        swappable
      }
    }
  }
`
export default { QUERY_COLLCTIONS, QUERY_COLLCTION_DETAIL }
