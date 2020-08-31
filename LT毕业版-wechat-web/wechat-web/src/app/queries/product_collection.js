export const fetchOccasion = `query fetchOccasion($slug: String, $filters: ProductFilters) {
  product_collection(slug: $slug) {
    slug
    title
    products(filters: $filters) {
      activated_at
      id
      type
      title
      tote_slot
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
    }
  }
}`
