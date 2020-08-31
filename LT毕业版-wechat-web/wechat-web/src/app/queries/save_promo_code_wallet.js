export default `
mutation savePromoCodeToWallet($input: SavePromoCodeToWalletInput!) {
    SavePromoCodeToWallet(input: $input) {
      clientMutationId
      customer {
        id
        valid_promo_codes {
          discount_amount
          code
        }
      }
    }
  }
`
