import gql from 'graphql-tag'
import { Client } from './client'

const MUTATION_GET_PHONE_CODE = gql`
  mutation getPhoneCode($input: SendVerificationCodeInput!) {
    SendVerificationCode(input: $input) {
      telephone
      salt
      hashed_code
    }
  }
`

const QUERY_SUBSCRIPTION_TYPES = gql`
  query SubscriptionTypes(
    $filter: SubscriptionTypesFilter!
    $occasion_filter: SubscriptionTypesOccasionFilter
  ) {
    subscription_types(filter: $filter, occasion_filter: $occasion_filter) {
      is_signupable
      days_interval
      ...currentSubscription
    }
  }

  fragment currentSubscription on SubscriptionType {
    id
    accessory_count
    clothing_count
    base_price
    display_name
    interval
    original_price
    sub_display_name
    banner_height
    banner_url
    banner_width
    operation_plan {
      name
      image_url
      image_width
      image_height
      icon_height
      icon_url
      icon_width
    }
    available_promo_codes {
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
    preview {
      cash_price
      expiration_date
      final_price
      name
      promo_code_price
      auto_renew_discount
    }
  }
`

const QUERY_SUBSCRIPTION_TYPE = gql`
  query SubscriptionType(
    $id: ID
    $promo_code: String
    $is_charge_after_entrust: Boolean
  ) {
    subscription_type(id: $id) {
      is_signupable
      days_interval
      ...currentSubscription
    }
  }

  fragment currentSubscription on SubscriptionType {
    id
    base_price
    display_name
    interval
    original_price
    sub_display_name
    new_banner_height
    new_banner_url
    new_banner_width
    description
    pretty_name
    auto_renew_discount_amount
    operation_plan {
      name
      image_url
      image_width
      image_height
      new_banner_height
      new_banner_url
      new_banner_width
      icon_height
      icon_url
      icon_v2_url
      icon_width
      label_image_url
      label_image_height
      label_image_width
    }
    available_promo_codes {
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
    auto_renew_discount_hint
    preview(
      promo_code: $promo_code
      is_charge_after_entrust: $is_charge_after_entrust
    ) {
      auto_renew_discount
      cash_price
      expiration_date
      final_price
      name
      promo_code_price
    }
  }
`

const QUERY_EXTENDABLE_SUBSCRIPTION_TYPES = gql`
  query ExtendableSubscriptionTypes {
    extendable_subscription_types {
      needs_migration
      default_select_subscription_type_id
      subscription_groups {
        image
        subscription_types {
          ...currentSubscription
        }
        title
      }
    }
  }

  fragment currentSubscription on SubscriptionType {
    id
    base_price
    display_name
    interval
    original_price
    sub_display_name
    new_banner_height
    new_banner_url
    new_banner_width
    extend_type
    description
    pretty_name
    auto_renew_discount_amount
    operation_plan {
      name
      image_url
      image_width
      image_height
      new_banner_height
      new_banner_url
      new_banner_width
      icon_height
      icon_url
      icon_v2_url
      icon_width
      label_image_url
      label_image_height
      label_image_width
    }
    available_promo_codes {
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
    auto_renew_discount_hint
    preview {
      auto_renew_discount
      cash_price
      expiration_date
      final_price
      name
      promo_code_price
    }
  }
`

const QUERY_SUBSCRIPTION_MIGRATION_PREVIEW = gql`
  query SubscriptionMigrationPreview {
    subscription_migration_preview(raise_error: false) {
      errors {
        error_code
        message
      }
      available_migrate_options {
        accessory_count
        clothing_count
        next_billing_at
        title
        tote_count
        target_subscription_type_id
      }
    }
  }
`

const MUTATION_SUBSCRIPTION_MIGRATION = gql`
  mutation SubscriptionMigration($input: SubscriptionMigrationInput!) {
    SubscriptionMigration(input: $input) {
      clientMutationId
    }
  }
`

const QUERY_FAQ = gql`
  {
    faq_version {
      id
      version
      url
    }
  }
`

const QUERY_COPYWRITING_ADJUSTMENTS = gql`
  {
    copywriting_adjustments {
      non_subscriber_home_page {
        play_tote_title
        words_above_lock_button
      }
      non_subscriber_tote_page {
        first_frame_title
        first_frame_content
      }
      searching_feature
    }
  }
`

const FETCH_ERROR_MESSAGE = `${Client.ORIGIN}/static/err`

const FETCH_SUBSCRIPTION_TYPES = `${Client.ORIGIN}/api/subscription_types`

const FETCH_SERVICE_HOLD = `${Client.ORIGIN}/api/customers/0/subscriptions`

const FETCH_FEEDBACK = `${Client.ORIGIN}/native/app/feedback`

const FETCH_ERROR_SIGERR = `${Client.ORIGIN}/static/sigerr?`

const FETCH_CHECK_VERSION = `${Client.ORIGIN}/hps/version.json`

const WEBPAGE_MIGRATION = `${
  Client.ORIGIN
}/promo/agreement_pages?config=/promo/config/kol_activity/newpackage/migration.json`

export default {
  MUTATION_GET_PHONE_CODE,
  QUERY_SUBSCRIPTION_TYPES,
  QUERY_SUBSCRIPTION_TYPE,
  QUERY_EXTENDABLE_SUBSCRIPTION_TYPES,
  FETCH_ERROR_MESSAGE,
  FETCH_SUBSCRIPTION_TYPES,
  FETCH_SERVICE_HOLD,
  FETCH_FEEDBACK,
  FETCH_ERROR_SIGERR,
  FETCH_CHECK_VERSION,
  QUERY_SUBSCRIPTION_MIGRATION_PREVIEW,
  MUTATION_SUBSCRIPTION_MIGRATION,
  QUERY_FAQ,
  QUERY_COPYWRITING_ADJUSTMENTS,
  WEBPAGE_MIGRATION
}
