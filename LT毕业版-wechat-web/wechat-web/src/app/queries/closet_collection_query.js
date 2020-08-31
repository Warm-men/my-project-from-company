export default `
  query WebClosetCollection($ids: [ID]) {
    products(ids: $ids, per_page: 8, sort: closet, in_stock: true) {
      activated_at
      id
      type
      title
      brand {
        name
      }
      recommended_size
      recommended_size_abbr
      catalogue_photos(limit: 1) {
        medium_url
        full_url
      }
      category {
        name
        accessory
      }
      tote_slot
    }
  }
`
