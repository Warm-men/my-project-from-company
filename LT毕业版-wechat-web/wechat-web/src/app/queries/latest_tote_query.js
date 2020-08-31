export default `
  query WebToteSummary {
    customizeable_tote {
      id
      stock_locked_at
      need_identity_authentication
      is_first_tote
      state
      swapped
      
      fc_address
      hive_box_scheduled_pickup {
        id
        admin_user_id
        latest_return_at
        status
        tracking_number
      }
      scheduled_pickups {
        id
        shipping_code
        address_1
        address_2
        city
        requested_pickup_at
        state
        telephone
        full_name
      }
      stock_already_released
      shipping_status {
        title
        message
        purchase_whole_tote_promotion
        steps {
          delivered {
            complete
            header
          }
          in_transit {
            complete
            header
          }
          preparing {
            complete
            header
          }
          styled {
            complete
            header
          }
          styling {
            complete
            header
          }
        }
      }
      tote_products {
        id
        tote_specific_price
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
          bust_max_tolerance
          bust_min_tolerance
          hips_max_tolerance
          hips_min_tolerance
          waist_max_tolerance
          waist_min_tolerance
          size_abbreviation
          size {
            id
            name
          }
          swappable
        }
        product {
          full_price
          activated_at
          closet_count
          tote_slot
          category {
            id
            name
            accessory
            clothing
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
          brand {
            name
            id
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
      seasons
    }
  }
`

export const queryIdentityAuth = `
query tote($id: Int) {
  tote(id: $id) {
    need_identity_authentication
  }
}
`
