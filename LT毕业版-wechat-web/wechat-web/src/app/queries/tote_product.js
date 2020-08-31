export const toteProduct = `query toteProduct($id: ID!) {
    tote_product(id: $id) {
      customer_photos {
        id
        mobile_url
        url
      }
      id
      product_size {
        id
        size_abbreviation
        size {
          id
          name
        }
        swappable
      }
      product {
        id
        recommended_size
        activated_at
        type
        brand {
          name
        }
        title
       catalogue_photos {
         thumb_url
       }
      }
    }
  }
`
