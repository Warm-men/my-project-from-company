export default `
mutation WebSwapToteProduct($input: SwapToteProductInput!) {
  SwapToteProduct(input: $input) {
    tote_product {
      id
      added_item
      reason_in_tote
      customer_coupon_id
      customer_photos {
        id
        url
        customer_city
        customer_height_inches
        customer_name
        customer_nickname
        product_size
        mobile_url
      }
      product_item {
        state
      }
      product_size {
        id
        size_abbreviation
        size {
          name
        }
        swappable
      }
      product {
        activated_at
        closet_count
        category {
          id
          name
          accessory
          clothing
        }
        categories {
          name
        }
        category_rule {
          error_msg
          hint_msg
          slug
          swap_ban_threshold
          swap_hint_threshold
        }
        brand {
          name
        }
        catalogue_photos {
          medium_url
          full_url
          retina_index_url
        }
        id
        title
        type
      }
    }
  }
}
`
