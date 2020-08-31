const MUTATION_REMOVE_COUPON_FROM_TOTE = `
  mutation removeCouponFromToteCart($input: RemoveCouponFromToteCartInput!) {
    RemoveCouponFromToteCart(input: $input) {
      clientMutationId
      errors {
        error_code
        message
      }
      success
      tote_cart {
        accessory_items {
          ...toteCartItemFields
        }
        clothing_items {
          ...toteCartItemFields
        }
        customer_coupon_id
        disable_coupon
        display_more_product_entry
        display_free_service_banner
        id
        max_accessory_count
        max_clothing_count
        onboarding
        validate_result(
          category_rule_flag: true
          need_category_rule_verify: true
        ) {
          errors {
            error_code
            message
          }
          success
        }
        with_free_service
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      catalogue_photos {
        medium_url
      }
      category_rule{
        slug
        error_msg
        swap_ban_threshold
      }
      category {
        name
        accessory
      }
      id
      type
      swappable
      tote_slot
    }
    product_size {
      id
      size_abbreviation
      size {
        id
        name
        abbreviation
      }
      swappable
    }
    slot
  }
`

const MUTATION_APPLY_COUPON_TO_TOTE = `
  mutation applyCouponToToteCart($input: ApplyCouponToToteCartInput!) {
    ApplyCouponToToteCart(input: $input) {
      clientMutationId
      errors {
        error_code
        message
      }
      success
      tote_cart {
        accessory_items {
          ...toteCartItemFields
        }
        clothing_items {
          ...toteCartItemFields
        }
        customer_coupon_id
        disable_coupon
        display_more_product_entry
        display_free_service_banner
        id
        max_accessory_count
        max_clothing_count
        onboarding
        validate_result(
          category_rule_flag: true
          need_category_rule_verify: true
        ) {
          errors {
            error_code
            message
          }
          success
        }
        with_free_service
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      catalogue_photos {
        medium_url
      }
      id
      type
      swappable
      tote_slot
      category_rule {
        slug
        error_msg
        swap_ban_threshold
      }
      category {
        name
        accessory
      }
    }
    product_size {
      id
      size_abbreviation
      size {
        id
        name
        abbreviation
      }
      swappable
    }
    slot
  }
`

export { MUTATION_APPLY_COUPON_TO_TOTE, MUTATION_REMOVE_COUPON_FROM_TOTE }
