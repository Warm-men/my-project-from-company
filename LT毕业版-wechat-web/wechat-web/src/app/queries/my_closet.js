export default `
query fetchProducts($filters: ProductFilters, $search_context: ProductSearchContextInput , $in_closet:Boolean , $in_perfect_closet : Boolean) {
  products(filters: $filters, search_context: $search_context, in_closet: $in_closet , in_perfect_closet:$in_perfect_closet) {
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
    disabled
    member_price
    sale_price
    full_price
  }
}

`
