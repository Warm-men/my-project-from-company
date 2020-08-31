// this query is cached globally with a 2 hour expiration

export default `
  query WebBrowseCollection($id: ID, $filters: ProductFilters!) {
    browse_collection(id: $id) {
      id
      title
      sub_title
      banner_photo_wide_banner_url
      count
      description
      full_description
      products(filters: $filters) {
        activated_at
        id
        type
        title
        brand {
          name
        }
        catalogue_photos(limit: 1) {
          medium_url
          full_url
        }
        category {
          name
          accessory
        }
        member_price
        sale_price
        full_price
        swappable
        tote_slot
      }
    }
  }
`
