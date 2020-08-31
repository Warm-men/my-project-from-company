export default `
query fetchProducts($filters: ProductFilters, $search_context: ProductSearchContextInput) {
  products(filters: $filters, search_context: $search_context) {
    activated_at
    id
    type
    title
    brand {
      name
    }
    season_sample
    tote_slot
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
  }
}

`
