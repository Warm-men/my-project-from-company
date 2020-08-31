export default `
query similarProducts($id: ID) {
    product(id: $id) {
      id
      similar_products {
        activated_at
        id
        type
        title
        brand {
          id
          name
        }
        catalogue_photos(limit: 1) {
          medium_url
          full_url
        }
        category {
          id
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
