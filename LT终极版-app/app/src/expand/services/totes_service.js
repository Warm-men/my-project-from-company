import gql from 'graphql-tag'

const QUERY_TOTES = gql`
  query Totes(
    $page: Int
    $exclude_tote_ids: [Int]
    $per_page: Int
    $filter: TotesFilter
  ) {
    totes(
      page: $page
      per_page: $per_page
      exclude_tote_ids: $exclude_tote_ids
      filter: $filter
    ) {
      id
      shipped_at
      locked_at
      state
      display_rate_incentive_guide
      perfect_closets {
        id
      }
      skip_perfect_closet
      other_product_feedback
      product_parts {
        product_title
        parts {
          title
        }
      }
      delivered_at
      scheduled_at
      rateable
      outbound_shipping_code
      customer_nth_tote
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
          discount
          purchase_credit
        }
        payment {
          id
          gateway
        }
        promo_code {
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
        }
      }
      fc_address
      hive_box_scheduled_pickup {
        tracking_number
        latest_return_at
        status
      }
      tote_rating {
        id
        rating
        max_rating
        calculated_rating
        arrived_slowly
        wrong_style
        didnt_fit
        wasnt_customized
        poor_condition
        reason
      }
      tote_products {
        id
        customer_coupon_id
        is_perfect
        added_item
        order {
          id
        }
        service_feedback {
          quality_issues_human_names
          quality_photo_urls
        }
        product_item {
          state
        }
        transition_info {
          modified_price
        }
        transition_state
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
          rating_answers
          quality_photo_urls
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
          parts {
            title
          }
          category {
            id
            name
            accessory
            clothing
          }
          categories {
            id
            name
          }
          category_rule {
            slug
          }
          brand {
            id
            name
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
          member_price
          tote_slot
        }
      }
      rating_incentive {
        app_image_url
        has_incentived
        has_incentived_amount
        link
      }
      progress_status {
        delivered_at
        description
        locked_at
        schedule_returned_at
        shipped_at
        status
        title
        hide_delivered_btn
      }
      tote_free_service {
        ...ToteFreeServiceFields
      }
      scheduled_return {
        ...ScheduledReturnFields
      }
      pull_tote_tip
    }
  }

  fragment ToteFreeServiceFields on ToteFreeService {
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

  fragment ScheduledReturnFields on ScheduledReturn {
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
      state
    }
  }
`

const QUERY_HISTORY_TOTES = gql`
  query Totes(
    $page: Int
    $exclude_tote_ids: [Int]
    $per_page: Int
    $filter: TotesFilter
  ) {
    totes(
      page: $page
      per_page: $per_page
      exclude_tote_ids: $exclude_tote_ids
      filter: $filter
    ) {
      id
      state
      delivered_at
      locked_at
      display_rate_incentive_guide
      rating_incentive {
        has_incentived_amount
      }
      tote_rating {
        id
        rating
        max_rating
      }
      tote_products {
        id
        customer_coupon_id
        added_item
        order {
          id
        }
        product_item {
          state
        }
        transition_info {
          modified_price
        }
        transition_state
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
        product {
          disabled
          closet_count
          category {
            id
            name
            accessory
            clothing
          }
          categories {
            id
            name
          }
          category_rule {
            slug
          }
          brand {
            id
            name
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
          member_price
          tote_slot
        }
      }
    }
  }
`

const QUERY_NEXT_TOTE_STATUS = gql`
  query NextToteStatus {
    me {
      id
      subscription {
        id
        next_tote_status {
          can_create_tote
          message
          code
          final_code
        }
      }
    }
  }
`

const QUERY_TRACKER_TOTE = gql`
  query ToteTrackerTotes {
    latest_rental_tote {
      ...toteTrackerFields
      rating_incentive {
        app_image_url
        has_incentived
        has_incentived_amount
        link
      }
      onboarding_tips
      stock_locked_at
      product_parts {
        product_title
        parts {
          title
        }
      }
    }
    latest_active_try_on_tote {
      ...toteTrackerFields
    }
  }
  fragment toteTrackerFields on Tote {
    id
    bonus
    state
    scheduled_pickups {
      shipping_code
      id
      address_1
      address_2
      city
      processing_status
      requested_pickup_at
      state
      tote_id
      zip_code
      telephone
      full_name
      district
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
        discount
        purchase_credit
      }
      payment {
        id
        gateway
      }
      promo_code {
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
        category_rule {
          slug
        }
        categories {
          id
          name
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
`

const QUERY_TRACKER_TOTE_PRODUCT_ITEM = gql`
  query ToteTrackerTotes($id: Int) {
    tote(id: $id) {
      id
      tote_products {
        id
        product_item {
          state
        }
      }
    }
  }
`

const QUERY_PRODUCT_ORDER = gql`
  query ToteProductOrder($id: ID) {
    order(id: $id) {
      successful
      payment_failed
      payment_error_message
      free_service_fee_tip {
        content
        title
      }
    }
  }
`

const QUERY_ORDER = gql`
  query Order($id: ID) {
    order(id: $id) {
      id
      paid_at
      line_items {
        ... on ProductLineItem {
          amount
          size {
            abbreviation
            id
            name
          }
          product {
            id
            parts {
              title
            }
            brand {
              id
              name
            }
            catalogue_photos {
              thumb_url
              medium_url
              full_url
            }
            title
            full_price
          }
        }
      }
      summary {
        total_amount
        discount
        purchase_credit
      }
      payment {
        id
        gateway
      }
    }
  }
`

const QUERY_TOTE_CHECKOUT_PREVIEW = gql`
  query ToteCheckoutPreview(
    $promo_code: String
    $tote_id: ID!
    $tote_product_ids: [ID!]!
    $order_id: ID
    $disable_promo_code: Boolean
  ) {
    tote_checkout_preview(
      promo_code: $promo_code
      tote_id: $tote_id
      tote_product_ids: $tote_product_ids
      order_id: $order_id
      disable_promo_code: $disable_promo_code
    ) {
      invalid_promo_codes {
        code
        diff_amount
        product_scope
        description
        discount_amount
        expiration_date
        discount_percent
        type
        condition_display
        status
        title
        rules
      }
      next_promo_code_hint
      preview {
        cash_price
        final_price
        promo_code_price
      }
      valid_promo_codes {
        code
        diff_amount
        product_scope
        description
        discount_amount
        expiration_date
        discount_percent
        type
        condition_display
        status
        title
        rules
      }
    }
  }
`

const QUERY_TOTE_COUNT = gql`
  query ToteCount {
    tote_count
  }
`

const MUTATION_PURCHASE_WHOLE_TOTE = gql`
  mutation PurchaseWholeTote($tote: PurchaseWholeToteInput!) {
    PurchaseWholeTote(input: $tote) {
      errors
      tote {
        id
      }
    }
  }
`

//确认订单
const MUTATION_LOCK_TOTE = gql`
  mutation LockTote($input: LockToteInput!) {
    LockTote(input: $input) {
      tote {
        tote_products {
          id
          customer_coupon_id
          added_item
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
            category {
              id
              name
              accessory
              clothing
            }
            categories {
              id
              name
            }
            category_rule {
              slug
            }
            brand {
              id
              name
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
        state
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
      }
      errors
      code
      tote_swap_questionnaire {
        options {
          key
          value
        }
        theme_question
        improvement_question
      }
    }
  }
`

const MUTATION_RATE_TOTE = gql`
  mutation RateTote($tote_rating: RateToteInput!) {
    RateTote(input: $tote_rating) {
      tote_rating {
        rating
        tote_id
      }
    }
  }
`

const MUTATION_SCHEDULE_TOTE = gql`
  mutation ScheduleTotePickup($input: ScheduleTotePickupInput!) {
    ScheduleTotePickup(input: $input) {
      tote {
        state
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
      }
      errors
    }
  }
`

const MUTATION_SCHEDULE_AUTO_PICKUP = gql`
  mutation ScheduleAutoPickup($input: ScheduleAutoPickupInput!) {
    ScheduleAutoPickup(input: $input) {
      errors {
        error_code
        message
      }
      return_warn
      success
    }
  }
`

const MUTATION_SCHEDULE_SELF_DELIVERY = gql`
  mutation ScheduleSelfDelivery($input: ScheduleSelfDeliveryInput!) {
    ScheduleSelfDelivery(input: $input) {
      errors {
        error_code
        message
      }
      return_warn
      success
    }
  }
`

const MUTATION_TOTE_MARK_DELIVERED = gql`
  mutation MarkToteDelivered($input: MarkToteDeliveredInput!) {
    MarkToteDelivered(input: $input) {
      tote {
        id
        bonus
        state
        rental
        rateable
        delivered_at
        scheduled_at
        tote_rating {
          id
          rating
          tote_id
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
        }
        rating_incentive {
          app_image_url
          has_incentived
          has_incentived_amount
          link
        }
      }
      errors
    }
  }
`
const MUTATION_TOTE_SWAP_PRODUCT = gql`
  mutation toteSwapProduct($input: SwapToteProductInput!) {
    SwapToteProduct(input: $input) {
      errors
      tote_product {
        id
        customer_coupon_id
        added_item
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
        product {
          closet_count
          category {
            id
            name
            accessory
            clothing
          }
          categories {
            id
            name
          }
          category_rule {
            slug
          }
          brand {
            id
            name
          }
          catalogue_photos {
            thumb_url
            medium_url
            full_url
          }
          id
          title
          type
          swappable
        }
      }
    }
  }
`

const MUTATION_TOTE_QUEUE_PRODUCT_SIZER = gql`
  mutation queueProductSizer($input: QueueProductSizerInput!) {
    QueueProductSizer(input: $input) {
      clientMutationId
      errors
    }
  }
`

const MUTATION_TOTE_CHECKOUT_PRODUCT = gql`
  mutation checkoutToteProducts($input: CheckoutToteProductsInput!) {
    CheckoutToteProducts(input: $input) {
      payment {
        id
        authorization_details
        state
        gateway
      }
      order {
        id
        successful
      }
    }
  }
`

const MUTATION_UPDATE_HIVE_BOX_SCHEDULED_PICK_UP = gql`
  mutation updateHiveBoxScheduledPickup(
    $input: UpdateHiveBoxScheduledPickupInput!
  ) {
    UpdateHiveBoxScheduledPickup(input: $input) {
      hive_box_scheduled_pickup {
        id
        latest_return_at
        status
        tracking_number
      }
    }
  }
`

const MUTATION_CREATE_ONBOARDING_TOTE = gql`
  mutation createOnboardingTote($input: CreateOnboardingToteInput!) {
    CreateOnboardingTote(input: $input) {
      errors
    }
  }
`

const QUERY_TOTE_STATE_TIPS = gql`
  query ToteStateTips {
    tote_state_tips {
      credit_account_validation {
        errors {
          error_code
          message
        }
        success
      }
      transaction_validation {
        errors {
          error_code
          message
        }
        success
      }
      subscription_validation {
        errors {
          error_code
          message
        }
        success
      }
      extra_validation {
        errors {
          error_code
          message
        }
        success
      }
      tote_return_validation {
        errors {
          error_code
          message
        }
        success
      }
    }
  }
`

const MUTATION_TOTE_CART_PLACE_ORDER = gql`
  mutation toteCartPlaceOrder($input: ToteCartPlaceOrderInput!) {
    ToteCartPlaceOrder(input: $input) {
      errors {
        error_code
        message
      }
      success
      tote {
        id
      }
      tote_swap_questionnaire {
        options {
          key
          value
        }
        theme_question
        improvement_question
      }
      customer {
        id
        display_cart_entry
        first_delivered_tote
        with_first_customer_photo_incentive
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
  }
`

const QUERY_UNRETURN_TOTE_PARTS = gql`
  query UnreturnToteParts($tote_id: ID!) {
    unreturn_tote_parts {
      current(tote_id: $tote_id) {
        product_parts {
          product_title
          part_titles
        }
        bag_tips
      }
      history {
        product_parts {
          product_title
          part_titles
        }
        bag_tips
      }
    }
  }
`

const QUERY_EXPRESS = gql`
  query Express($tracking_number: String!) {
    express(tracking_number: $tracking_number) {
      present
    }
  }
`

export default {
  QUERY_TOTES,
  QUERY_ORDER,
  QUERY_HISTORY_TOTES,
  QUERY_TRACKER_TOTE,
  QUERY_NEXT_TOTE_STATUS,
  QUERY_TRACKER_TOTE_PRODUCT_ITEM,
  QUERY_PRODUCT_ORDER,
  QUERY_TOTE_CHECKOUT_PREVIEW,
  QUERY_TOTE_COUNT,
  QUERY_TOTE_STATE_TIPS,
  MUTATION_PURCHASE_WHOLE_TOTE,
  MUTATION_LOCK_TOTE,
  MUTATION_RATE_TOTE,
  MUTATION_SCHEDULE_TOTE,
  MUTATION_TOTE_MARK_DELIVERED,
  MUTATION_TOTE_SWAP_PRODUCT,
  MUTATION_TOTE_QUEUE_PRODUCT_SIZER,
  MUTATION_TOTE_CHECKOUT_PRODUCT,
  MUTATION_CREATE_ONBOARDING_TOTE,
  MUTATION_UPDATE_HIVE_BOX_SCHEDULED_PICK_UP,
  MUTATION_TOTE_CART_PLACE_ORDER,
  MUTATION_SCHEDULE_AUTO_PICKUP,
  MUTATION_SCHEDULE_SELF_DELIVERY,
  QUERY_UNRETURN_TOTE_PARTS,
  QUERY_EXPRESS
}
