export default `
  query WebToteTrackerTotes {
    latest_rental_tote {
      ...toteTrackerFields
    }
  }
  fragment toteTrackerFields on Tote {
    id
    stock_locked_at
    need_identity_authentication
    bonus
    state
    is_first_tote
    swapped
    fc_address
    onboarding_tips
    progress_status{
      delivered_at
      description
      locked_at
      schedule_returned_at
      shipped_at
      status
      title
      hide_delivered_btn
    }
    hive_box_scheduled_pickup {
      id
      admin_user_id
      latest_return_at
      status
      tracking_number
    }
    scheduled_pickups {
      id
      address_1
      address_2
      city
      shipping_code
      processing_status
      requested_pickup_at
      state
      tote_id
      zip_code
    }
    return_tracking_link
    outbound_shipping_code
    returned_at
    delivered_at
    scheduled_at
    rental
    rateable
    purchasable
    rating_incentive {
      has_incentived
      has_incentived_amount
      image_url
      link
    }
    product_parts{
      parts{
        photoUrl
        title
      }
      product_title
    }
    orders {
      id
      line_items {
        __typename
        ... on ProductLineItem {
          product {
            id
          }
        }
      }
      summary {
        total_amount
        purchase_credit
        discount
      }
    }
    tote_products {
      customer_coupon_id
      tote_specific_price
      product_item {
        state
      }
      customer_photos {
        id
        mobile_url
        url
        thumb_url
        customer_city
        customer_height_inches
        customer_name
        customer_nickname
        product_size
      }
      id
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
      rating {
        id
      }
      product {
        full_price
        activated_at
        id
        type
        tote_slot
        disabled
        swappable
        category_rule {
          error_msg
          hint_msg
          slug
          swap_ban_threshold
          swap_hint_threshold
        }
        category {
          id
          name
          accessory
          clothing
        }
        brand {
          name
        }
        title
        catalogue_photos {
          thumb_url
          medium_url
        }
      }
    }
    shipping_status {
      title
      message
      steps {
        styling {
          header
          complete
        }
        styled {
          header
          complete
        }
        preparing {
          header
          complete
        }
        in_transit {
          header
          complete
        }
        delivered {
          header
          complete
        }
      }
    }
    tote_rating {
      rating
    }
  }
`
