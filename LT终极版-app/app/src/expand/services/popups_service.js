import gql from 'graphql-tag'

const QUERY_POPUPS = gql`
  query {
    popups {
      id
      image
      routes
      url
    }
  }
`

const MUTATION_MARKET_POPUP = gql`
  mutation MarkPopup($input: MarkPopupInput!) {
    MarkPopup(input: $input) {
      success
    }
  }
`

const MUTATION_SAVE_PROMO_CODE_TO_WALLET = gql`
  mutation SavePromoCodeToWallet($input: SavePromoCodeToWalletInput!) {
    SavePromoCodeToWallet(input: $input) {
      customer {
        valid_promo_codes {
          code
          description
          discount_amount
          expiration_date
          status
          title
          rules
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
      }
    }
  }
`

export default {
  QUERY_POPUPS,
  MUTATION_MARKET_POPUP,
  MUTATION_SAVE_PROMO_CODE_TO_WALLET
}
