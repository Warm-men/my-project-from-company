import gql from 'graphql-tag'

const QUERY_BRANDS = gql`
  query FetchBrands($page: Int, $per_page: Int) {
    brands(page: $page, per_page: $per_page, sort: name_asc) {
      id
      name
      slug
      logo_url
      image_thumb_url
    }
  }
`
const QUERY_BRAND_DETAIL = gql`
  query FetchBrand($id: ID!, $filters: ProductFilters) {
    brand(id: $id) {
      id
      image_medium_url
      image_url
      image_thumb_url
      name
      slug
      description
      products(filters: $filters) {
        id
        type
        title
        brand {
          name
          id
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
export default {
  QUERY_BRANDS,
  QUERY_BRAND_DETAIL
}
