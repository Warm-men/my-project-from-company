export default `
  query WebToteSwapCollections {
    tote_swap_collections {
      title
      products {
        activated_at
        id
        type
        title
        brand {
          name
        }
        recommended_size
        recommended_size_abbr
        catalogue_photos(limit: 1) {
          medium_url
          full_url
        }
        category {
          name
          accessory
        }
      }
    }
  }
`
