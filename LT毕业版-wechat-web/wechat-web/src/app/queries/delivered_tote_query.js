export default `
  query deliveredTotes(
    $page: Int
    $per_page: Int
    $exclude_tote_ids: [Int]
    $filter: TotesFilter
  ) {
    totes (page: $page, per_page: $per_page, exclude_tote_ids: $exclude_tote_ids, filter: $filter)
    {
      id
      tote_products {
        id
        customer_photos {
          id
          mobile_url
        }
        product_size {
          id
          size_abbreviation
          size {
            id
            name
          }
        }
        product {
          id
          title
          disabled
          brand {
            id
            name
          }
          category {
            id
            accessory
          }
          catalogue_photos {
            medium_url
            full_url
          }
        }
      }
    }
  }
`
