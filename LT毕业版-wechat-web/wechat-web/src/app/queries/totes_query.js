export default `
  query WebTotes($page: Int, $exclude_tote_ids: [Int], $filter: TotesFilter) {
    totes (page: $page, per_page: 5, exclude_tote_ids: $exclude_tote_ids, filter: $filter
      ) {
        id
        stock_locked_at
        locked_at
        need_identity_authentication
        other_product_feedback
        bonus
        state
        is_first_tote
        swapped
        fc_address
        tote_shipping_address{
          address_1
          city
          country
          district
          full_name
          state
          telephone
        }
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
        pull_tote_tip
        hive_box_scheduled_pickup {
          id
          admin_user_id
          latest_return_at
          status
          tracking_number
        }
        scheduled_return{
          allowed_commands
          scheduled_auto_pickup {
            address_1
            city
            district
            full_name
            id
            processing_status
            requested_pickup_at
            shipping_code
            state
            telephone
          }
          scheduled_self_delivery {
            id
            shipping_code
            latest_return_at
          }
          tote {
            id
          }
          tote_free_service {
            id
            return_slot_count
            hint {
              schedule_page_keep
              schedule_page_return
              state
              tote_page_return_remind {
                message
                type
              }
            }
            purchase_slots
          }
        }
        tote_free_service {
          id
          return_slot_count
          hint {
            schedule_page_keep
            schedule_page_return
            state
            tote_page_return_remind {
              message
              type
            }
          }
          state
          purchase_slots
          scheduled_return {
            allowed_commands
            scheduled_auto_pickup {
              address_1
              city
              district
              full_name
              id
              processing_status
              requested_pickup_at
              shipping_code
              state
              telephone
            }
            scheduled_self_delivery {
              id
              shipping_code
              latest_return_at
            }
            tote {
              id
            }
            tote_free_service {
              id
            }
          }
        }
        return_tracking_link
        outbound_shipping_code
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
        customer_nth_tote
        orders {
          id
          line_items {
            __typename
            ... on ProductLineItem {
              amount
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
        need_payment_orders {
          id
          line_items {
            __typename
            ... on ProductLineItem {
              amount
              product {
                id
              }
            }
          }
          successful
          summary {
            total_amount
            purchase_credit
            discount
          }
        }
        tote_products {
          is_perfect
          order {
            id
            title
            summary{
              total_amount
              purchase_credit
              discount
            }
            paid_at
            payment{
              gateway
            }
            line_items
            {
              ... on ProductLineItem
              {
                amount
                product{
                  parts{
                    title
                  }
                  full_price
                  brand {
                    name
                  }
                  title
                  member_price
                  full_price
                  catalogue_photos {
                    thumb_url
                    medium_url
                  }
                }
                size{
                  name
                }
              }
            }
          }
          customer_coupon_id
          tote_specific_price
          product_item {
            state
          }
          transition_info{
            modified_price
          }
          transition_state
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
          service_feedback{
            quality_issues_human_names
            quality_photo_urls
          }
          product {
            full_price
            activated_at
            id
            type
            tote_slot
            disabled
            category_rule {
              error_msg
              hint_msg
              slug
              swap_ban_threshold
              swap_hint_threshold
            }
            category {
              name
              accessory
            }
            brand {
              name
            }
            parts{
              title
            }
            title
            swappable
            member_price
            full_price
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
        skip_perfect_closet
        perfect_closets {
          id
          product {
            id
          }
          tote {
            id
          }
          tote_product {
            id
          }
        }
        display_rate_incentive_guide
    }
  }
`
