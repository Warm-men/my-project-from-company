const QUERY_TOTE_CART = `
query queryToteCart{
    me {
      tote_cart {
        disable_free_service
        accessory_items {
          ...toteCartItemFields
        }
        clothing_items {
          ...toteCartItemFields
        }
        used_free_service
        state
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
        banner {
          url
        }
        popup {
          url
        }
      }
    }
}
fragment toteCartItemFields on ToteCartItem {
  id
  product {
    catalogue_photos {
      medium_url
    }
    category_rule {
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
    disabled
  }
  product_size {
    id
    size_abbreviation
    size {
      id
      name
    }
    swappable
  }
  slot
}
`

const MUTATION_REMOVE_FROM_TOTE_CART = `
mutation removeFromToteCart($input: RemoveFromToteCartInput!) {
  RemoveFromToteCart(input: $input) {
    clientMutationId
    errors {
      error_code
      message
    }
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
    category_rule {
      slug
      error_msg
      swap_ban_threshold
    }
    catalogue_photos {
      medium_url
    }
    category {
      name
      accessory
    }
    id
    type
    swappable
    tote_slot
    disabled
  }
  product_size {
    id
    size_abbreviation
    size {
      id
      name
    }
    swappable
  }
  slot
}
`

const MUTATION_ADD_TO_TOTE_CART = `
mutation addToToteCart($input: AddToToteCartInput!) {
  AddToToteCart(input: $input) {
    clientMutationId
    errors {
      error_code
      message
    }
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
    category_rule {
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
    disabled
  }
  product_size {
    id
    size_abbreviation
    size {
      id
      name
    }
    swappable
  }
  slot
}
`

const MUTATION_REPLACE_FOR_TOTE_CART = `
mutation replaceForToteCart($input: ReplaceForToteCartInput!) {
  ReplaceForToteCart(input: $input) {
    clientMutationId
    errors {
      error_code
      message
    }
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
    category_rule {
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
    disabled
  }
  product_size {
    id
    size_abbreviation
    size {
      id
      name
    }
    swappable
  }
  slot
}
`

export {
  MUTATION_REMOVE_FROM_TOTE_CART,
  MUTATION_ADD_TO_TOTE_CART,
  MUTATION_REPLACE_FOR_TOTE_CART,
  QUERY_TOTE_CART
}
