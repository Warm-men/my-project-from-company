export default `
  query WebAllProduct($id: ID) {
    product(id: $id) {
      recommended_size
      activated_at
      brand {
        name
        id
      }
      parts{
        photoUrl
        title
      }
      tags {
        bg_color
        font_color
        title
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
      categories{
        name
      }
      category_rule {
        error_msg
        hint_msg
        slug
        swap_ban_threshold
        swap_hint_threshold
      }
      other_products_in_catalog_photos{
        id
        title
        brand{
          name
        }
        type
        catalogue_photos {
          medium_url
        }
      }
      customer_photos(limit: 10) {
        id
        url
        customer_city
        customer_height_inches
        customer_name
        customer_nickname
        product_size
        mobile_url
      }
      description
      details
      full_price
      id
      dynamic_price
      member_price
      product_sizes {
        bust_min_tolerance
        bust_max_tolerance
        hips_min_tolerance
        hips_max_tolerance
        waist_min_tolerance
        waist_max_tolerance
        recommended
        perfect_fit
        fit_message
        recommended
        bust
        waist
        hip
        front_length
        back_length
        inseam
        shoulder
        size {
          id
          name
          abbreviation
        }
        swappable
        purchasable
      }
      title
      type
    }
  }
`
