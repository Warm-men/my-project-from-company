import gql from 'graphql-tag'
import { Client } from './client'

const QUERY_ME = gql`
  query {
    me {
      rpmetric
      display_cart_entry
      first_delivered_tote
      first_subscribed_at
      customer_photo_incentive_detail {
        incentive_hint
        link_url
      }
      locked_tote_count
      unread_customer_photo_review
      in_first_month_and_monthly_subscriber
      customer_photo {
        customer_photo_count
        featured_count
        liked_count
      }
      roles {
        type
      }
      attribute_preferences {
        name
      }
      available_purchase_credit {
        amount
      }
      active_referral_program {
        sender_amount
      }
      tote_cart {
        accessory_items {
          ...toteCartItemFields
        }
        clothing_items {
          ...toteCartItemFields
        }
        nth_tote
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
      }
      referral_url
      referral_banner {
        referral_banner_height
        referral_banner_width
        referral_entry_banner_height
        referral_entry_banner_width
        referral_program_banner_url
        referral_program_jump_url
        referred_program_entry_banner_url
      }
      free_service(with_contract: true) {
        state
        can_apply_refund {
          errors {
            error_code
            message
          }
          success
        }
        can_subscribe
        account_entrance
        display_guide_in_product_page
      }
      credit_account {
        balance
      }
      finished_onboarding_questions
      activities
      id
      email
      nickname
      telephone
      avatar_url
      enable_payment_contract {
        id
        can_disable
        payment_method_gateway
      }
      is_reminded_with_size_filter
      products_size_filter
      can_view_newest_products
      valid_promo_codes(type: All) {
        code
        description
        discount_amount
        expiration_date
        status
        title
        rules
        type
        condition_display
        discount_percent
        subscription_type_ids
      }
      valid_coupons {
        customer_coupon_id
        expired_at
        rules
        sub_title
        title
        type
        valid_days
        status
      }
      subscription_fees_count
      subscription {
        id
        display_interval
        display_name
        current_subscription_type_name
        summer_plan
        billing_date
        billing_date_extending
        remain_additional_days
        hold_date
        on_hold
        totes_left
        tote_entry_state
        auto_charge_management_page {
          new_subscription_type
          configuration_file_url_v2
        }
        subscription_type {
          ...meSubscriptionType
        }
        promo_code
        status
        next_tote_status {
          can_create_tote
          message
          code
          final_code
        }
        contract_display {
          menu_display
          tote_display
          order_display
        }
        fast_shipping {
          fast_shipping
        }
      }
      closet(filters: { per_page: 5000, sort: closet }) {
        id
      }
      credit_scores {
        id
        score
        telephone
      }
      customer_product_filters {
        accessory_categories
        accessory_colors
        clothing_categories
        clothing_colors
        prints
      }
      shipping_address {
        address_1
        address_2
        city
        company
        country
        customer_id
        district
        full_name
        id
        state
        telephone
        verified
        zip_code
      }
      attribute_preferences {
        name
      }
      style {
        id
        MEASUREMENT_KEYS
        shoulder_size_skip
        inseam_skip
        updated_at
        height_inches
        weight
        waist_size
        hip_size_inches
        inseam
        shoulder_size
        bra_size
        cup_size
        top_size
        dress_size
        pant_size
        occupation
        marital_status
        mom
        birthday
        shape
        jean_size
        skirt_size
        bust_size_number
        waist_shape
        belly_shape
        shoulder_shape
        skirt_habit
        jean_prefer
        jean_waist_fit
        jean_size_unknow
      }
    }
    latest_rental_tote {
      ...toteTrackerFields
    }
  }

  fragment meSubscriptionType on SubscriptionType {
    id
    base_price
    display_name
    interval
    original_price
    sub_display_name
    operation_plan {
      name
    }
    preview {
      auto_renew_discount
    }
    occasion
    occasion_display
  }

  fragment toteTrackerFields on Tote {
    id
    bonus
    state
    is_first_tote
    onboarding_tips
    stock_locked_at
    scheduled_pickups {
      id
      address_1
      address_2
      city
      processing_status
      requested_pickup_at
      state
      tote_id
      zip_code
    }
    fc_address
    hive_box_scheduled_pickup {
      tracking_number
      latest_return_at
      status
    }
    orders {
      line_items {
        ... on ProductLineItem {
          product {
            id
          }
        }
      }
      summary {
        total_amount
        purchase_credit
      }
      payment {
        gateway
      }
    }
    outbound_shipping_code
    styled_at
    delivered_at
    scheduled_at
    rental
    rateable
    swapped
    is_first_tote
    tote_products {
      id
      customer_coupon_id
      added_item
      reason_in_tote
      product_item {
        state
      }
      tote_specific_price
      reason_in_tote
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
      rating {
        id
        fit
        bust
        waist
        hips
        length
        shoulder
        inseam
        thigh
        times_worn
        size_rating
        style_rating
        quality_rating
        style
        washed_out
        made_rough
        style_issue_weight
        style_issue_color
        style_issue_print
        style_issue_material
        style_issue_small
        style_issue_big
        folded
        style_issue_fabric
        style_issue_pattern
        style_issue_silhouette
        quality
        smelled
        wrinkled
        damaged
        too_worn
        not_functional
        comment
      }
      product {
        closet_count
        swappable
        category {
          id
          name
          accessory
          clothing
        }
        brand {
          id
          name
        }
        category_rule {
          slug
        }
        catalogue_photos {
          thumb_url
          medium_url
          full_url
        }
        id
        full_price
        title
        type
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
      id
      rating
      arrived_slowly
      wrong_style
      didnt_fit
      wasnt_customized
      poor_condition
      reason
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

const QUERY_BILLING_DATE = gql`
  query {
    me {
      id
      subscription {
        billing_date
      }
    }
  }
`

const QUERY_ME_SUBSCRIPTION = gql`
  query {
    me {
      id
      display_cart_entry
      first_delivered_tote
      customer_photo_incentive_detail {
        incentive_hint
        link_url
      }
      locked_tote_count
      unread_customer_photo_review
      in_first_month_and_monthly_subscriber
      free_service(with_contract: true) {
        state
        can_apply_refund {
          errors {
            error_code
            message
          }
          success
        }
        can_subscribe
        account_entrance
        display_guide_in_product_page
      }
      subscription {
        id
        display_interval
        display_name
        billing_date
        billing_date_extending
        remain_additional_days
        current_subscription_type_name
        hold_date
        on_hold
        totes_left
        tote_entry_state
        subscription_type {
          ...meSubscriptionType
        }
        promo_code
        status
        summer_plan
        contract_display {
          menu_display
          tote_display
          order_display
        }
        fast_shipping {
          fast_shipping
        }
      }
    }
  }

  fragment meSubscriptionType on SubscriptionType {
    id
    base_price
    display_name
    interval
    original_price
    sub_display_name
    operation_plan {
      name
    }
    preview {
      auto_renew_discount
    }
    occasion
    occasion_display
  }
`

const QUERY_ME_CONTRACT_DISPLAY = gql`
  query {
    me {
      id
      enable_payment_contract {
        id
      }
      subscription {
        id
        contract_display {
          menu_display
          tote_display
          order_display
        }
        fast_shipping {
          fast_shipping
        }
        subscription_type {
          ...meSubscriptionType
        }
        auto_charge_management_page {
          new_subscription_type
          configuration_file_url_v2
        }
      }
    }
  }
  fragment meSubscriptionType on SubscriptionType {
    id
    base_price
    display_name
    interval
    original_price
    sub_display_name
    operation_plan {
      name
    }
    preview {
      auto_renew_discount
    }
    occasion
    occasion_display
  }
`

const QUERY_ME_TERSE = gql`
  query {
    me {
      id
      email
      nickname
      telephone
      avatar_url
      credit_scores {
        id
        score
        telephone
      }
    }
  }
`

const QUERY_ME_ALL_COUPON = gql`
  query AllPromoCodesAndCoupon(
    $subscription_type_id: ID
    $type: PromoCodeTypes
  ) {
    me {
      id
      used_coupons(filter: expired_recently) {
        ...currentCoupon
      }
      valid_coupons {
        ...currentCoupon
      }
      expired_coupons(filter: expired_recently) {
        ...currentCoupon
      }
      used_promo_codes(filter: expired_recently, type: $type) {
        ...currentPromoCode
      }
      valid_promo_codes(
        subscription_type_id: $subscription_type_id
        type: $type
      ) {
        ...currentPromoCode
      }
      expired_promo_codes(filter: expired_recently, type: $type) {
        ...currentPromoCode
      }
    }
  }

  fragment currentPromoCode on PromoCode {
    code
    description
    discount_amount
    expiration_date
    discount_percent
    type
    condition_display
    status
    title
    rules
    subscription_type_ids
    used_at
  }

  fragment currentCoupon on Coupon {
    customer_coupon_id
    expired_at
    applied_at
    rules
    sub_title
    title
    type
    valid_days
    status
  }
`

const QUERY_ME_VALID_COUPON = gql`
  query ValidCoupon {
    me {
      id
      valid_coupons {
        customer_coupon_id
        expired_at
        rules
        sub_title
        title
        type
        valid_days
        status
      }
    }
  }
`

const QUERY_ME_VALID_PROMOCODES = gql`
  query ValidPromoCodes($subscription_type_id: ID, $type: PromoCodeTypes) {
    me {
      id
      valid_promo_codes(
        subscription_type_id: $subscription_type_id
        type: $type
      ) {
        code
        description
        discount_amount
        expiration_date
        status
        title
        rules
        type
        condition_display
        discount_percent
        subscription_type_ids
      }
    }
  }
`

const QUERY_ME_PURCHASE_CREDIT = gql`
  query {
    me {
      id
      available_purchase_credit {
        amount
        cents
        currency
        formatted
      }
      expired_purchase_credit {
        amount
        cents
        currency
        formatted
      }
      spent_purchase_credit {
        amount
        cents
        currency
        formatted
      }
      time_cash_transactions {
        amount
        created_at
        transaction_type
        income
      }
    }
  }
`

const QUERY_AVAILABLE_PURCHASE_CREDIT = gql`
  query {
    me {
      id
      available_purchase_credit {
        amount
        cents
        currency
        formatted
      }
    }
  }
`

const QUERY_ME_REFERRALS = gql`
  query {
    me {
      id
      active_referral_program {
        sender_amount
      }
      referral_url
      referrals {
        avatar_url
        email
        first_name
        friend_registered_at
        friend_subscription_started_on
        last_name
        nickname
        redeemed_at
        status
        telephone
      }
    }
  }
`
const QUERY_ME_CONTRACT = gql`
  query {
    me {
      id
      free_service(with_contract: true) {
        state
        can_apply_refund {
          errors {
            error_code
            message
          }
          success
        }
        can_subscribe
        account_entrance
        display_guide_in_product_page
      }
      enable_payment_contract {
        id
        can_disable
        payment_method_gateway
      }
      subscription {
        id
        contract_display {
          menu_display
          tote_display
          order_display
        }
        subscription_type {
          ...meSubscriptionType
        }
        auto_charge_management_page {
          new_subscription_type
          configuration_file_url_v2
        }
      }
    }
  }
  fragment meSubscriptionType on SubscriptionType {
    id
    base_price
    display_name
    interval
    original_price
    sub_display_name
    operation_plan {
      name
    }
    preview {
      auto_renew_discount
    }
    occasion
    occasion_display
  }
`
const QUERY_ME_CREDIT_ACCOUNT = gql`
  query creditAccount($page: Int, $per_page: Int) {
    me {
      id
      credit_account(page: $page, per_page: $per_page) {
        balance
        referral_amount
        transactions {
          amount
          created_at
          income
          transaction_type
        }
      }
    }
  }
`
const QUERY_ME_BALANCE = gql`
  query {
    me {
      id
      credit_account {
        balance
      }
    }
  }
`

const QUERY_MY_STYLE = gql`
  query {
    me {
      id
      style {
        birthday
        bra_size
        brand
        created_at
        cup_size
        dress_size
        from
        height_inches
        hip_size
        hip_size_inches
        id
        inseam
        shoulder_size
        jean_size
        marital_status
        mom
        occupation
        pant_size
        shape
        skirt_size
        social_focus
        top_fit
        top_size
        updated_at
        waist_size
        weekend_focus
        weight
        work
        work_focus
        bust_size_number
        waist_shape
        belly_shape
        shoulder_shape
        skirt_habit
        jean_prefer
        jean_waist_fit
        jean_size_unknow
      }
    }
  }
`

const QUERY_ME_CUSTOMER_PRODUCT_FILTERS = gql`
  query {
    me {
      id
      customer_product_filters {
        accessory_categories
        clothing_categories
        clothing_colors
        prints
      }
    }
  }
`

const QUERY_ME_REFERRAL_BANNER = gql`
  query {
    me {
      id
      referral_banner {
        referral_banner_height
        referral_banner_width
        referral_entry_banner_height
        referral_entry_banner_width
        referral_program_banner_url
        referral_program_jump_url
        referred_program_entry_banner_url
      }
    }
  }
`

const QUERY_ONBOARDING_QUESTIONS = gql`
  query {
    onboarding_questions
  }
`

const QUERY_SUCCESS_REFERRAL = gql`
  query FetchSuccessReferrals {
    success_referrals {
      customer_avatar
      time_cash_amount
      referral_count
      customer_name
    }
  }
`

const QUERY_FREESERVICE = gql`
  query {
    me {
      id
      free_service(with_contract: true) {
        state
        can_apply_refund {
          errors {
            error_code
            message
          }
          success
        }
        can_subscribe
        account_entrance
        display_guide_in_product_page
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

const QUERY_SEASON = gql`
  query {
    season_sort_switch {
      options
      selected_option
    }
    season_change_prompt {
      option
    }
  }
`

const MUTATION_SIGNIN = gql`
  mutation SignInCustomer($customer: SignInCustomerInput!) {
    SignInCustomer(input: $customer) {
      customer {
        attribute_preferences {
          name
        }
        id
        email
        nickname
        telephone
        avatar_url
        subscription {
          id
          billing_date
          billing_date_extending
          remain_additional_days
          hold_date
          on_hold
          promo_code
          status
          tote_entry_state
          subscription_type {
            ...meSubscriptionType
          }
        }
        closet(filters: { per_page: 100 }) {
          id
        }
        credit_scores {
          id
          score
          telephone
        }
        shipping_address {
          address_1
          address_2
          city
          company
          country
          customer_id
          district
          full_name
          id
          state
          telephone
          verified
          zip_code
        }
        style {
          id
          updated_at
          height_inches
          weight
          waist_size
          hip_size_inches
          inseam
          shoulder_size
          bra_size
          cup_size
          top_size
          dress_size
          pant_size
          waist_shape
          belly_shape
          shoulder_shape
          skirt_habit
          jean_prefer
          jean_waist_fit
          jean_size_unknow
          waist_shape
          belly_shape
          shoulder_shape
          skirt_habit
          jean_prefer
          jean_waist_fit
          jean_size_unknow
        }
      }
    }
  }
  fragment meSubscriptionType on SubscriptionType {
    id
    base_price
    display_name
    interval
    original_price
    sub_display_name
    operation_plan {
      name
    }
    preview {
      auto_renew_discount
    }
    occasion
    occasion_display
  }
`

const MUTATION_SIGNOUT = gql`
  mutation {
    SignOutCustomer(input: {}) {
      clientMutationId
    }
  }
`

const MUTATION_UPDATE_SHIPPING_ADDRESS = gql`
  mutation SubmitClassicCheckout($shipping: UpdateShippingAddressInput!) {
    UpdateShippingAddress(input: $shipping) {
      errors
      shipping_address {
        address_1
        address_2
        city
        state
        country
        district
        full_name
        zip_code
        telephone
        id
      }
    }
  }
`

const MUTATION_UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($customer: UpdateCustomerInput!) {
    UpdateCustomer(input: $customer) {
      clientMutationId
      errors
      customer {
        avatar_url
        display_cart_entry
      }
      auto_redeem_exchange_card
    }
  }
`

const MUTAITON_UPDATE_STYLE = gql`
  mutation updateStyle($input: UpdateStyleInput!) {
    UpdateStyle(input: $input) {
      style {
        shoulder_size_skip
        inseam_skip
        birthday
        bra_size
        brand
        created_at
        cup_size
        dress_size
        from
        height_inches
        hip_size
        hip_size_inches
        id
        inseam
        shoulder_size
        jean_size
        marital_status
        mom
        occupation
        pant_size
        shape
        skirt_size
        top_fit
        top_size
        updated_at
        waist_size
        weekend_focus
        social_focus
        work_focus
        weight
        work
        bust_size_number
        waist_shape
        belly_shape
        shoulder_shape
        skirt_habit
        jean_prefer
        jean_waist_fit
        jean_size_unknow
      }
      incentive_url
      incentive_granted
    }
  }
`
const MUTAITON_UPDATE_PRODUCT_FILTER = gql`
  mutation UpdateCustomerProductFilter(
    $input: UpdateCustomerProductFiltersInput!
  ) {
    UpdateCustomerProductFilters(input: $input) {
      errors
    }
  }
`
const MUTAITON_UPDATE_ATTRIBUTE_PREFERENCES = gql`
  mutation createCustomerAttributePreferences(
    $input: CreateCustomerAttributePreferencesInput!
  ) {
    CreateCustomerAttributePreferences(input: $input) {
      errors
    }
  }
`

const MUTATION_HOLD_SUBSCRIPTION = gql`
  mutation holdSubscription($input: HoldSubscriptionInput!) {
    HoldSubscription(input: $input) {
      clientMutationId
      errors
    }
  }
`

const MUTATION_REACTIVATE_SUBSCRIPTION = gql`
  mutation {
    ReactivateSubscription(input: {}) {
      subscription {
        hold_date
        billing_date
      }
      errors
    }
  }
`
const MUTAITON_IDENTITY_AUTHENTICATION = gql`
  mutation identityAuthentication($input: IdentityAuthenticationInput!) {
    IdentityAuthentication(input: $input) {
      errors
      verified
    }
  }
`
const MUTAITON_CREATE_CUSTOMER_ATTRIBUTES = gql`
  mutation createCustomerAttributes($input: CreateCustomerAttributesInput!) {
    CreateCustomerAttributes(input: $input) {
      errors
      success
    }
  }
`

const QUERY_BUST_PREDICT = gql`
  query bustPredict($input: StyleInput) {
    bust_predict(style_input: $input) {
      available
      max_value
      min_value
      type
    }
  }
`

const QUERY_WAIST_PREDICT = gql`
  query waistPredict($input: StyleInput) {
    waist_predict(style_input: $input) {
      available
      max_value
      min_value
      type
    }
  }
`

const QUERY_HIPS_PREDICT = gql`
  query hipsPredict($input: StyleInput) {
    hips_predict(style_input: $input) {
      available
      max_value
      min_value
      type
    }
  }
`

const FETCH_WECHAT_LOGIN = `${Client.ORIGIN}/authentications/wechat_native?`

const FETCH_TELEPHONE_LOGIN = `${Client.ORIGIN}/profile`

export default {
  QUERY_ME,
  QUERY_ME_TERSE,
  QUERY_ME_ALL_COUPON,
  QUERY_ME_VALID_COUPON,
  QUERY_ME_VALID_PROMOCODES,
  QUERY_AVAILABLE_PURCHASE_CREDIT,
  QUERY_ME_PURCHASE_CREDIT,
  QUERY_ME_SUBSCRIPTION,
  QUERY_BILLING_DATE,
  QUERY_ME_REFERRALS,
  QUERY_MY_STYLE,
  QUERY_ME_CONTRACT,
  QUERY_ME_CONTRACT_DISPLAY,
  QUERY_ME_CUSTOMER_PRODUCT_FILTERS,
  QUERY_ME_REFERRAL_BANNER,
  QUERY_ME_CREDIT_ACCOUNT,
  QUERY_ME_BALANCE,
  QUERY_ONBOARDING_QUESTIONS,
  QUERY_SUCCESS_REFERRAL,
  QUERY_FREESERVICE,
  QUERY_SEASON,
  MUTATION_SIGNIN,
  MUTATION_SIGNOUT,
  MUTATION_UPDATE_SHIPPING_ADDRESS,
  MUTATION_UPDATE_CUSTOMER,
  MUTAITON_UPDATE_STYLE,
  FETCH_WECHAT_LOGIN,
  FETCH_TELEPHONE_LOGIN,
  MUTAITON_UPDATE_PRODUCT_FILTER,
  MUTAITON_UPDATE_ATTRIBUTE_PREFERENCES,
  MUTATION_HOLD_SUBSCRIPTION,
  MUTATION_REACTIVATE_SUBSCRIPTION,
  MUTAITON_IDENTITY_AUTHENTICATION,
  MUTAITON_CREATE_CUSTOMER_ATTRIBUTES,
  QUERY_BUST_PREDICT,
  QUERY_WAIST_PREDICT,
  QUERY_HIPS_PREDICT
}
