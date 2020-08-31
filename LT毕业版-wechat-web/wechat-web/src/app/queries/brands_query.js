export const brands = `
query FetchBrands($page: Int, $per_page: Int) {
  brands(page: $page, per_page: $per_page) {
    id
    logo_url
    name
  }
}
`

//FIXME:单个品牌的product查询
export const productBrand = `query FetchBrand($id: ID!,$filters:ProductFilters, $search_context: ProductSearchContextInput) {
  brand(id: $id) {
    id
    image_medium_url
    image_url
    image_thumb_url
    name
    slug
    description
    products (filters:$filters, search_context: $search_context) {
      activated_at
      id
      type
      title
      brand {
        name
      }
      tote_slot
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
}
`
