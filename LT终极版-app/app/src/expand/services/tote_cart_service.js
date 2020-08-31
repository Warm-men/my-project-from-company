import gql from 'graphql-tag'

const QUERY_ME_TOTECART = gql`
  query {
    me {
      id
      tote_cart {
        nth_tote
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
        disable_free_service
        used_free_service
        popup {
          height
          url
          width
        }
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      disabled
      category {
        id
        name
        accessory
      }
      brand {
        id
        name
      }
      category_rule {
        slug
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

const QUERY_ME_TOTECART_BANNER = gql`
  query ToteCartBanner($group: String) {
    me {
      id
      tote_cart {
        banner(group: $group) {
          height
          url
          width
        }
      }
    }
  }
`

const QUERY_ME_TOTECART_STATE = gql`
  query {
    me {
      id
      display_cart_entry
      subscription {
        tote_entry_state
        id
      }
      tote_cart {
        id
        state
      }
    }
  }
`

const MUTATION_ADD_TO_TOTE_CART = gql`
  mutation addToToteCart($input: AddToToteCartInput!) {
    AddToToteCart(input: $input) {
      clientMutationId
      errors {
        error_code
        message
      }
      success
      tote_cart {
        nth_tote
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
        disable_free_service
        used_free_service
        popup {
          height
          url
          width
        }
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      category {
        id
        name
        accessory
      }
      category_rule {
        slug
      }
      brand {
        id
        name
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

const MUTATION_REMOVE_FROM_TOTE_CART = gql`
  mutation removeFromToteCart($input: RemoveFromToteCartInput!) {
    RemoveFromToteCart(input: $input) {
      clientMutationId
      errors {
        error_code
        message
      }
      success
      tote_cart {
        nth_tote
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
        disable_free_service
        used_free_service
        popup {
          height
          url
          width
        }
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      category {
        id
        name
        accessory
      }
      category_rule {
        slug
      }
      brand {
        id
        name
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

const MUTATION_REPLACE_FOR_TOTE_CART = gql`
  mutation replaceForToteCart($input: ReplaceForToteCartInput!) {
    ReplaceForToteCart(input: $input) {
      clientMutationId
      errors {
        error_code
        message
      }
      success
      tote_cart {
        nth_tote
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
        disable_free_service
        used_free_service
        popup {
          height
          url
          width
        }
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      category {
        id
        name
        accessory
      }
      category_rule {
        slug
      }
      brand {
        id
        name
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

const MUTATION_REMOVE_COUPON_FROM_TOTE = gql`
  mutation removeCouponFromToteCart($input: RemoveCouponFromToteCartInput!) {
    RemoveCouponFromToteCart(input: $input) {
      clientMutationId
      errors {
        error_code
        message
      }
      success
      tote_cart {
        nth_tote
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

        popup {
          height
          url
          width
        }
        with_free_service
        disable_free_service
        used_free_service
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      category {
        id
        name
        accessory
      }
      category_rule {
        slug
      }
      brand {
        id
        name
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

const MUTATION_APPLY_COUPON_TO_TOTE = gql`
  mutation applyCouponToToteCart($input: ApplyCouponToToteCartInput!) {
    ApplyCouponToToteCart(input: $input) {
      clientMutationId
      errors {
        error_code
        message
      }
      success
      tote_cart {
        nth_tote
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
        disable_free_service
        used_free_service
        popup {
          height
          url
          width
        }
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      category {
        id
        name
        accessory
      }
      category_rule {
        slug
      }
      brand {
        id
        name
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

const MUTATION_APPLY_FREE_SERVICE_TOTOTE_CART = gql`
  mutation applyFreeServiceToToteCart(
    $input: ApplyFreeServiceToToteCartInput!
  ) {
    ApplyFreeServiceToToteCart(input: $input) {
      success
      errors {
        error_code
        message
      }
      tote_cart {
        nth_tote
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
        disable_free_service
        used_free_service
        popup {
          height
          url
          width
        }
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      disabled
      category {
        id
        name
        accessory
      }
      category_rule {
        slug
      }
      brand {
        id
        name
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

const MUTATION_REMOVE_FREE_SERVICE_TOTOTE_CART = gql`
  mutation removeFreeServiceFromToteCart(
    $input: RemoveFreeServiceFromToteCartInput!
  ) {
    RemoveFreeServiceFromToteCart(input: $input) {
      success
      errors {
        error_code
        message
      }
      tote_cart {
        nth_tote
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
        disable_free_service
        used_free_service
        popup {
          height
          url
          width
        }
      }
    }
  }
  fragment toteCartItemFields on ToteCartItem {
    id
    product {
      id
      type
      swappable
      tote_slot
      disabled
      category {
        id
        name
        accessory
      }
      category_rule {
        slug
      }
      brand {
        id
        name
      }
      catalogue_photos(limit: 1) {
        medium_url
        full_url
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

export default {
  QUERY_ME_TOTECART,
  QUERY_ME_TOTECART_BANNER,
  QUERY_ME_TOTECART_STATE,
  MUTATION_ADD_TO_TOTE_CART,
  MUTATION_REMOVE_FROM_TOTE_CART,
  MUTATION_REPLACE_FOR_TOTE_CART,
  MUTATION_REMOVE_COUPON_FROM_TOTE,
  MUTATION_APPLY_COUPON_TO_TOTE,
  MUTATION_APPLY_FREE_SERVICE_TOTOTE_CART,
  MUTATION_REMOVE_FREE_SERVICE_TOTOTE_CART
}
