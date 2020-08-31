// this query is cached globally so do not add any fields that are specific to a customer

export default `
  query WebSingleProduct($id: ID, $product_id: ID!) {
    product(id: $id) {
      activated_at
      tote_slot
      attributes {
        options
        title
        value
      }
      primary_seasons{
        name_cn
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
      brand {
        name
        slug
        id
        logo_url
      }
      category_rule{
        slug
        error_msg
        swap_ban_threshold
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
      disabled
      category {
        name
        accessory
      }
      ensemble {
        active_products_count
        browse_collection_id
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
      customer_photos_pages (limit: 2)
      description
      product_digests {
        text
        start
        stop
      }
      details
      full_price
      id
      member_price
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
      product_sizes {
        id
        bust_min_tolerance
        bust_max_tolerance
        hips_min_tolerance
        hips_max_tolerance
        waist_min_tolerance
        waist_max_tolerance
        bust
        waist
        hip
        front_length
        back_length
        inseam
        fit_message
        size {
          id
          name
          abbreviation
        }
        purchasable
        swappable
        recommended
        shoulder
      }
      sale_price
      title
      type
    }
    realtime_product_recommended_size_and_product_sizes(product_id: $product_id) {
      recommended_message
      recommended_size {
        abbreviation
        id
        name
      }
      product_sizes {
        id
        name
        realtime_fit_message
        size {
          abbreviation
          id
          name
        }
      }
    }
  }
`
