export default `
query products($search_context: ProductSearchContextInput!, $filters: ProductFilters) {
  products(search_context: $search_context, filters: $filters) {
    activated_at
    id
    type
    title
    brand {
      name
    }
    swappable
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
    tote_slot
  }
}
`
