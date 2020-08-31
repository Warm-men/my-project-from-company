export const ApplyFreeServiceToToteCart = success => {
  return {
    type: 'API:APPLYFREESERVICE:TOTECART',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    data: {
      query: `mutation WebApplyFreeServiceToToteCart($input: ApplyFreeServiceToToteCartInput!)
      {
        ApplyFreeServiceToToteCart(input: $input)
        {
          success
          errors {
            error_code
            message
          }
          tote_cart {
            max_accessory_count
          }
        }
      }`,
      variables: {
        input: {}
      }
    }
  }
}

export const RemoveFreeServiceFromToteCart = success => {
  return {
    type: 'API:REMOVEFREESERVICE:TOTECART',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    data: {
      query: `mutation WebRemoveFreeServiceFromToteCart($input: RemoveFreeServiceFromToteCartInput!)
      {
        RemoveFreeServiceFromToteCart(input: $input)
        {
          success
          errors {
            error_code
            message
          }
          tote_cart {
            max_accessory_count
          }
        }
      }`,
      variables: {
        input: {}
      }
    }
  }
}
