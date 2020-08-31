export default `
query FetchExtendableSubscriptionTypes {
  extendable_subscription_types {
    default_select_subscription_type_id
    needs_migration
    flat_subscription_types {
      id
      extend_type
      interval
      base_price
      original_price
      internal_name
      display_name
      sub_display_name
      clothing_count
      accessory_count
      new_banner_url
      description
      operation_plan {
        id
        name
        slug
        label_image_url
        image_url
        new_banner_url
        icon_url
        referral_banner
      }
    }
    subscription_groups {
      title
      image
      subscription_types {
        id
        interval
        pretty_name
        base_price
        original_price
        internal_name
        display_name
        sub_display_name
        clothing_count
        accessory_count
        new_banner_url
        description
        auto_renew_discount_hint
        auto_renew_discount_amount
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
        }
        operation_plan {
          id
          name
          slug
          label_image_url
          image_url
          new_banner_url
          icon_url
          icon_v2_url
          referral_banner
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
    }
  }
}
`
