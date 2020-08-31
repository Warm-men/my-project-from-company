// this query is specific to a customer
export default `
  query WebSingleProductRecommendedSize($id: ID) {
    product(id: $id) {
      activated_at
      brand {
        name
        slug
        id
      }
      catalogue_photos {
        id
        giant_url
        full_url
        model {
          first_name
          top_size
          height_inches
          height_feet
          bra_size
          waist_size
          hip_size
        }
      }
      category {
        name
        accessory
      }
      other_products_in_catalog_photos{
        id
        title
        type
        brand{
          name
        }
        catalogue_photos {
          medium_url
        }
      }
      customer_photos(limit: 10) {
        id
        url
        mobile_url
        customer_name
        customer_nickname
        product_size
        customer_city
        customer_height_inches
      }
      description
      details
      full_price
      id
      member_price
      recommended_size
      product_sizes {
        id
        bust_min_tolerance
        bust_max_tolerance
        hips_min_tolerance
        hips_max_tolerance
        waist_min_tolerance
        waist_max_tolerance
        perfect_fit
        fit_message
        recommended
        bust
        waist
        hip
        front_length
        back_length
        inseam
        size {
          id
          name
          abbreviation
        }
        purchasable
        swappable
        shoulder
      }
      sale_price
      title
      type
    }
  }
`
