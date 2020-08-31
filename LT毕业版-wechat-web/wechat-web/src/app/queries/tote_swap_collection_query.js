export default `
  query WebToteSwapCollection($slug: CustomCollectionSlug!) {
    tote_swap_collection(slug:$slug) {
      count
      description
      products {
        id
        catalogue_photos(limit: 1) {
          medium_url
          full_url
        }
        category {
          name
          accessory
        }
        title
      }
      slug
      title
    }
  }
`
