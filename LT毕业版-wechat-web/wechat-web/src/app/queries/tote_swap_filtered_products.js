export default `
query WebToteSwapFilteredProducts(
  $filters: ProductFilters
  $search_context: ProductSearchContextInput
) {
  products(
    filters: $filters
    search_context: $search_context
    in_stock: true
  ) {
    activated_at
    id
    type
    title
    in_stock_count
    brand {
      id
      name
    }
    recommended_size
    recommended_size_abbr
    catalogue_photos(limit: 1) {
      medium_url
      full_url
    }
    category {
      id
      name
      accessory
    }
    swappable
  }
}
`
